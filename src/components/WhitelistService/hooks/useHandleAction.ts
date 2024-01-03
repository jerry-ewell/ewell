import { useMemo } from 'react';
import { useRefreshState } from '../context/hooks';
import { useWhiteList } from '../context/useWhiteList';
import {
  AddRmWhiteProps,
  ADD_RM_TYPE,
  MODAL_ACTION_TYPE,
  ResetWhiteListProps,
  UserLevelSettingProps,
  ViewTheWhiteListProps,
} from '../types';
import { disableWhiteList, enableWhiteList } from './managersAction';

export const useHandleAction = () => {
  const [, { handleModalAction }] = useWhiteList();
  const updateState = useRefreshState();
  return useMemo(
    () => ({
      addWhiteList: (addWhiteParam?: AddRmWhiteProps) =>
        handleModalAction(MODAL_ACTION_TYPE.ADD_WHITELIST, { addType: ADD_RM_TYPE.Alone, ...addWhiteParam }),
      addWhiteListBatch: (addWhiteParam?: AddRmWhiteProps) =>
        handleModalAction(MODAL_ACTION_TYPE.ADD_WHITELIST, {
          addType: ADD_RM_TYPE.Batch,
          ...addWhiteParam,
        }),
      removeWhiteList: (addWhiteParam?: AddRmWhiteProps) =>
        handleModalAction(MODAL_ACTION_TYPE.RM_WHITELIST, { addType: ADD_RM_TYPE.Alone, ...addWhiteParam }),
      removeWhiteListBatch: (addWhiteParam?: AddRmWhiteProps) =>
        handleModalAction(MODAL_ACTION_TYPE.RM_WHITELIST, {
          addType: ADD_RM_TYPE.Batch,
          ...addWhiteParam,
        }),
      resetWhiteList: (param?: ResetWhiteListProps) => handleModalAction(MODAL_ACTION_TYPE.RESET_WHITELIST, param),
      userLevelSetting: (param?: UserLevelSettingProps) =>
        handleModalAction(MODAL_ACTION_TYPE.USER_LEVEL_SETTING, param),
      viewTheWhiteList: (param?: ViewTheWhiteListProps) =>
        handleModalAction(MODAL_ACTION_TYPE.VIEW_THE_WHITELIST, param),
      updateState,
    }),
    [handleModalAction, updateState],
  );
};

export const useManagerAction = () => {
  const [{ contract, whitelistInfo, account }] = useWhiteList();
  return useMemo(
    () => ({
      enableWhiteList: () => enableWhiteList(whitelistInfo?.whitelistHash ?? '', contract, account),
      disableWhiteList: () => disableWhiteList(whitelistInfo?.whitelistHash ?? '', contract, account),
    }),
    [account, contract, whitelistInfo?.whitelistHash],
  );
};
