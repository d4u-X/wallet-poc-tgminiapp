/**
 * Loads Eruda after idle time so it does not compete with first paint / TMA init.
 */
export function scheduleErudaInit(): void {
  const run = () => {
    void import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 0 });
    });
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => run(), { timeout: 4000 });
  } else {
    setTimeout(run, 0);
  }
}
