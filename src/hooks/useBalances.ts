import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { getELFChainBalance } from 'contracts/elf';
import { getBalance } from 'contracts/ethereum';
import { useCallback, useMemo, useState } from 'react';
import { useTokenContract } from './useContract';
import useInterval from './useInterval';
import { useActiveWeb3React } from './web3';
export const useBalances = (
  // address || symbol
  tokens?: string | Array<string | undefined>,
  delay: null | number = 10000,
  targetAddress?: string,
): [BigNumber[], () => void] => {
  const deArr = useMemo(() => (Array.isArray(tokens) ? tokens.map(() => ZERO) : [ZERO]), [tokens]);
  const [balances, setBalances] = useState<BigNumber[]>(deArr);
  const { library, chainId, account: owner } = useActiveWeb3React();
  const account = useMemo(() => targetAddress || owner, [targetAddress, owner]);
  const tokenContract = useTokenContract();
  const onGetBalance = useCallback(async () => {
    const tokensList = Array.isArray(tokens) ? tokens : [tokens];
    if (!account) return setBalances(tokensList.map(() => ZERO));
    let promise;
    if (typeof chainId === 'string') {
      // elf chain
      const contract = tokenContract;
      if (!contract) return;
      promise = tokensList.map((symbol) => {
        if (symbol) return getELFChainBalance(contract, symbol, account);
      });
    } else {
      // erc20 chain
      promise = tokensList.map((i) => {
        if (i && library) return getBalance(library, i, account);
      });
    }
    const bs = await Promise.all(promise);
    setBalances(bs?.map((i) => new BigNumber(i ?? '')));
  }, [tokens, account, chainId, tokenContract, library]);

  useInterval(onGetBalance, delay, [account, tokens, chainId, tokenContract]);
  return [balances, onGetBalance];
};
