import { FormItemProps, ModalProps } from 'antd';
import { DraggerProps } from 'antd/lib/upload';
import { ReactNode } from 'react';
import { StrategyType, WhitelistInfoContract } from './contract';

export type ToolItemInstance = {
  getState: () => any;
  onSetState: (v: any) => void;
};

export interface ModalWhiteListProps extends ModalProps {
  className?: string;
  leftCallBack?: () => void;
  leftElement?: ReactNode | boolean;
  transitionName?: string;
}
/**
 *
 * @param contract can view README.md
 *
 * export interface ContractBasics {
 *   contract: any;
 *   address: string;
 *   methods?: any;
 *   callViewMethod: (functionName: string, paramsOption?: any) => Promise<any | ErrorMsg>;
 *
 *   callSendMethod: (functionName: string, paramsOption?: any) => Promise<ErrorMsg> | Promise<any>;
 *
 *   callSendPromiseMethod: (functionName: string, paramsOption?: any) => Promise<ErrorMsg> | Promise<any>;
 */
export interface WhiteListConfigType {
  chainId?: number;
  whitelistId?: string;
  contract?: any;
  adminAddress?: string;
  account?: string;
  // projectId?: string;
}
export interface WhiteListProviderProps extends WhiteListConfigType {
  children?: ReactNode;
}

export enum MODAL_ACTION_TYPE {
  HIDE = '',
  ADD_WHITELIST = 'ADD_WHITELIST',
  RM_WHITELIST = 'RM_WHITELIST',
  RESET_WHITELIST = 'RESET_WHITELIST',
  USER_LEVEL_SETTING = 'USER_LEVEL_SETTING',
  VIEW_THE_WHITELIST = 'VIEW_THE_WHITELIST',
}

export enum ADD_RM_TYPE {
  Alone = 'Alone',
  Batch = 'Batch',
}

export interface AddRmWhiteProps {
  whiteListModal: ModalWhiteListProps;
  whiteContract?: any;
  draggerProps?: DraggerProps;
  whitelistId?: string;
  adminAddress?: string;
}

export interface ResetWhiteListProps {
  whitelistId?: string;
  projectId?: string;
  whiteListModal?: ModalWhiteListProps;
  whiteContract?: any;
}

export interface ViewTheWhiteListProps {
  whitelistId?: string;
  projectId?: string;
  whiteListModal?: ModalWhiteListProps;
  whiteContract?: any;
  account?: string;
  adminAddress?: string;
}
/**
 * Whitelist.WhitelistExtraInfoIndexDto
 */
export interface ProjectWhiteListItemDto {
  address?: null | string;
  chainId?: number;
  id?: string;
  tagInfo?: TagInfoBase;
  whitelistInfo?: WhitelistInfoBase;
}
export interface ProjectWhiteListItem extends ProjectWhiteListItemDto {
  tagName?: string;
  key: string;
}
export interface ProjectWhiteList {
  totalCount: number;
  items: ProjectWhiteListItem[];
}

export interface CustomizeAddTagFormItem extends FormItemProps {
  customizeItem: ReactNode;
}

export interface UserLevelSettingProps {
  whitelistId?: string;
  projectId: string;
  whiteListModal?: ModalWhiteListProps;
  whiteContract?: any;
  customizeAddTagFormItem?: CustomizeAddTagFormItem[];
}
export interface PaginationPage {
  pageSize: number;
  page: number;
}

export interface UserLevelList {
  totalCount?: number;
  items: UserLevelItem[] | null;
}
/**
 * Whitelist.WhitelistExtraInfoIndexDto
 */
export interface UserLevelItem extends TagInfoBase {
  // [x: string]: any;
  key?: string;
  address?: string;
}

/**
 * Whitelist.TagInfoBaseDto
 */
export interface TagInfoBase {
  addressCount?: number;
  chainId?: number;
  id?: string;
  info?: null | string;
  name?: null | string;
  priceTagInfo?: PriceTagInfo;
  tagHash?: null | string;
}

/**
 * Whitelist.PriceTagInfoDto
 */
export interface PriceTagInfo {
  price?: number;
  symbol?: null | string;
}

/**
 * Whitelist.WhitelistInfoBaseDto
 */
export interface WhitelistInfoBase {
  chainId?: number;
  id?: string;
  projectId?: null | string;
  strategyType?: number;
  whitelistHash?: null | string;
}

export interface WhitelistInfo {
  totalCount: number;
  items: UserLevelItem[];
}
export interface WhitelistInfoList {
  totalCount: number;
  items: UserLevelItem[];
}

export interface WhitelistInfoType {
  id: string;
  chainId: number;
  whitelistHash: string | null;
  projectId: string | null;
  isAvailable: boolean;
  isCloneable: boolean;
  remark: string | null;
  cloneWhitelistHash: string | null;
  creator: string | null;
  strategyType: StrategyType;
}

export interface WhitelistInfoByContract extends WhitelistInfoContract {
  whitelistHash: string | null;
  strategyType: StrategyType;
}

export interface TagInfoList {
  label: string;
  value?: string;
}

/**
 * Whitelist.TagInfoIndexDto
 */
export interface TagInfoListDto {
  addressCount?: number;
  chainId?: number;
  id?: string;
  info?: null | string;
  name?: null | string;
  priceTagInfo?: PriceTagInfo;
  tagHash?: null | string;
  whitelistInfo?: WhitelistInfoBase;
}

export interface PriceTokenList {
  items?: TokenInfoBase[] | null;
}

/**
 * Whitelist.PriceTokenDto
 */
export interface TokenInfoBase {
  address?: null | string;
  chainId?: number;
  decimals?: number;
  symbol?: null | string;
}

export interface ManagerDto {
  items?: ManagerItem[] | null;
  totalCount?: number;
}

/**
 * Whitelist.WhitelistManagerIndexDto
 */
export interface ManagerItem {
  chainId?: number;
  id?: string;
  manager?: null | string;
  whitelistInfo?: WhitelistInfoBase;
}

// TODO
