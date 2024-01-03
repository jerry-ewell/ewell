import {
  CreateWhitelistInput,
  AddAddressInfoListToWhitelistInput,
  RemoveAddressInfoListFromWhitelistInput,
  RemoveInfoFromWhitelistInput,
  ResetWhitelistInput,
  AddExtraInfoInput,
  RemoveTagInfoInput,
  UpdateExtraInfoInput,
  StrategyType,
} from '../types/contract';

const errorPromise = Promise.resolve({
  error: {
    message: 'Invalid argument',
  },
});

export const createWhiteList = async (v: CreateWhitelistInput, contract?: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('CreateWhitelist', account ?? '', [v.extraInfoList, v.isCloneable, v.remark]);
};

export const disableWhiteList = async (whitelistId: string, contract?: any, account?: any) => {
  if (!contract || !whitelistId) return errorPromise;
  return await contract?.callSendMethod('DisableWhitelist', account ?? '', whitelistId);
};
export const enableWhiteList = async (whitelistId: string, contract?: any, account?: any) => {
  if (!contract || !whitelistId) return errorPromise;
  return await contract?.callSendMethod('EnableWhitelist', account ?? '', whitelistId);
};

export const addToWhiteList = async (v: AddAddressInfoListToWhitelistInput, contract?: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('AddAddressInfoListToWhitelist', account ?? '', [
    v.whitelistId,
    v.extraInfoIdList,
  ]);
};

export const removeAddressInfoFromWhiteList = async (
  v: RemoveAddressInfoListFromWhitelistInput,
  contract: any,
  account?: any,
) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('RemoveAddressInfoListFromWhitelist', account ?? '', [
    v.whitelistId,
    v.extraInfoIdList,
  ]);
};
export const removeFromWhiteList = async (v: RemoveInfoFromWhitelistInput, contract: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('RemoveInfoFromWhitelist', account ?? '', [v.whitelistId, v.addressList]);
};

export const resetWhitelistHandler = async (v: ResetWhitelistInput, contract: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('ResetWhitelist', account ?? '', [v.whitelistId, v.projectId]);
};

export const addExtraInfo = async (v: AddExtraInfoInput, contract: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('AddExtraInfo', account ?? '', [
    v.whitelistId,
    v.projectId,
    v.tagInfo,
    v.addressList,
  ]);
};

export const removeTagInfo = async (v: RemoveTagInfoInput, contract: any, account?: any) => {
  if (!contract) return errorPromise;
  return await contract?.callSendMethod('RemoveTagInfo', account ?? '', [v.whitelistId, v.projectId, v.tagId]);
};

export const updateOnlyByAddress = async (v: UpdateExtraInfoInput, contract: any, account?: any) => {
  if (!v?.extraInfoList?.oldAddressList) return errorPromise;
  const removeRes = await removeFromWhiteList(
    {
      whitelistId: v.whitelistId,
      addressList: v?.extraInfoList?.oldAddressList,
    },
    contract,
    account ?? '',
  );
  if (removeRes?.error) return removeRes;
  const extraInfoList = v.extraInfoList;
  delete extraInfoList.oldAddressList;
  return await addToWhiteList(
    {
      whitelistId: v.whitelistId,
      extraInfoIdList: {
        value: [extraInfoList],
      },
    },
    contract,
    account ?? '',
  );
};

export const updateWhitelistUserInfo = async (
  v: UpdateExtraInfoInput,
  strategyType: StrategyType,
  contract: any,
  account?: any,
) => {
  if (!contract) return errorPromise;
  if (strategyType === StrategyType.Basic) return await updateOnlyByAddress(v, contract, account);
  const extraInfoList = v.extraInfoList;
  delete extraInfoList.oldAddressList;
  return await contract?.callSendMethod('UpdateExtraInfo', account ?? '', [v.whitelistId, extraInfoList]);
};
