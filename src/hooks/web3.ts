import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { injected } from '../walletConnectors';
import { isMobile } from 'react-device-detect';
import { NetworkContextName } from '../constants';
import { provider } from 'web3-core';
import BigNumber from 'bignumber.js';
import { useChain } from 'contexts/useChain';
import { getProvider } from 'utils';
import { ChainConstants } from 'constants/ChainConstants';
import { useAElfReact } from '@aelf-react/core';

type ExtendWeb3ReactContextInterface = Web3ReactContextInterface<provider> & {
  chainId?: any;
  connect?: () => void;
  aelfInstance?: any;
  apiChainId?: string;
};
// useActiveWeb3React contains all attributes of useWeb3React and aelf combination
export function useActiveWeb3React() {
  const context: ExtendWeb3ReactContextInterface = useWeb3React<provider>();
  const contextNetwork: ExtendWeb3ReactContextInterface = useWeb3React<provider>(NetworkContextName);
  const [{ userChainId }] = useChain();
  const { account, defaultAElfBridge, deactivate } = useAElfReact();
  const tmpContext = useMemo(() => {
    if (typeof userChainId === 'string') {
      return {
        chainId: userChainId,
        account: account,
        library: undefined,
        // TODO
        apiChainId: ChainConstants.constants?.CHAIN_GUID,
        error: null,
        active: !!account,
        deactivate,
        connector: account ? 'NIGHT ELF' : undefined,
        aelfInstance: defaultAElfBridge,
      };
    }
    if (!context.active) {
      const chainId = new BigNumber(window?.ethereum?.chainId || '');
      if (!chainId.isNaN()) {
        contextNetwork.chainId = chainId.toNumber();
      } else if (userChainId) {
        contextNetwork.chainId = userChainId;
      }
      const provider = getProvider(contextNetwork.chainId);
      if (provider) contextNetwork.library = provider;
      contextNetwork.deactivate = context.deactivate;
      contextNetwork.connector = context.connector;
      return contextNetwork;
    }
    return context;
  }, [account, context, contextNetwork, deactivate, defaultAElfBridge, userChainId]);
  return tmpContext;
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React(); // specifically using useWeb3React because of what this hook does
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}
/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}

export function useAEflConnect() {
  const { activate } = useAElfReact();
  return useCallback(async () => {
    const { chainId, rpcUrl }: { chainId: any; rpcUrl: string } = ChainConstants.constants.CHAIN_INFO;
    try {
      await activate({
        [chainId]: {
          chainId,
          rpcUrl,
        },
      });
    } catch (error) {
      console.error(error, '=====activate-error');
    }
  }, [activate]);
}
