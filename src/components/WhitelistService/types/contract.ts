export type TagInfo = {
  tagName: string;
  info?: any;
};

export type ExtraInfo = {
  addressList: AddressList;
  info: TagInfo;
};

export enum StrategyType {
  Basic = 0,
  Price = 1,
  Customize = 2,
}

export type ExtraInfoList = { value: ExtraInfo[] };

export interface CreateWhitelistInput {
  extraInfoList: ExtraInfoList[];
  isCloneable?: boolean;
  remark?: string;
  creator: string;
  managerList: string[];
  projectId: string;
  strategyType: StrategyType;
}

export interface AddressList {
  value: string[];
}

export interface ExtraInfoId {
  addressList: AddressList;
  id?: string;
}

export interface ExtraInfoIdList {
  value: ExtraInfoId[];
}

export interface AddAddressInfoListToWhitelistInput {
  whitelistId: string;
  //｛address+info｝List
  // extraInfo?: ExtraInfo;
  extraInfoIdList: ExtraInfoIdList;
}

export interface RemoveAddressInfoListFromWhitelistInput {
  whitelistId: string;
  extraInfoIdList: ExtraInfoIdList;
}

export interface RemoveInfoFromWhitelistInput {
  whitelistId: string;
  addressList: AddressList;
}

export interface ResetWhitelistInput {
  whitelistId: string;
  projectId: string;
}

export interface AddExtraInfoInput {
  whitelistId: string;
  projectId: string;
  tagInfo: TagInfo;
  addressList: AddressList;
}

export interface RemoveTagInfoInput {
  whitelistId: string;
  projectId: string;
  tagId: string;
}

export interface UpdateExtraInfoId {
  addressList: AddressList;
  oldAddressList?: AddressList;
  id?: string;
}

export interface UpdateExtraInfoInput {
  whitelistId: string;
  extraInfoList: UpdateExtraInfoId;
}
export interface GetExtraInfoByTagInput {
  whitelistId: string;
  projectId: string;
  tagInfo: TagInfo;
}

export interface WhitelistInfoContract {
  //The whitelist id.
  whitelistid: string | null;
  //The project id.
  projectId: string | null;
  //The list of address and extra info in this whitelist.
  extraInfoIdList: ExtraInfoIdList;
  //Whether the whitelist is available.
  isAvailable: boolean;
  //Whether the whiteList can be cloned.
  isCloneable: boolean;
  remark: string;
  clone_from?: string;
  creator?: string;
  manager: AddressList;
  strategy_type: StrategyType;
}
