import { type FC, useMemo } from 'react';
import { initData, type User, useSignal } from '@tma.js/sdk-react';

import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData.tsx';
import { Page } from '@/components/Page.tsx';

function getUserRows(user: User): DisplayDataRow[] {
  return Object.entries(user).map(([title, value]) => ({ title, value }));
}

export const InitDataPage: FC = () => {
  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) return undefined;
    return [
      { title: 'raw', value: initDataRaw },
      ...Object.entries(initDataState).reduce<DisplayDataRow[]>((acc, [title, value]) => {
        if (value instanceof Date) {
          acc.push({ title, value: value.toISOString() });
        } else if (!value || typeof value !== 'object') {
          acc.push({ title, value });
        }
        return acc;
      }, []),
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(
    () => (initDataState?.user ? getUserRows(initDataState.user) : undefined),
    [initDataState],
  );

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(
    () => (initDataState?.receiver ? getUserRows(initDataState.receiver) : undefined),
    [initDataState],
  );

  const chatRows = useMemo<DisplayDataRow[] | undefined>(
    () =>
      initDataState?.chat
        ? Object.entries(initDataState.chat).map(([title, value]) => ({ title, value }))
        : undefined,
    [initDataState],
  );

  if (!initDataRows) {
    return (
      <Page>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            className="block size-36"
          />
          <h2 className="text-lg font-semibold text-tg-text">Oops</h2>
          <p className="text-sm text-tg-hint">Application was launched with missing init data</p>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="py-4 space-y-4">
        <DisplayData header="Init Data" rows={initDataRows} />
        {userRows && <DisplayData header="User" rows={userRows} />}
        {receiverRows && <DisplayData header="Receiver" rows={receiverRows} />}
        {chatRows && <DisplayData header="Chat" rows={chatRows} />}
      </div>
    </Page>
  );
};
