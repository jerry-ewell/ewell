import { useAElfReact } from '@aelf-react/core';
import { useCallback, useEffect, useMemo } from 'react';
import { getWallet } from 'utils/aelfUtils';
import { ContractBasic } from 'utils/contract';
import { ADD_CONTRACT, useAElfContractContext } from '.';
import { ContractKEYS } from './types';

export function useAElfContract(contractAddress: ContractKEYS) {
  const [contracts, dispatch] = useAElfContractContext();
  const { defaultAElfBridge, account } = useAElfReact();
  const contract = contracts?.[contractAddress];
  const getContract = useCallback(async () => {
    if (!defaultAElfBridge) return;
    try {
      const contract = await defaultAElfBridge.chain.contractAt(
        contractAddress,
        account ? { address: account } : getWallet(),
      );
      dispatch({
        type: ADD_CONTRACT,
        payload: { [contractAddress]: contract },
      });
    } catch (error) {
      console.error(error, '====getContract');
    }
  }, [defaultAElfBridge, contractAddress, account, dispatch]);
  useEffect(() => {
    getContract();
  }, [getContract]);
  return useMemo(() => {
    if (!contract) return;
    return new ContractBasic({ aelfContract: contract, contractAddress });
  }, [contract, contractAddress]);
}
