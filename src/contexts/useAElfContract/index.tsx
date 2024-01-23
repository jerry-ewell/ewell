import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { sleep } from 'utils';
import { initContracts } from 'utils/aelfUtils';
import { ContractContextState } from './types';
import { ChainConstants } from 'constants/ChainConstants';
import { useAElfReact } from '@aelf-react/core';

export const DESTROY = 'DESTROY';
const SET_CONTRACT = 'SET_CONTRACT';
export const ADD_CONTRACT = 'ADD_CONTRACT';

const INITIAL_STATE = {};
const ContractContext = createContext<any>(INITIAL_STATE);

const temp: [ContractContextState, React.Dispatch<any>] = [{}, (value: any) => void 0];

export function useAElfContractContext(): [ContractContextState, React.Dispatch<any>] {
  return temp;
  // return useContext(ContractContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  console.log(state, '====state');
  const { defaultAElfBridge, account } = useAElfReact();
  const initNumber = useRef<number>(0);
  const init = useCallback(
    async (num: number) => {
      if (defaultAElfBridge?.chain && ChainConstants.constants.CONTRACTS) {
        try {
          // Need to initialize the contract at the same time
          // getChainStatus will clear the contracts of NightElf
          dispatch({ type: DESTROY });
          await defaultAElfBridge.chain.getChainStatus();
          const contracts = await initContracts(ChainConstants.constants.CONTRACTS, defaultAElfBridge, account);
          // last initialized contracts
          console.log(contracts, '=====initialized-contracts');

          if (num === initNumber.current) {
            dispatch({
              type: SET_CONTRACT,
              payload: contracts,
            });
          }
        } catch (error) {
          console.log(error, 'init Contract');
          // Initialize again at one second interval after initialization failure
          await sleep(1000);
          init(++initNumber.current);
        }
      }
    },
    [account, defaultAElfBridge],
  );

  useEffect(() => {
    init(++initNumber.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, defaultAElfBridge]);
  return (
    <ContractContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </ContractContext.Provider>
  );
}
