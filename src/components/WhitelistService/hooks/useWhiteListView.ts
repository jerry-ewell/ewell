import { message } from 'antd';
import { useCallback, useMemo } from 'react';
import { useWhiteList } from '../context/useWhiteList';
import { getWhiteList, getAddressFromWhitelist } from './whiteListView';

export const useWhiteListView = () => {
  const [{ whitelistId, contract, whitelistInfo }] = useWhiteList();
  const accountInWhitelist: (account?: string | undefined) => Promise<boolean> = useCallback(
    async (account?: string) => {
      if (!(whitelistInfo?.isAvailable ?? true)) return message.error('whitelist unavailable!');
      const res = await getAddressFromWhitelist(whitelistId, account, contract);
      if (res?.error) {
        res?.error?.message && message.error(res?.error?.message);
        return false;
      }
      return !!res?.value;
    },
    [contract, whitelistId, whitelistInfo?.isAvailable],
  );
  return useMemo(
    () => ({
      getWhiteList: () => getWhiteList(whitelistId, contract),
      accountInWhitelist: (account?: string) => accountInWhitelist(account),
    }),
    [accountInWhitelist, contract, whitelistId],
  );
};
