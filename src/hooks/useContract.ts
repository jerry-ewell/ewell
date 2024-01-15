import { ERC20_ABI } from 'constants/abis';
import { ChainConstants } from 'constants/ChainConstants';
import { useAElfContractContext } from 'contexts/useAElfContract';
import { useMemo } from 'react';
import { ContractBasic } from 'utils/contract';
import { provider } from 'web3-core';
import { useActiveWeb3React } from './web3';

export function getContract(address: string, ABI: any, library?: provider, aelfContract?: any) {
  return new ContractBasic({
    contractAddress: address,
    contractABI: ABI,
    provider: library,
    aelfContract,
  });
}

function useContract(address: string | undefined, ABI: any): ContractBasic | null {
  const { library, chainId } = useActiveWeb3React();
  const [contracts] = useAElfContractContext();
  const contract = useMemo(() => {
    if (!address) return;
    return contracts?.[address];
  }, [address, contracts]);

  return useMemo(() => {
    if (typeof chainId === 'string') {
      if (!contract) return null;
    } else if (!ABI || !library) {
      return null;
    }
    if (!address) return null;
    try {
      return getContract(address, ABI, library, contract);
    } catch (error) {
      return null;
    }
  }, [address, ABI, library, contract, chainId]);
}

export function useTokenContract(address?: string) {
  const { chainId } = useActiveWeb3React();
  let tokenAddress = address;
  if (typeof chainId === 'string') {
    tokenAddress = ChainConstants.constants?.TOKEN_CONTRACT;
  }
  return useContract(tokenAddress, ERC20_ABI);
}

export function useWhiteListContract() {
  return null;
  // return useContract(ChainConstants.constants?.WHITELIST_CONTRACT, ERC20_ABI);
}

export function useIDOContract() {
  return useContract(ChainConstants.constants?.IDO_CONTRACT, '');
}
