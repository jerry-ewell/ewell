import { BasicActions } from 'contexts/utils';
import { useIDOContract } from 'hooks/useContract';
import { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';
import { basicProjectInfoView, ProjectInfoState } from './actions';

const INITIAL_STATE: ProjectInfoState = {
  refresh: Date.now(),
  idoContract: null,
};
const InfoContext = createContext<any>(INITIAL_STATE);

export function useProjectInfo(): [ProjectInfoState, BasicActions] {
  return useContext(InfoContext);
}

//reducer
function reducer(state: ProjectInfoState, { type, payload }: any) {
  switch (type) {
    case basicProjectInfoView.destroy.type: {
      return {};
    }
    case basicProjectInfoView.updateProjectInfo.type: {
      return Object.assign({}, state, { idoInfo: payload });
    }
    case basicProjectInfoView.updateRefresh.type: {
      return Object.assign({}, state, { refresh: Date.now() });
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}
export default function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const idoContract = useIDOContract();

  return (
    <InfoContext.Provider value={useMemo(() => [{ ...state, idoContract }, { dispatch }], [state, idoContract])}>
      {children}
    </InfoContext.Provider>
  );
}
