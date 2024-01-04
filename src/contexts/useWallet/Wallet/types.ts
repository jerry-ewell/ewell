import { WalletInfo, WalletType, WalletHookInterface } from 'aelf-web-login';

export type CallContractFunc = WalletHookInterface['callContract'];
export type GetSignatureFunc = WalletHookInterface['getSignature'];

export interface IWallet {
  walletInfo: WalletInfo;
  walletType: WalletType;
  callContract: CallContractFunc;
  getSignature: GetSignatureFunc;
  setCallContract: (callContract: CallContractFunc) => void;
  setGetSignature: (getSignature: GetSignatureFunc) => void;
}

export type IWalletProps = {
  walletInfo: WalletInfo;
  walletType: WalletType;
  callContract: CallContractFunc;
  getSignature: GetSignatureFunc;
};
