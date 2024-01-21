import React, { useCallback, useState } from 'react';
import './styles.less';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import ButtonGroup from '../components/ButtonGroup';
import { CreateStepPorps } from '../types';
import { ComfirmModal, SuccessModal } from './components/Modal';
import { useWallet } from 'contexts/useWallet/hooks';
import { NETWORK_CONFIG } from 'constants/network';
import { ITrandingParCard } from '../components/TradingPairList';
import { useTransfer } from './useTransfer';
import { emitLoading } from 'utils/events';
import { getInfo } from '../utils';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface SuccessInfo {
  supply?: number;
  transactionId?: string;
  projectId?: string;
}

const Transfer: React.FC<CreateStepPorps> = ({ onPre }) => {
  const [tradingPair] = useLocalStorage<ITrandingParCard>(storages.ConfirmTradingPair);
  const [additional] = useLocalStorage(storages.AdditionalInformation);
  const [idoInfo] = useLocalStorage<any>(storages.IDOInfo);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo>();
  const { register } = useTransfer();
  const navigate = useNavigate();

  const onTransfer = useCallback(async () => {
    setOpenConfirmModal(false);
    emitLoading(true, { text: 'Processing on the blockchain...' });
    const result: any = await register({ tradingPair, idoInfo, additional });
    console.log('createResult:', result);
    if (result?.errMsg) {
      console.log('error', result);
      emitLoading(false);
      message.error('create failed');
      return;
    }
    setSuccessInfo(result);
    emitLoading(false);
    setOpenSuccessModal(true);
  }, [additional, idoInfo, register, tradingPair]);

  const gotoDetail = useCallback(() => {
    navigate(`/project/${successInfo?.projectId}`, { replace: true });
  }, [navigate, successInfo?.projectId]);

  return (
    <div className="transfer-page">
      <ButtonGroup onPre={onPre} onNext={() => setOpenConfirmModal(true)} nextText="Transfer Now" />
      <ComfirmModal info={{}} open={openConfirmModal} onCancel={() => setOpenConfirmModal(false)} onOk={onTransfer} />
      <SuccessModal
        info={{ transactionId: successInfo?.transactionId, supply: successInfo?.supply }}
        open={openSuccessModal}
        onCancel={() => setOpenSuccessModal(false)}
        onOk={gotoDetail}
      />
    </div>
  );
};

export default Transfer;
