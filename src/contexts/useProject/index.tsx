import { BasicActions } from 'contexts/utils';
import { ReactNode, createContext, useContext, useMemo, useReducer } from 'react';
import { useLocalStorage } from 'react-use';
import storages from 'storages';
import { basicProjectView, dacState } from './actions';
import { getUpdateList } from './utils';

const INITIAL_STATE = {};
const DACContext = createContext<any>(INITIAL_STATE);

export function useProject(): [dacState, BasicActions] {
  return useContext(DACContext);
}

//reducer
function reducer(state: dacState, { type, payload }: any) {
  switch (type) {
    case basicProjectView.destroy.type: {
      return {};
    }
    case basicProjectView.setList.type: {
      const { skipCount, total, isUpdate, k } = payload;
      const list = getUpdateList(isUpdate, total, (state as any)[k]);
      list.splice(skipCount, payload.list.length, ...payload.list);
      return Object.assign({}, state, { [`${k}Total`]: total, [k]: list });
    }
    case basicProjectView.setProjectList.type: {
      const { projectList = [] } = state || {};
      const list = payload.isAdd ? projectList.concat(payload.projectList) : payload.projectList;
      return Object.assign({}, state, { ...payload, projectList: list });
    }
    case basicProjectView.setProjectMap.type: {
      const { projectMap } = state || {};
      return Object.assign({}, state, { projectMap: Object.assign({}, projectMap, payload.project) });
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}
export default function Provider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [projectMap, setProjectMap] = useLocalStorage(storages.projectMap);
  const state = useMemo(() => ({ ...s, projectMap }), [projectMap, s]);
  return (
    <DACContext.Provider value={useMemo(() => [state, { dispatch, setProjectMap }], [state, setProjectMap])}>
      {children}
    </DACContext.Provider>
  );
}
