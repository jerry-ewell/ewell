import { SupportedChainId } from 'constants/chain';
import { ChainConstants } from 'constants/ChainConstants';
import { supportedChainId } from 'constants/index';
import { ZERO } from 'constants/misc';
import { useAElfContractContext } from 'contexts/useAElfContract';
import { useActiveWeb3React } from 'hooks/web3';
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useEffectOnce, useSearchParam } from 'react-use';
import isMobile from 'utils/isMobile';
import { switchNetwork } from 'utils/network';
import { provider } from 'web3-core';
const INITIAL_STATE = {};
const StoreContext = createContext<any>(INITIAL_STATE);

const body = window.document.getElementsByTagName('body')[0];
body.className = 'pc-site';

const mobileWidth = ZERO.plus(640);
declare type StoreState = { mobile?: boolean };
export function useStore(): [StoreState] {
  return useContext(StoreContext);
}

//reducer payload
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    default:
      return Object.assign({}, state, payload);
  }
}

export default function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // const { chainId, library, aelfInstance } = useActiveWeb3React();
  // const [contracts] = useAElfContractContext();
  const [mobile, setMobile] = useState<boolean>();
  // useMemo(() => initialized(chainId, library, aelfInstance, contracts), [chainId, library, aelfInstance, contracts]);
  const toChainId = useSearchParam('toChainId');
  useEffectOnce(() => {
    if (toChainId && supportedChainId[Number(toChainId) as SupportedChainId])
      switchNetwork(supportedChainId[Number(toChainId) as SupportedChainId].CHAIN_INFO);
  });

  // isMobile
  useEffectOnce(() => {
    const resize = () => {
      const isM = isMobile();
      setMobile(
        mobileWidth.gt(window.innerWidth) ||
          isM.apple.phone ||
          isM.android.phone ||
          isM.apple.tablet ||
          isM.android.tablet,
      );
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  // className
  useEffect(() => {
    if (!body) return;
    const addClassName = [mobile ? 'mobile-site' : 'pc-site'];
    body.className = '';
    addClassName.forEach((i) => {
      if (!body.className.includes(i)) body.className = (body.className.trim() + ' ' + i).trim();
    });
  }, [mobile]);

  return (
    <StoreContext.Provider value={useMemo(() => [{ ...state, mobile }, { dispatch }], [state, mobile])}>
      {children}
    </StoreContext.Provider>
  );
}
function initialized(chainId?: number | string, library?: provider, aelfInstance?: any, aelfContracts?: any) {
  if (chainId) {
    if (typeof chainId === 'string') {
      new ChainConstants(chainId, 'ELF', library, aelfInstance, aelfContracts);
    } else {
      new ChainConstants(chainId, 'ERC', library, aelfInstance, aelfContracts);
    }
  }
}
