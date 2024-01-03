import { ChainConstants } from 'constants/ChainConstants';
import { useCallback, useEffect, useState } from 'react';
import { isElfChainSymbol } from 'utils/aelfUtils';
import { useTokenContract } from './useContract';
import { useActiveWeb3React } from './web3';

type Token = {
  decimals: number;
  isBurnable: boolean;
  issueChainId: number;
  issued: string;
  issuer: string;
  supply: string;
  symbol: string;
  tokenName: string;
  totalSupply: string;
};

//: Token | undefined | null
export function useToken(tokenSymbol?: string | null): Token | undefined {
  const { chainId } = useActiveWeb3React();
  const symbol = isElfChainSymbol(tokenSymbol);
  const [tokenInfo, setTokenInfo] = useState();
  const tokenContract = useTokenContract();
  const callData = useCallback(async () => {
    if (!tokenSymbol || !chainId) return setTokenInfo(undefined);
    if (ChainConstants.chainType === 'ELF') {
      if (!symbol) return setTokenInfo(undefined);
      const info = await tokenContract?.callViewMethod('GetTokenInfo', [symbol.toLocaleUpperCase()]);
      if (info && !info.error) {
        return setTokenInfo(info);
      }
      return setTokenInfo(undefined);
    }
  }, [chainId, symbol, tokenSymbol, tokenContract]);
  useEffect(() => {
    callData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, tokenSymbol, tokenContract]);
  return tokenInfo;
}
