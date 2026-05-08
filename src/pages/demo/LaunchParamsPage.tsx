import { useLaunchParams } from '@tma.js/sdk-react';
import type { FC } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';

export const LaunchParamsPage: FC = () => {
  const lp = useLaunchParams();

  return (
    <Page>
      <div className="py-4">
        <DisplayData
          rows={[
            { title: 'tgWebAppPlatform', value: lp.tgWebAppPlatform },
            { title: 'tgWebAppShowSettings', value: lp.tgWebAppShowSettings },
            { title: 'tgWebAppVersion', value: lp.tgWebAppVersion },
            { title: 'tgWebAppBotInline', value: lp.tgWebAppBotInline },
            { title: 'tgWebAppStartParam', value: lp.tgWebAppStartParam },
            { title: 'tgWebAppData', type: 'link', value: '/demo/init-data' },
            { title: 'tgWebAppThemeParams', type: 'link', value: '/demo/theme-params' },
          ]}
        />
      </div>
    </Page>
  );
};
