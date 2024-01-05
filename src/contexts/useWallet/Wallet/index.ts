import { WalletInfo, WalletType, CallContractParams } from 'aelf-web-login';
import { CallContractFunc, GetSignatureFunc, IWallet, IWalletProps } from './types';

class Wallet implements IWallet {
  walletInfo: WalletInfo;
  walletType: WalletType;
  getSignature: GetSignatureFunc;
  _callContract: CallContractFunc;

  constructor(props: IWalletProps) {
    this.walletInfo = props.walletInfo;
    this.walletType = props.walletType;
    this._callContract = props.callContract;
    this.getSignature = props.getSignature;
  }

  setCallContract(callContract: CallContractFunc) {
    this._callContract = callContract;
  }
  setGetSignature(getSignature: GetSignatureFunc) {
    this.getSignature = getSignature;
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
}

export default Wallet;
