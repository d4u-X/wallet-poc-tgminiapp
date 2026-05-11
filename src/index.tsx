import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@tma.js/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { init } from '@/init.ts';

import './index.css';
import './mockEnv.ts';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root is not found');
}

const root = ReactDOM.createRoot(rootElement);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || '').includes('debug') || import.meta.env.DEV;

  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  }).then(() => {
    root.render(
      <StrictMode>
        <Root />
      </StrictMode>,
    );
  });
} catch {
  const hasTelegramWebApp = Boolean(
    (window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram?.WebApp,
  );
  if (hasTelegramWebApp) {
    root.render(<EnvUnsupported />);
  } else {
    root.render(
      <StrictMode>
        <Root />
      </StrictMode>,
    );
  }
}
