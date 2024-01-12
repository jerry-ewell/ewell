import { WalletInfo, WalletType, CallContractParams, SignatureData, SignatureParams } from 'aelf-web-login';
import { CallContractFunc, GetSignatureFunc, IWallet, IWalletProps, TSignatureParams } from './types';

class Wallet implements IWallet {
  walletInfo: WalletInfo;
  walletType: WalletType;
  _getSignature: GetSignatureFunc;
  _callContract: CallContractFunc;

  constructor(props: IWalletProps) {
    this.walletInfo = props.walletInfo;
    this.walletType = props.walletType;
    this._callContract = props.callContract;
    this._getSignature = props.getSignature;
  }

  setCallContract(callContract: CallContractFunc) {
    this._callContract = callContract;
  }
  setGetSignature(getSignature: GetSignatureFunc) {
    this._getSignature = getSignature;
  }

  public callContract<T, R>(params: CallContractParams<T>): Promise<R> {
    if (this.walletType !== WalletType.portkey) {
      return this._callContract(params);
    }

    return this._callContract({
      // TODO: add caContractAddress & caHash
      contractAddress: '',
      methodName: 'ManagerForwardCall',
      args: {
        caHash: '',
        contractAddress: params.contractAddress,
        methodName: params.methodName,
        args: params.args,
      },
    });
  }

  getSignature(params: TSignatureParams): Promise<SignatureData> {
    return this._getSignature({
      // TODO: add appName
      appName: '',
      address: this.walletInfo.address,
      ...params,
    });
  }
}

export default Wallet;
