import React, { useCallback, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import ButtonGroup from '../components/ButtonGroup';
import { CreateStepPorps } from '../types';
import { ComfirmModal, SuccessModal } from './components/Modal';
import { ITrandingParCard } from '../components/TradingPairList';
import { useTransfer } from './useTransfer';
import { emitLoading } from 'utils/events';
import { message, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import NewProjectInfo from 'pages/NewProjectInfo';
import { getInfo } from '../utils';
import { AELF_TOKEN_INFO } from 'constants/misc';
import { Typography, FontWeightEnum } from 'aelf-design';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { ProjectStatus } from 'types/project';

interface SuccessInfo {
  supply?: number;
  transactionId?: string;
  projectId?: string;
}

const { Title } = Typography;

const Transfer: React.FC<CreateStepPorps> = ({ onPre }) => {
  const [tradingPair] = useLocalStorage<ITrandingParCard>(storages.ConfirmTradingPair);
  const [additional] = useLocalStorage(storages.AdditionalInformation);
  const [idoInfo] = useLocalStorage<any>(storages.IDOInfo);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successInfo, setSuccessInfo] = useState<SuccessInfo>();
  const { register } = useTransfer();
  const navigate = useNavigate();

  const previewData = useMemo(() => {
    const { additionalInfo, ...data } = getInfo(tradingPair, idoInfo, additional);
    const { startTime, endTime, tokenReleaseTime } = idoInfo;
    let status = ProjectStatus.UPCOMING;
    const now = Date.now();
    if (dayjs(tokenReleaseTime).valueOf() < now) {
      status = ProjectStatus.ENDED;
    } else if (dayjs(endTime).valueOf() < now) {
      status = ProjectStatus.UNLOCKED;
    } else if (dayjs(startTime).valueOf() < now) {
      status = ProjectStatus.PARTICIPATORY;
    }
    return {
      ...data,
      additionalInfo: additionalInfo.data,
      toRaiseToken: AELF_TOKEN_INFO,
      crowdFundingIssueToken: tradingPair,
      startTime,
      endTime,
      tokenReleaseTime,
      unlockTime: tokenReleaseTime,
      toRaisedAmount: new BigNumber(data.crowdFundingIssueAmount).div(data.preSalePrice).toString(),
      status,
    } as any;
  }, [additional, idoInfo, tradingPair]);

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
      <Title
        level={6}
        fontWeight={FontWeightEnum.Medium}
        style={{
          padding: '48px 0',
        }}>
        You are previewing the project. Last Step: Transfer the Token to the smart contract to create the project.
      </Title>
      <NewProjectInfo
        previewData={previewData}
        style={{
          minHeight: 'calc(100vh - 64px - 72px - 188px - 96px)',
        }}
      />
      <ButtonGroup
        onPre={onPre}
        onNext={() => setOpenConfirmModal(true)}
        nextText="Transfer Now"
        style={{ marginTop: 24 }}
      />
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
