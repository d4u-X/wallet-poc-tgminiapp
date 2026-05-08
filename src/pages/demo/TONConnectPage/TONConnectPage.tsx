import { openLink } from '@tma.js/sdk-react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import type { FC } from 'react';

import { DisplayData } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';

export const TONConnectPage: FC = () => {
  const wallet = useTonWallet();

  if (!wallet) {
    return (
      <Page>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0098EA]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 56 56"
              fill="none"
              className="size-10"
            >
              <path
                d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-tg-text">TON Connect</h2>
            <p className="mt-1 text-sm text-tg-hint">
              To display wallet data, please connect your TON wallet first.
            </p>
          </div>
          <TonConnectButton />
        </div>
      </Page>
    );
  }

  const {
    account: { chain, publicKey, address },
    device: { appName, appVersion, maxProtocolVersion, platform, features },
  } = wallet;

  return (
    <Page>
      <div className="space-y-4 py-4">
        {'imageUrl' in wallet && (
          <div className="mx-4 overflow-hidden rounded-xl bg-tg-section-bg">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-black/5 active:bg-black/10 transition-colors"
              onClick={() => openLink(wallet.aboutUrl)}
            >
              <img
                src={wallet.imageUrl}
                alt="Wallet logo"
                className="size-12 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-tg-text">{wallet.name}</p>
                <p className="text-[13px] text-tg-subtitle">{wallet.appName}</p>
              </div>
              <span className="text-[13px] text-tg-link">About wallet</span>
            </button>
            <div className="border-t border-tg-separator px-4 py-3">
              <TonConnectButton />
            </div>
          </div>
        )}

        <DisplayData
          header="Account"
          rows={[
            { title: 'Address', value: address },
            { title: 'Chain', value: chain },
            { title: 'Public Key', value: publicKey },
          ]}
        />

        <DisplayData
          header="Device"
          rows={[
            { title: 'App Name', value: appName },
            { title: 'App Version', value: appVersion },
            { title: 'Max Protocol Version', value: maxProtocolVersion },
            { title: 'Platform', value: platform },
            {
              title: 'Features',
              value: features
                .map((f) => (typeof f === 'object' ? f.name : undefined))
                .filter(Boolean)
                .join(', '),
            },
          ]}
        />
      </div>
    </Page>
  );
};
