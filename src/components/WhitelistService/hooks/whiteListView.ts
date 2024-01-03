import { GetExtraInfoByTagInput } from '../types/contract';

export const getWhiteList = async (whitelistId?: string, contract?: any) => {
  if (!whitelistId) return;
  return await contract?.callViewMethod('GetWhitelist', whitelistId);
};

export const getTagInfoFromWhitelist = (v: GetExtraInfoByTagInput, contract?: any) => {
  const { whitelistId, projectId, tagInfo } = v;
  return contract?.callViewMethod('GetTagInfoFromWhitelist', [whitelistId, projectId, tagInfo]);
};

export const getWhitelistDetail = (whitelistId: string, contract?: any) => {
  if (!whitelistId) return;
  return contract?.callViewMethod('GetWhitelistDetail', whitelistId);
};

export const getAddressFromWhitelist = (whitelistId?: string, address?: string, contract?: any) => {
  if (!whitelistId || !address) return;
  return contract?.callViewMethod('GetAddressFromWhitelist', [whitelistId, address]);
};
