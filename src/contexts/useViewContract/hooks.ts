import { useCallback, useRef } from 'react';
import { useViewContractContext } from '.';
import { getContract } from './utils';
import { NETWORK_CONFIG } from 'constants/network';

export function useViewContract() {
  const [{ tokenContract, ewellContract, whitelistContract }, dispatch] = useViewContractContext();
  const tokenContractRef = useRef(tokenContract);
  tokenContractRef.current = tokenContract;
  const ewellContractRef = useRef(ewellContract);
  ewellContractRef.current = ewellContract;
  const whitelistContractRef = useRef(whitelistContract);
  whitelistContractRef.current = whitelistContract;

  const getTokenContract = useCallback(async () => {
    if (tokenContractRef.current) return tokenContractRef.current;
    const contract = await getContract(
      NETWORK_CONFIG.sideChainInfo.endPoint,
      NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
    );
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        tokenContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  const getEwellContract = useCallback(async () => {
    if (ewellContractRef.current) return ewellContractRef.current;
    const contract = await getContract(NETWORK_CONFIG.sideChainInfo.endPoint, NETWORK_CONFIG.ewellContractAddress);
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        ewellContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  const getWhitelistContract = useCallback(async () => {
    if (whitelistContractRef.current) return whitelistContractRef.current;
    const contract = await getContract(NETWORK_CONFIG.sideChainInfo.endPoint, NETWORK_CONFIG.whitelistContractAddress);
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        whitelistContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  return {
    getTokenContract,
    getEwellContract,
    getWhitelistContract,
  };
}
