import { Suspense } from 'react';
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { I18nProvider } from '@/i18n/I18nProvider.tsx';
import { routes } from '@/navigation/routes.tsx';
import { OnboardingMockProvider } from '@/pages/app/onboarding/OnboardingMockContext.tsx';
import { WalletSessionProvider } from '@/state/wallet/WalletSessionContext.tsx';

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-wallet-canvas">
      <div
        className="size-9 animate-spin rounded-full border-2 border-wallet-accent-green border-t-transparent"
        aria-hidden
      />
    </div>
  );
}

export function App() {
  return (
    <div style={{ padding: '20px 0 20px 0' }} className="min-h-dvh bg-wallet-canvas ">
      <HashRouter>
        <I18nProvider>
          <WalletSessionProvider>
            <OnboardingMockProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {routes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                  ))}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </OnboardingMockProvider>
          </WalletSessionProvider>
        </I18nProvider>
      </HashRouter>
    </div>
  );
}
