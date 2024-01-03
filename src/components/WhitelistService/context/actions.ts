import { FilterTool } from '../components/InfoTool';
import {
  ProjectWhiteList,
  UserLevelList,
  WhiteListConfigType,
  TagInfoList,
  WhitelistInfoList,
  // WhitelistInfoType,
  WhitelistInfoByContract,
} from '../types';
import { basicActions } from './utils';

const WhiteListActions = {
  destroy: 'DESTROY',
  updateWhiteListConfig: 'UPDATE_WHITELIST_CONFIG',
  updateCommonList: 'UPDATE_COMMON_LIST_ACTION',
  updateWhiteListInfo: 'UPDATE_WHITELIST_INFO',
  updateInitViewTool: 'updateInitViewTool',
  updateState: 'UPDATE_STATE',
};

export interface WhiteListState {
  chainId?: any;
  contract?: any;
  whitelistId?: string;
  projectId?: string;
  account?: string;
  projectWhiteList?: ProjectWhiteList;
  adminAddress?: string;
  userLevelList?: UserLevelList;
  tagInfoList?: TagInfoList[];
  refresh: number;
  whitelistInfoList?: WhitelistInfoList;
  whitelistInfo?: WhitelistInfoByContract; //WhitelistInfoType;
  initViewTool?: FilterTool;
  initRemoveTool?: FilterTool;
}

export const basicWhiteListView = {
  updateWhiteListConfig: {
    type: WhiteListActions.updateWhiteListConfig,
    actions: (v: WhiteListConfigType) => basicActions(WhiteListActions.updateWhiteListConfig, v),
  },

  updateWhiteListInfo: {
    type: WhiteListActions.updateWhiteListInfo,
    actions: (v: WhitelistInfoByContract) => basicActions(WhiteListActions.updateWhiteListConfig, { whitelistInfo: v }),
  },
  updateState: {
    type: WhiteListActions.updateState,
    actions: (v: any) => basicActions(WhiteListActions.updateState, v),
  },
  updateCommonList: {
    type: WhiteListActions.updateCommonList,
    actions: (stateKey: keyof WhiteListState, list: any, total?: number, skipCount?: number, isUpdate?: boolean) =>
      basicActions(WhiteListActions.updateCommonList, {
        stateKey,
        list,
        total,
        skipCount,
        isUpdate,
      }),
  },
  destroy: {
    type: WhiteListActions.destroy,
    actions: () => basicActions(WhiteListActions.destroy),
  },
};
