import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { TWalletContextState } from './types';
import {
  WebLoginProvider,
  WebLoginState,
  useWebLoginEvent,
  WebLoginEvents,
  setGlobalConfig,
  PortkeyProvider,
  useWebLoginContext,
  WebLoginContextType,
} from 'aelf-web-login';
import Wallet from './Wallet';
import { IWallet } from './Wallet/types';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { useLocalStorage } from 'react-use';

const APPNAME = 'explorer.aelf.io';
const RPC_SERVER = 'https://explorer.aelf.io/chain';

setGlobalConfig({
  appName: APPNAME,
  chainId: DEFAULT_CHAIN_ID,
  networkType: NETWORK_CONFIG.networkType as any,
  portkey: {
    useLocalStorage: true,
    graphQLUrl: NETWORK_CONFIG.webLoginGraphqlUrl,
    requestDefaults: {
      baseURL: NETWORK_CONFIG.webLoginRequestDefaultsUrl,
    },
    connectUrl: NETWORK_CONFIG.webLoginConnectUrl,
    // socialLogin: {
    //   Portkey: {
    //     websiteName: APPNAME,
    //     websiteIcon: WEBSITE_ICON,
    //   },
    // },
  } as any,
  aelfReact: {
    appName: APPNAME,
    nodes: {
      AELF: {
        chainId: 'AELF',
        rpcUrl: NETWORK_CONFIG.mainChainInfo.endPoint,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: NETWORK_CONFIG.sideChainInfo.endPoint,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: NETWORK_CONFIG.sideChainInfo.endPoint,
      },
    },
  },
  defaultRpcUrl: 'https://explorer.aelf.io/chain',
});

export const DESTROY = 'DESTROY';
const SET_WALLET = 'SET_WALLET';

const INITIAL_STATE = {};
const WalletContext = createContext<any>(INITIAL_STATE);

export function useWalletContext(): [TWalletContextState, React.Dispatch<any>] {
  return useContext(WalletContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case SET_WALLET: {
      return {
        ...state,
        wallet: payload,
      };
    }
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

type TWalletTokenMap = Record<string, string>;

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletTokenMap, setWalletTokenMap] = useLocalStorage<TWalletTokenMap>('Token');
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const webLoginContext = useWebLoginContext();
  const webLoginContextRef = useRef<WebLoginContextType>(webLoginContext);
  webLoginContextRef.current = webLoginContext;

  const { wallet } = state;
  if (webLoginContext.loginState === WebLoginState.logined && wallet && webLoginContext.callContract) {
    webLoginContext.callContract && (wallet as IWallet).setCallContract(webLoginContext.callContract);
    webLoginContext.getSignature && (wallet as IWallet).setGetSignature(webLoginContext.getSignature);
  }

  const onLogin = useCallback(() => {
    console.log('onLogin');
    const _webLoginContext = webLoginContextRef.current;
    const wallet = new Wallet({
      walletInfo: _webLoginContext.wallet,
      walletType: _webLoginContext.walletType,
      callContract: _webLoginContext.callContract,
      getSignature: _webLoginContext.getSignature,
    });
    dispatch({
      type: SET_WALLET,
      payload: wallet,
    });

    // const address = _webLoginContext.wallet.address;
    // const token = walletTokenMap?.[address];
    // if (token) {
    //   // TODO: set API token
    // } else {
    //   // get token
    // }
    setWalletTokenMap({
      [_webLoginContext.wallet.address]: _webLoginContext.wallet.publicKey || '',
    });
  }, [setWalletTokenMap]);

  useEffect(() => {
    console.log('walletTokenMap', walletTokenMap);
  }, [walletTokenMap]);

  useWebLoginEvent(WebLoginEvents.LOGINED, onLogin);

  const onLogout = useCallback(() => {
    console.log('onLogout');
    dispatch({
      type: SET_WALLET,
      payload: undefined,
    });
  }, []);
  useWebLoginEvent(WebLoginEvents.LOGOUT, onLogout);

  useEffect(() => {
    console.log('state', state);
  }, [state]);

  return (
    <WalletContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </WalletContext.Provider>
  );
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PortkeyProvider networkType={'MAIN'}>
      <WebLoginProvider
        nightElf={{
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: true,
          checkAccountInfoSync: true,
        }}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
          onPluginNotFound: (openStore) => {
            console.log('openStore:', openStore);
            openStore();
          },
        }}
        extraWallets={['discover', 'elf']}>
        <WalletProvider>{children}</WalletProvider>
      </WebLoginProvider>
    </PortkeyProvider>
  );
}
