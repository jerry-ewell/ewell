import { Button } from 'antd';
import clsx from 'clsx';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import BaseCountdown from 'components/BaseCountdown';
import IconFont from 'components/IconFont';
import { Icons } from 'constants/iconfont';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { ProjectItemExt } from 'contexts/useProjectInfo/actions';
import { useProjectInfoByFetch } from 'contexts/useProjectInfo/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styled.less';

export default function LiquidityUnlock() {
  const navigate = useNavigate();
  const [{ idoInfo, idoContract: contract }] = useProjectInfo();
  const { projectId } = useParams();
  const projectInfo = useProjectInfoByFetch();
  const [project, setProject] = useState<ProjectItemExt>();
  const [disabled, setDisabled] = useState<boolean>();
  const { account } = useActiveWeb3React();
  useEffect(() => {
    idoInfo && setProject(idoInfo);
    idoInfo?.isCanceled && setDisabled(true);
  }, [idoInfo]);

  useEffect(() => {
    projectInfo && setProject(projectInfo);
  }, [projectInfo]);

  const pairInfo = useMemo(
    () => [
      {
        title: 'LP address',
        key: 'lpAddress',
        value: project?.creator,
        isSingleLine: true,
        className: 'address-line',
      },
      { title: 'Listed on', key: 'marketName', value: 'AwakenSwap' },
      { title: 'Trading pair ', key: 'pairName', value: '--' },
      { title: 'Fund pool', key: 'pool', value: '0.3%' },
    ],
    [project?.creator],
  );
  const lockInfo = useMemo(
    () => [
      {
        title: 'LP地址',
        key: 'lpAddress',
        className: 'address-line',
        value: 'ELF_LFxg7nqpuWPxp3EgEjmTjaCmwsY6Z2sB6xZ6tRGMod9YSfvMv_tDVV',
        isSingleLine: true,
      },
      { title: '上市于', key: 'marketName', value: 'AwakenSwap' },
      { title: '交易对名称', key: 'pairName', value: '--' },
      { title: '资金池', key: 'pool', value: '0.3%' },
    ],
    [],
  );

  const LockLiquidity = useCallback(async () => {
    if (!account || !contract) return;
    const res = await contract?.callSendMethod('LockLiquidity', account, projectId);
    console.log(res);
  }, [account, contract, projectId]);
  return (
    <div className="min-height-container liquidity-unlock-wrapper">
      <BaseBreadcrumb />
      <div className="common-card countdown-wrapper">
        <h3 className="countdown-title">Unlock in</h3>
        <BaseCountdown value={dayjs().add(1, 'd').valueOf()} format="DD/HH/mm/ss" delimiter=":" />
      </div>

      <div className="common-card pair-info-wrapper">
        <h4 className="card-title">
          <IconFont type={Icons.idoInfo} />
          <i>Trading pair info</i>
        </h4>
        <ul className="common-info-detail pair-info">
          {pairInfo.map((info) => (
            <li className={clsx(info?.className)} key={info.key}>
              <span title="type-title">{info.title}</span>
              <span>{info.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="common-card lock-info-wrapper">
        <h4 className="card-title">
          <IconFont type={Icons.lockInfo} />
          <i>Lock-up information</i>
        </h4>
        <ul className="common-info-detail lock-info">
          {lockInfo.map((lock) => (
            <li className={clsx(lock?.className)} key={lock.key}>
              <span title="type-title">{lock.title}</span>
              <span>{lock.value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-between-center unlock-action-wrapper">
        <Button onClick={() => navigate(`/project/${projectId}`)}>Back</Button>
        <Button disabled={disabled} type="primary" onClick={LockLiquidity}>
          Unlock
        </Button>
      </div>
    </div>
  );
}
