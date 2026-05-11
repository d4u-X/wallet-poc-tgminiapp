import type { Context } from 'grammy';
import { resolve, dirname } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { autoRetry } from '@grammyjs/auto-retry';
import { run, type RunnerHandle } from '@grammyjs/runner';
import { md } from '@vlad-yakovlev/telegram-md';
import { Bot, InlineKeyboard, InputFile } from 'grammy';

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_URL = process.env.BOT_URL;
const BOT_DEVELOPER = process.env.BOT_DEVELOPER;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required');
if (!BOT_URL) throw new Error('BOT_URL is required');
if (!BOT_DEVELOPER) throw new Error('BOT_DEVELOPER is required');

const developers = BOT_DEVELOPER.split(',')
  .filter(Boolean)
  .map(Number)
  .filter(Number.isSafeInteger);

console.table({
  BOT_URL,
  BOT_DEVELOPER: developers.join(','),
});

const bot = new Bot<
  Context & {
    config: {
      developers: number[];
      isDeveloper: boolean;
    };
  }
>(BOT_TOKEN);

let runnerHandler: RunnerHandle = null!;

bot.api.config.use(
  autoRetry({
    maxRetryAttempts: 1,
    maxDelaySeconds: 10,
    rethrowInternalServerErrors: true,
  }),
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const coverImgPath = resolve(__dirname, '../assets/cover.jpg');

async function getAnnouncement() {
  try {
    const res = await fetch('https://api.feedsun.io/api/index/notice');
    const {
      data: { text, banner },
    } = await res.json();
    return [text, banner] as const;
  } catch {
    return ['Nothing', undefined];
  }
}

bot.use(async (ctx, next) => {
  ctx.config = {
    developers,
    isDeveloper: !!ctx.from?.id && developers.includes(ctx.from?.id),
  };
  await next();
});

bot.command('start', async (ctx) => {
  const announcement = await getAnnouncement();
  const cover = new InputFile(coverImgPath);
  await ctx.replyWithPhoto(announcement[1] ?? cover, {
    caption: md.build(announcement[0]),
    parse_mode: 'MarkdownV2',
    reply_markup: new InlineKeyboard()
      .text('Announcement', 'announcement')
      .row()
      .webApp('🎮 Play', BOT_URL)
      .row()
      .url('X', 'https://x.com/feedsuntron')
      .url('Channel', 'https://t.me/FeedSun')
      .url('Official website', 'https://feedsun.io'),
  });
});

bot.command('sendToChannel', async (ctx) => {
  if (!ctx.config.isDeveloper) return;
  const mention = ctx.message?.entities.find((entity) => entity.type === 'mention');
  if (!mention) return;
  const mentionedUser = ctx.message?.text?.slice(mention.offset, mention.offset + mention.length);
  if (!mentionedUser) return;
  const announcement = await getAnnouncement();
  const cover = new InputFile(coverImgPath);
  const result = await bot.api
    .sendPhoto(mentionedUser, announcement[1] ?? cover, {
      caption: md.build(announcement[0]),
      parse_mode: 'MarkdownV2',
      reply_markup: new InlineKeyboard()
        .url('🎮 Play', 'tg://resolve?domain=feedsun_bot&appname=app')
        .row()
        .url('X', 'https://x.com/feedsuntron')
        .url('Official website', 'https://feedsun.io'),
    })
    .catch(async (err) => {
      await ctx.reply(`Error: ${err.description}. Target: ${mentionedUser}`);
    });
  if (result) {
    await bot.api.pinChatMessage(result.chat.id, result.message_id);
  }
});

bot.callbackQuery('announcement', async (ctx) => {
  ctx.answerCallbackQuery({
    show_alert: false,
  });
  const announcement = await getAnnouncement();
  ctx.reply(`📢 Announcement\n\n${md.build(announcement[0])}`, { parse_mode: 'MarkdownV2' });
});

bot.catch((err) => {
  console.error(err);
  runnerHandler?.stop();
  process.exit(1);
});

runnerHandler = run(bot);

process.on('SIGINT', () => {
  runnerHandler.stop();
  console.info('Gracefully shutting down...');
  process.exit(0);
});
