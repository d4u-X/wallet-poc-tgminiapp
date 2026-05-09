import { publicUrl } from '@/helpers/publicUrl.ts';

/** Figma-exported assets stored in `public/images`. */
export const FIGMA_WELCOME = {
  heroDecoration: publicUrl('images/welcome-hero-decoration.png'),
  logoMark: publicUrl('images/welcome-logo-mark.svg'),
  logoWordmark: publicUrl('images/welcome-logo-d4.svg'),
  featureIcons: [
    publicUrl('images/welcome-feature-1.svg'),
    publicUrl('images/welcome-feature-2.svg'),
    publicUrl('images/welcome-feature-3.svg'),
  ] as const,
  warning: publicUrl('images/wallet-warning.svg'),
  eye: publicUrl('images/wallet-eye.svg'),
} as const;
