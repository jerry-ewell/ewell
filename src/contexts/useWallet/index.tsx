import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { WalletContextState } from './types';
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

const APPNAME = 'explorer.aelf.io';
const CHAIN_ID = 'AELF';
const NETWORK = 'MAIN';
const RPC_SERVER = 'https://explorer.aelf.io/chain';

const IS_MAINNET = NETWORK === 'MAIN';

const graphQLServer = !IS_MAINNET
  ? 'https://dapp-portkey-test.portkey.finance'
  : 'https://dapp-portkey.portkey.finance';
const portkeyApiServer = !IS_MAINNET
  ? 'https://did-portkey-test.portkey.finance'
  : 'https://did-portkey.portkey.finance';

// did.config.setConfig
export const connectUrl = !IS_MAINNET
  ? 'https://auth-portkey-test.portkey.finance'
  : 'https://auth-portkey.portkey.finance';

const portkeyScanUrl = `${graphQLServer}/Portkey_DID/PortKeyIndexerCASchema/graphql`;

setGlobalConfig({
  appName: APPNAME,
  chainId: CHAIN_ID,
  networkType: NETWORK as any,
  portkey: {
    // useLocalStorage: true,
    graphQLUrl: portkeyScanUrl,
    requestDefaults: {
      baseURL: 'https://did-portkey.portkey.finance',
    },
    // connectUrl: connectUrl,
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
        rpcUrl: RPC_SERVER,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: RPC_SERVER,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: RPC_SERVER,
      },
    },
  },
  defaultRpcUrl: 'https://explorer.aelf.io/chain',
});

export const DESTROY = 'DESTROY';
const SET_WALLET = 'SET_WALLET';

const INITIAL_STATE = {};
const WalletContext = createContext<any>(INITIAL_STATE);

export function useWalletContext(): [WalletContextState, React.Dispatch<any>] {
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

export function WalletProvider({ children }: { children: React.ReactNode }) {
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
  }, []);
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
