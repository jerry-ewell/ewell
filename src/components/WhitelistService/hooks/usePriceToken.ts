import { useCallback, useEffect, useState } from 'react';
import { request } from '../request';
import { TokenInfoBase } from '../types';
import { formatObjEmpty } from '../utils';

export const usePriceToken = (chainId?: number, whitelistHash?: string) => {
  const [list, setList] = useState<TokenInfoBase[]>();

  const fetch = useCallback(async () => {
    if (!chainId || !whitelistHash) return;
    console.log('fetch', 'symbolList===');

    const res = await request.getPriceTokens({
      params: formatObjEmpty({
        chainId,
        whitelistHash,
      }),
    });
    if (res && res?.items) {
      setList(res.items);
    }
  }, [chainId, whitelistHash]);

  useEffect(() => {
    fetch();
  }, [fetch]);
  return list;
};
