/** Remote assets from Figma MCP (refresh from design file if URLs expire). */
export const FIGMA_WELCOME = {
  heroDecoration: '/figma/welcome-hero-decoration.png',
  logoMark: '/figma/welcome-logo-mark.png',
  logoD4: [
    '/figma/welcome-logo-d4-1.png',
    '/figma/welcome-logo-d4-2.png',
    '/figma/welcome-logo-d4-3.png',
  ] as const,
  featureIcons: [
    '/figma/welcome-feature-1.png',
    '/figma/welcome-feature-2.png',
    '/figma/welcome-feature-3.png',
  ] as const,
} as const;
