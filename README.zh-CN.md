# Telegram Mini App（React + Vite）新手中文说明

本项目是一个 Telegram Mini App（TMA）前端模板，技术栈为 React + TypeScript + Vite，并演示了：

- Telegram Mini Apps SDK（[@tma.js/sdk-react](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)）
- Telegram UI（[@telegram-apps/telegram-ui](https://github.com/Telegram-Mini-Apps/TelegramUI)）
- TON Connect（[@tonconnect/ui-react](https://docs.ton.org/develop/dapps/ton-connect/overview)）

下面按新手最关心的 4 个问题整理：如何部署到自己的 Bot、代码核心结构、如何开发调试、如何添加页面与业务逻辑。

---

## 0. 根目录结构速览（你应该先看这些）

- [package.json](./package.json)：脚本与依赖，入口命令（dev/build/lint/deploy）
- [vite.config.ts](./vite.config.ts)：Vite 配置，包含 base 与本地 https（mkcert）
- [index.html](./index.html)：Vite HTML 入口
- [public/tonconnect-manifest.json](./public/tonconnect-manifest.json)：TON Connect 清单（需要改成你自己的项目信息）
- [src/index.tsx](./src/index.tsx)：应用入口（读取 Launch Params、启用 debug、初始化 SDK、挂载 React）
- [src/init.ts](./src/init.ts)：初始化 Telegram SDK/主题/viewport/backButton/Eruda 等
- [src/mockEnv.ts](./src/mockEnv.ts)：开发环境下模拟 Telegram 环境（只在 DEV 生效）
- [src/components/App.tsx](./src/components/App.tsx)：路由容器（HashRouter）+ Telegram UI 的 AppRoot
- [src/navigation/routes.tsx](./src/navigation/routes.tsx)：页面路由表（新增页面主要改这里）
- [.github/workflows/github-pages-deploy.yml](./.github/workflows/github-pages-deploy.yml)：GitHub Pages 自动部署（可选）

---

## 1. 如何部署到自己的 Telegram Bot（最短可用路径）

### 1.1 你需要准备什么

- 一个 Telegram Bot（用 BotFather 创建）
- 一个可公网访问的 HTTPS 域名（Telegram 客户端要求 Mini App 必须是 https）
- 一个可托管静态站点的地方（GitHub Pages / Vercel / Cloudflare Pages / 自建 Nginx 等）

本仓库是纯前端静态站点（build 后是 dist），不包含 Bot 后端与鉴权服务端。涉及安全校验（initData 校验、订单/支付回调等）需要你另建后端。

### 1.2 线上部署（以“你自己的域名”为例）

1. 修改站点基础路径（非常重要）

- 如果你部署到根域名，如 `https://miniapp.example.com/`，建议把 [vite.config.ts](./vite.config.ts) 的 `base` 改为 `/`
- 如果你部署到子路径，如 `https://example.com/my-miniapp/`，则 `base` 应为 `/my-miniapp/`

当前仓库默认是 GitHub Pages 的示例值：

- [vite.config.ts](./vite.config.ts) `base: '/reactjs-template/'`
- [package.json](./package.json) `homepage: "https://telegram-mini-apps.github.io/reactjs-template"`

部署到你自己的域名时，这两处都应该改成你自己的实际地址/路径（否则静态资源路径会错）。

2. 配置 TON Connect 清单（如你用不到 TON Connect 也建议先了解）

- 编辑 [public/tonconnect-manifest.json](./public/tonconnect-manifest.json)
- manifest 里的 `url/iconUrl/name` 要与你的域名匹配

3. 构建并发布

```bash
pnpm install
pnpm run build
```

然后把 `dist/` 上传到你的静态托管平台即可。

仓库也提供了 GitHub Pages 发布方式：

- 手动：`pnpm run deploy`（见 [package.json](./package.json)）
- 自动：推送到 master 会触发 [github-pages-deploy.yml](./.github/workflows/github-pages-deploy.yml)

### 1.3 绑定到你自己的 Bot（让用户能从 Telegram 打开）

核心：把“Mini App 的 HTTPS 地址”配置到你的 Bot 上。

常见做法有两种（选其一即可）：

1. BotFather 直接配置 Mini App（推荐新手按官方流程走）

- 在 BotFather 中进入你的 Bot 的 Mini App 管理（官方流程会引导设置：App 名称、描述、图标、URL、域名等）
- URL 填写你部署后的 HTTPS 地址（例如 `https://miniapp.example.com/`）

参考官方：创建 Mini App 的指南  
https://docs.telegram-mini-apps.com/platform/creating-new-app

2. 用 Bot 菜单按钮打开 Web App（适合你只想先跑起来）

- 在 BotFather 给 Bot 设置菜单按钮（Menu Button），把 Web App URL 指向你的站点
- 或者在你自己的 Bot 后端调用 Bot API `setChatMenuButton` 设置 web_app

无论你用哪种方式，最终都是把用户“从 Telegram 内打开时的入口”指向你的 HTTPS 站点。

### 1.4 生产环境调试开关（debug / eruda）

本项目的 debug 判断逻辑在 [src/index.tsx](./src/index.tsx)：

- `debug = startParam 包含 debug` 或 `import.meta.env.DEV`
- 当 debug 且平台为 iOS/Android 时，会动态加载 Eruda（手机端调试面板），见 [src/init.ts](./src/init.ts)

因此你可以用 `startapp` 参数带上 `debug` 来开启线上调试，例如：

- `https://t.me/<bot_username>/<your_app_short_name>?startapp=debug`

实际链接格式以你在 BotFather 配置的 Mini App 为准。

---

## 2. 代码核心功能（从入口到页面）

按启动链路理解最省时间：

1. 应用入口：[src/index.tsx](./src/index.tsx)

- 读取 Launch Params（`retrieveLaunchParams()`）
- 决定是否开启 debug / Eruda
- 调用 `init()` 初始化 Telegram SDK
- 最终挂载 React 根组件 `Root`

2. SDK 初始化：[src/init.ts](./src/init.ts)

- `setDebug()` + `initSDK()` 初始化 tma.js
- iOS/Android 且 debug 时加载 Eruda
- macOS Telegram 客户端存在兼容问题：可选启用 mock 修复（theme/safe area），逻辑也在这里
- 挂载与绑定：
  - `backButton.mount.ifAvailable()`
  - `initData.restore()`
  - `miniApp.mount()` + `themeParams.mount()` + `themeParams.bindCssVars()`
  - `viewport.mount()` + `viewport.bindCssVars()`

3. React 根组件：[src/components/Root.tsx](./src/components/Root.tsx)

- ErrorBoundary
- TonConnectUIProvider（读取 [public/tonconnect-manifest.json](./public/tonconnect-manifest.json)）

4. 路由与 UI 根容器：[src/components/App.tsx](./src/components/App.tsx)

- Tailwind + `miniApp.isDark`（`dark` class）适配 Telegram 深浅色
- `HashRouter`（静态托管友好，不依赖服务端 rewrite）
- 路由表来自 [src/navigation/routes.tsx](./src/navigation/routes.tsx)

5. 页面目录说明

- **正式产品页**：放在 [src/pages/app](./src/pages/app)（入口欢迎页 [OnboardingWelcomePage.tsx](./src/pages/app/onboarding/OnboardingWelcomePage.tsx)、主页 [WalletHomePage.tsx](./src/pages/app/WalletHomePage.tsx)）
- **旧版模板 Demo**（仅调试用）：放在 [src/pages/demo](./src/pages/demo)，路由前缀为 **`#/demo/...`**

---

## 3. 如何开发与调试（本地 + 真机 + Telegram 内）

### 3.1 安装依赖

仓库里有 `pnpm-lock.yaml`，并且 GitHub Actions 用的是 pnpm，所以建议用 pnpm：

```bash
corepack enable
pnpm install
```

也可以用 npm，但以 pnpm 为准更不容易出现锁文件/依赖差异。

### 3.2 本地启动

```bash
pnpm run dev
```

如果你希望本地直接起 https（浏览器本地访问用）：

```bash
pnpm run dev:https
```

注意：`dev:https` 使用 mkcert，首次运行可能需要管理员权限来安装本机证书（这是正常现象）。

### 3.3 真机/iOS/Android 在 Telegram 内调试（推荐用隧道）

因为 iOS/Android Telegram 客户端不会加载自签名证书的站点，所以 `https://localhost` + mkcert 通常只适合桌面浏览器。

真机调试的推荐方案：

1. 本地跑 http（不需要自签名证书）

```bash
pnpm run dev --host
```

2. 用隧道服务把本地端口映射成公网 https（任选一个）

- Cloudflare Tunnel：
  - `cloudflared tunnel --url http://localhost:5173`
- ngrok：
  - `ngrok http 5173`

3. 把隧道生成的 `https://xxxx` URL 配到 Bot 的 Mini App URL 上，然后从 Telegram 打开。

### 3.4 关键调试点

- DEV 模式下自动 mock Telegram 环境：[src/mockEnv.ts](./src/mockEnv.ts)
  - 让你在浏览器里也能跑页面/看 UI
  - 不要把 mock 当成生产逻辑依赖
- 线上 debug：用 `startapp=debug` 打开（见 1.4）
- 常见“为什么在浏览器正常、进 Telegram 异常”
  - URL 不是 https
  - 静态资源路径错误（base/homepage 没改对）
  - initData/平台能力仅在 Telegram 环境可用

---

## 4. 如何添加自己的页面和业务逻辑（推荐做法）

### 4.1 新增一个页面（最小改动）

1. 新建页面组件（示例命名）

- 新建 `src/pages/app/MyPage/MyPage.tsx`（或 `src/pages/app/MyPage.tsx`）
- 按现有页面的写法使用 [Page](./src/components/Page.tsx) 来接入返回按钮行为

2. 加到路由表

- 编辑 [src/navigation/routes.tsx](./src/navigation/routes.tsx)
- 增加一条 `{ path: '/my-page', Component: MyPage }`（`lazy` 或同步均可，与现有写法一致）

3. 从其它页面加入口（可选）

- 在对应 `src/pages/app/**` 页面里增加 `Link` 到 `/my-page`

### 4.2 放业务逻辑的“推荐位置”

目前仓库是模板结构，你可以按下面方式扩展（不需要一次做完）：

- 页面级：`src/pages/**`（路由页面 + 页面容器）
- 可复用 UI：`src/components/**`
- API/业务层：建议新增 `src/api/**`、`src/services/**` 或 `src/features/**`（按你团队习惯）
- 路由集中管理：继续用 [routes.tsx](./src/navigation/routes.tsx)

### 4.3 与 Telegram 交互要点

本模板已初始化并挂载了常用能力（见 [src/init.ts](./src/init.ts)），你在页面里可以直接使用：

- `useLaunchParams()`：读启动参数（平台、版本、startParam 等）
- `initData` / `useSignal(...)`：读 initData、theme/viewport 等状态
- `openLink(...)`：在 Telegram 内打开链接（示例见 TONConnect 页面）
- `backButton`：返回按钮控制（封装在 [Page](./src/components/Page.tsx)）

涉及安全鉴权（验证 initData、签名校验）请放在服务端完成，前端只负责把 `initData` 传给后端。

---

## 5. 常见发布检查清单

- `base` 与部署路径匹配（见 1.2）
- 站点必须是公网 https（iOS/Android 尤其严格）
- TON Connect manifest 的 URL/icon/name 已改为你自己的
- 生产环境不要依赖 [mockEnv.ts](./src/mockEnv.ts) 的行为
