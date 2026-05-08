import { retrieveLaunchParams, isColorDark, isRGB } from '@tma.js/sdk-react';
import { useMemo } from 'react';

export function EnvUnsupported() {
  const isDark = useMemo(() => {
    try {
      const lp = retrieveLaunchParams();
      const { bg_color: bgColor } = lp.tgWebAppThemeParams;
      return bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false;
    } catch {
      return false;
    }
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center"
      style={{
        backgroundColor: isDark ? '#17212b' : '#f4f4f5',
        color: isDark ? '#f5f5f5' : '#000000',
      }}
    >
      <img alt="Telegram sticker" src="https://xelene.me/telegram.gif" className="block size-36" />
      <h1 className="text-xl font-semibold">Oops</h1>
      <p className="text-sm opacity-60">
        You are using too old Telegram client to run this application
      </p>
    </div>
  );
}
