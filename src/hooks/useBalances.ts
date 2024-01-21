import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { useWallet } from 'contexts/useWallet/hooks';
import { useCallback, useMemo, useRef, useState } from 'react';
import useInterval from './useInterval';

// TODO: fix this hook
export const useBalances = (
  // address || symbol
  tokens?: string | Array<string | undefined>,
  delay: null | number = 10000,
  targetAddress?: string,
): [BigNumber[], () => void] => {
  const { getTokenContract } = useViewContract();
  const { wallet, checkManagerSyncState } = useWallet();
  // const deArr = useMemo(() => (Array.isArray(tokens) ? tokens.map(() => ZERO) : [ZERO]), [tokens]);
  const deArr = useMemo(
    () => (Array.isArray(tokens) ? tokens.map(() => new BigNumber(10000000000)) : [new BigNumber(10000000000)]),
    [tokens],
  );
  const [balances, setBalances] = useState<BigNumber[]>(deArr);
  const account = useMemo(
    () => targetAddress || wallet?.walletInfo?.address,
    [targetAddress, wallet?.walletInfo?.address],
  );
  const interval = useRef<any>();
  const onGetBalance = useCallback(async () => {
    // const isManagerSynced = await checkManagerSyncState();
    // if (!isManagerSynced) {
    //   clearInterval(interval.current);
    //   return;
    // }
    // const tokenContract = await getTokenContract();
    // const tokensList = Array.isArray(tokens) ? tokens : [tokens];
    // if (!account) return setBalances(tokensList.map(() => ZERO));
    // let promise;
    // if (!tokenContract) return;
    // promise = tokensList.map((symbol) => {
    //   if (symbol) return tokenContract.GetBalance.call({ symbol, owner: account });
    // });
    // const bs = await Promise.all(promise);
    // setBalances(bs?.map((i) => new BigNumber(i?.balance ?? '')));
    // }, [checkManagerSyncState, getTokenContract, tokens, account]);
  }, []);

  interval.current = useInterval(onGetBalance, delay, [account, tokens]);
  return [balances, onGetBalance];
};
