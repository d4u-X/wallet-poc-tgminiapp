import { publicUrl } from '@/helpers/publicUrl.ts';

/**
 * Figma-derived home screen assets exported into `public/images`.
 */
export const WALLET_HOME_ASSETS = {
  hexGrid: publicUrl('images/home-hex-grid.png'),
  walletChevron: publicUrl('images/home-wallet-chevron.svg'),
  messageBubble: publicUrl('images/home-message-bubble.svg'),
  balanceChevron: publicUrl('images/home-balance-chevron.svg'),
  shieldBanner: publicUrl('images/home-shield-banner.svg'),
  shieldCongrats: publicUrl('images/home-shield-congrats.svg'),
  quickTransfer: publicUrl('images/home-quick-transfer.svg'),
  quickInvite: publicUrl('images/home-quick-invite.svg'),
  quickSupport: publicUrl('images/home-quick-support.svg'),
  txProgress: publicUrl('images/home-tx-progress.svg'),
  txArrow: publicUrl('images/home-tx-arrow.svg'),
  txArrowIn: publicUrl('images/home-tx-arrow-in.svg'),
  warningYellow: publicUrl('images/home-tx-warning-yellow.svg'),
  warningRed: publicUrl('images/home-tx-warning-red.svg'),
  tabHomeActive: publicUrl('images/home-tab-active.svg'),
  tabOrders: publicUrl('images/home-tab-orders.svg'),
  tabProfile: publicUrl('images/home-tab-profile.svg'),
} as const;
