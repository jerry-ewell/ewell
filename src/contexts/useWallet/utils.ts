import { showWelcomeModal } from 'components/WelcomeModal';
import { LocalStorageKey } from 'constants/localStorage';
import { NETWORK_CONFIG } from 'constants/network';
import { IWallet } from './Wallet/types';
import { WalletType, did } from 'aelf-web-login';
import { GetCAHolderByManagerParams } from '@portkey/services';
import AElf from 'aelf-sdk';
import axios from 'axios';
import { stringify } from 'query-string';
import { service } from 'api/axios';
import myEvents from 'utils/myEvent';

export type TJWTData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
const Day = 1 * 24 * 60 * 60 * 1000;
export type TLocalJWTData = {
  expiresTime?: number;
} & TJWTData;
export const getLocalJWT = (key: string) => {
  try {
    const localData = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
    if (!localData) return;
    const data = JSON.parse(localData) as { [key: string]: TLocalJWTData };
    const cData = data[key];
    if (!cData || !cData?.expiresTime) return;
    if (Date.now() - 0.5 * Day > cData?.expiresTime) return;
    return cData;
  } catch (error) {
    return;
  }
};

export const setLocalJWT = (key: string, data: TLocalJWTData) => {
  const localData: TLocalJWTData = {
    ...data,
    expiresTime: Date.now() + (data.expires_in - 10) * 1000,
  };
  return localStorage.setItem(LocalStorageKey.ACCESS_TOKEN, JSON.stringify({ [key]: localData }));
};

export const clearLocalJWT = () => {
  return localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
};

export const recoverPubKey = (msg, signature) => {
  const signatureObj = {
    r: signature.slice(0, 64),
    s: signature.slice(64, 128),
    recoveryParam: Number(signature.slice(128, 130)),
  };

  const hexMsg = AElf.utils.sha256(msg);

  const publicKey = AElf.wallet.ellipticEc
    .recoverPubKey(Buffer.from(hexMsg, 'hex'), signatureObj, signatureObj.recoveryParam)
    .encode('hex', false);
  return publicKey;
};

export const authToken = async (wallet: IWallet) => {
  const address = wallet.walletInfo.address;
  const key = `ELF_${address}_${NETWORK_CONFIG.sideChainId}`;
  const localJWT = getLocalJWT(key);
  if (localJWT) {
    service.defaults.headers.common['Authorization'] = `${localJWT.token_type} ${localJWT.access_token}`;
    myEvents.AuthToken.emit();
    return;
  }

  showWelcomeModal({
    onAccept: async () => {
      let caHash: string | undefined;
      if (wallet.walletType === WalletType.discover) {
        try {
          const res = await did.services.getHolderInfoByManager({
            caAddresses: [address],
          } as unknown as GetCAHolderByManagerParams);
          const caInfo = res[0];
          caHash = caInfo?.caHash || '';
          console.log('caHash', caHash);
        } catch (error) {
          return;
        }
      }

      try {
        const plainText = `Nonce:${Date.now()}`;
        const plainTextHex = Buffer.from(plainText).toString('hex');
        const result = await wallet?.getSignature({
          signInfo: AElf.utils.sha256(plainTextHex),
        });
        const signature = result?.signature || '';

        console.log('result', signature);
        const pubKey = recoverPubKey(plainTextHex, signature);
        console.log('pubKey', pubKey);
        // console.log('managerAddress', pubKeyToAddress(pubKey));

        const apiData = {
          grant_type: 'signature',
          scope: 'EwellServer',
          client_id: 'EwellServer_App',
          pubkey: pubKey,
          signature,
          plain_text: plainTextHex,
          ca_hash: caHash,
          chain_id: NETWORK_CONFIG.sideChainId,
        };

        const res = await axios.post<any>(`/connect/token`, stringify(apiData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 8000,
        });
        console.log('/connect/token', res);
        setLocalJWT(key, res.data);
        service.defaults.headers.common['Authorization'] = `${res.data.token_type} ${res.data.access_token}`;
        myEvents.AuthToken.emit();
      } catch (error) {
        console.log('authToken error', error);
      }
    },
    onCancel: () => {
      myEvents.RefuseAuth.emit();
    },
  });
};
