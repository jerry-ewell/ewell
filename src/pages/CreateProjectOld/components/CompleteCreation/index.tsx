import { Button, Col, Divider, message, Row } from 'antd';
import IDOInfoPage from 'components/IDOInfoPage';
import SymbolInfo from 'components/SymbolInfo';
import ToTop from 'components/ToTop';
import Web3Button from 'components/Web3Button';
import { ZERO } from 'constants/misc';
import { useProject } from 'contexts/useProject';
import { useIDOContract } from 'hooks/useContract';
import { useActiveWeb3React } from 'hooks/web3';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from 'react-use';
import { unifyProject, unifyProjectFromInfo } from 'utils/project';
import storages from '../../storages';
import { getInfo, getInstallments, reSetSessionStorage } from '../../utils';
import dayjs from 'dayjs';
import { getProtobufTime } from 'utils';
import { usePendingProjectAddress } from 'hooks/project';
import { useBalances } from 'hooks/useBalances';
import { divDecimals } from 'utils/calculate';
import TransferCard from '../TransferCard';
export default function CompleteCreation({ onPre }: { onPre: () => void }) {
  const [additionalInfo] = useSessionStorage<any>(storages.AdditionalInformation);
  const [confirmTradingPair] = useSessionStorage<any>(storages.ConfirmTradingPair);
  const [projectPanel] = useSessionStorage<any>(storages.ProjectPanel);
  const [loading, setLoading] = useState<boolean>();
  const { account } = useActiveWeb3React();
  const navigate = useNavigate();
  const [, { setProjectMap }] = useProject();
  const idoContract = useIDOContract();
  const info = useMemo(
    () => getInfo(confirmTradingPair, projectPanel, additionalInfo),
    [additionalInfo, confirmTradingPair, projectPanel],
  );
  console.log(info, '==confirmTradingPair');
  const { tokenSymbol, tokenDecimal, crowdFundingIssueAmount } = info || {};
  const pendingAddress = usePendingProjectAddress();
  const [[balance], onGetBalance] = useBalances([tokenSymbol], undefined, pendingAddress);
  const transferBalance = divDecimals(crowdFundingIssueAmount, tokenDecimal)
    .minus(divDecimals(balance, tokenDecimal))
    .dp(tokenDecimal);
  const onRegister = useCallback(async () => {
    if (!account || loading) return;
    const now = dayjs();
    if (ZERO.lt(now.diff(info.startTime)) || ZERO.lt(now.diff(info.endTime))) {
      message.error('The start date should be later than now.');
      return;
    }
    setLoading(true);
    try {
      const params = {
        ...info,
        ...getInstallments(info),
        endTime: getProtobufTime(info.endTime),
        startTime: getProtobufTime(info.startTime),
        listMarketInfo: [
          {
            market: '',
            weight: 100,
          },
        ],
        liquidityLockProportion: 60,
        unlockTime: getProtobufTime(),
      };
      const req = await idoContract?.callSendMethod('Register', account, params);
      if (req.error) {
        message.error(req.error.message);
      } else {
        message.success('Created successfully!');
        const project = unifyProject(req.Logs, info, params);
        let to = '/project-list';
        if (project) {
          setProjectMap({
            [project.projectId]: project,
          });
          to = `/project/${project.projectId}`;
        }
        navigate(to, { replace: true });
        setTimeout(() => {
          reSetSessionStorage();
        }, 500);
      }
    } catch (error) {
      console.debug(error, '======Register');
    }
    setLoading(false);
  }, [account, idoContract, info, loading, navigate, setProjectMap]);
  return (
    <div className="complete-creation">
      <SymbolInfo isCreate symbolInfo={unifyProjectFromInfo(info)} />
      <IDOInfoPage isCreate idoInfo={unifyProjectFromInfo(info)} />
      <TransferCard
        transferBalance={transferBalance}
        pendingAddress={pendingAddress}
        tokenSymbol={tokenSymbol}
        tokenDecimal={tokenDecimal}
        onGetBalance={onGetBalance}
      />
      <Divider />
      <Row className="form-button-row">
        <Col span={11}>
          <Button htmlType="button" onClick={onPre}>
            Back to the last step
          </Button>
        </Col>
        <Col span={11} offset={2}>
          {/* <Web3Button disabled={transferBalance.gt(0)} type="primary" loading={loading} onClick={onRegister}>
            Continue
          </Web3Button> */}
        </Col>
      </Row>
      <ToTop />
    </div>
  );
}
