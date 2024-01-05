import { BasicActions } from './utils';
import { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';
import { basicWhiteListView, WhiteListState } from './actions';
import { useModalAction } from '../hooks/useModalAction';
import { getUpdateList } from '../utils';
import WhiteListUpdater from '../hooks/Updater';
import Modals from '../components/Modals';
import '../styled.less';
import { message } from 'antd';

const INITIAL_STATE: WhiteListState = {
  // chainId: 0,
  contract: undefined,
  whitelistId: undefined,
  projectWhiteList: undefined,
  adminAddress: undefined,
  userLevelList: undefined,
  tagInfoList: undefined,
  whitelistInfo: undefined,
  refresh: Date.now(),
};
const WhiteListContext = createContext<any>(INITIAL_STATE);

export function useWhiteList(): [WhiteListState, BasicActions] {
  return useContext(WhiteListContext);
}

//reducer
function reducer(state: WhiteListState, { type, payload }: any) {
  switch (type) {
    case basicWhiteListView.destroy.type: {
      return {};
    }
    case basicWhiteListView.updateWhiteListConfig.type: {
      return Object.assign({}, state, payload);
    }
    case basicWhiteListView.updateWhiteListInfo.type: {
      return Object.assign({}, state, payload);
    }
    case basicWhiteListView.updateState.type: {
      return Object.assign({}, state, payload);
    }
    case basicWhiteListView.updateCommonList.type: {
      const { skipCount, total, isUpdate, stateKey } = payload;
      const list = getUpdateList(isUpdate, total, state?.[stateKey as keyof WhiteListState]?.items ?? []);
      list.splice(skipCount, payload.list.length, ...payload.list);
      return Object.assign({}, state, {
        [stateKey]: {
          items: list,
          totalCount: total,
        },
      });
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

export default function Provider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { handleModalAction, handleModalDestroy, modalAction } = useModalAction<any>();
  console.log(state, 'state====');
  const handleModalAction1 = useMemo(() => {
    if (!state?.whitelistInfo?.isAvailable) {
      return () => {
        message.error('WhitelistId is not available');
      };
    }
    return handleModalAction;
  }, [handleModalAction, state?.whitelistInfo?.isAvailable]);
  return (
    <WhiteListContext.Provider
      value={useMemo(
        () => [{ ...state }, { dispatch, handleModalAction: handleModalAction1, handleModalDestroy }],
        [state, handleModalAction1, handleModalDestroy],
      )}>
      <WhiteListUpdater />
      {children}
      <Modals modalAction={modalAction} />
    </WhiteListContext.Provider>
  );
}
