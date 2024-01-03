import clsx from 'clsx';
import { useMemo } from 'react';
import './styles.less';
import { useNavigate } from 'react-router-dom';
import { useActiveWeb3React } from 'hooks/web3';
import { useCopyToClipboard, useLocation } from 'react-use';
import { message, Space } from 'antd';
import CommonLink from 'components/CommonLink';
import { getProjectProgress, progressText } from 'contexts/useProjectInfo/utils';
import { ZERO } from 'constants/misc';
import { ProjectProgress } from 'components/BaseProgress';
import IconFont from 'components/IconFont';
import { Icons, InfoIcons } from 'constants/iconfont';
import { useMobile } from 'contexts/useStore/hooks';
import ProjectLogo from 'components/ProjectLogo';
import { ProjectItem } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { getHref } from 'utils';

export default function SymbolInfo({ symbolInfo, isCreate }: { symbolInfo?: ProjectItem; isCreate?: boolean }) {
  const [isCopied, setCopied] = useCopyToClipboard();
  const { account } = useActiveWeb3React();
  const { origin, href } = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const progressRate = useMemo(
    () => getProjectProgress(symbolInfo?.startTime, symbolInfo?.endTime, symbolInfo?.isCanceled),
    [symbolInfo],
  );

  const percent = useMemo(() => {
    const percent = ZERO.plus(symbolInfo?.currentRaisedAmount ?? 0)
      .div(symbolInfo?.toRaisedAmount ?? 0)
      .times(1e2);
    return percent.isNaN() ? ZERO : percent;
  }, [symbolInfo?.currentRaisedAmount, symbolInfo?.toRaisedAmount]);

  const additionalInfo = useMemo(() => symbolInfo?.additionalInfo, [symbolInfo?.additionalInfo]);

  const symbolName = useMemo(
    () => (
      <h3 className="flex-row-center">
        <span className="font-size-title1 symbol-name">{symbolInfo?.crowdFundingIssueToken?.name ?? '--'}</span>
        <Space size={8.8} className="badge-content">
          {symbolInfo?.creator === account && <IconFont type={InfoIcons.owner} />}
          {symbolInfo?.isEnableWhitelist && <IconFont type={InfoIcons.whitelist} />}
        </Space>
        {!isMobile && <span className={clsx(progressRate)}>{progressText[progressRate]}</span>}
      </h3>
    ),
    [symbolInfo, isMobile, account, progressRate],
  );
  const media = useMemo(() => {
    return Object.entries(additionalInfo ?? {}).map(([key, value]) => {
      const type = InfoIcons[key as keyof typeof InfoIcons];
      if (type) {
        return (
          <CommonLink href={getHref(value as string)} key={type as string} showIcon={false}>
            <li>
              <IconFont type={type} />
            </li>
          </CommonLink>
        );
      }
    });
  }, [additionalInfo]);

  const mediaContent = useMemo(() => <ul className="flex-row-center media-content">{media}</ul>, [media]);
  const tokenEle = useMemo(
    () => (
      <div className="flex-row-center symbol-detail-token">
        <div>
          <span className="font-size-2">Token Symbol</span>
          <span>{symbolInfo?.crowdFundingIssueToken?.symbol ?? '--'}</span>
        </div>
        <div>
          <span className="font-size-2">Decimal</span>
          <span>{symbolInfo?.crowdFundingIssueToken?.decimals ?? '--'}</span>
        </div>
      </div>
    ),
    [symbolInfo?.crowdFundingIssueToken?.decimals, symbolInfo?.crowdFundingIssueToken?.symbol],
  );

  const editActionEle = useMemo(
    () => (
      <div className="text-right edit-action">
        {account === symbolInfo?.creator && symbolInfo?.hash && (
          <IconFont type={Icons.modifyInfo} onClick={() => navigate(`/edit-information/${symbolInfo?.hash}`)} />
        )}
        <IconFont
          type={Icons.share}
          onClick={() => {
            if (isCopied?.error) return message.error(isCopied?.error?.message);
            if (isCreate) origin && setCopied(origin);
            else href && setCopied(href);
            href && message.success('copy success');
          }}
        />
      </div>
    ),
    [account, href, isCopied?.error, isCreate, navigate, origin, setCopied, symbolInfo?.creator, symbolInfo?.hash],
  );

  const pcEle = useMemo(
    () => (
      <div className="flex flex-1">
        <ProjectLogo
          key={additionalInfo?.logoUrl}
          src={additionalInfo?.logoUrl}
          alt={symbolInfo?.crowdFundingIssueToken?.symbol}
        />
        <div className="flex-1 symbol-detail-content">
          <div className="symbol-info-header">
            {editActionEle}
            {symbolName}
          </div>
          <div className="flex-between-center">
            {tokenEle}
            {mediaContent}
          </div>
        </div>
      </div>
    ),
    [additionalInfo, editActionEle, mediaContent, symbolName, tokenEle, symbolInfo?.crowdFundingIssueToken?.symbol],
  );

  const mobileEle = useMemo(
    () => (
      <div className="info-card">
        <div className="flex-between-center">
          <div className="flex-row-center">
            <ProjectLogo src={additionalInfo?.logoUrl} alt={symbolInfo?.crowdFundingIssueToken?.symbol} />
            <span className={clsx(progressRate)}>{progressText[progressRate]}</span>
          </div>
          {editActionEle}
        </div>
        {symbolName}
        {mediaContent}
        {tokenEle}
      </div>
    ),
    [
      additionalInfo,
      editActionEle,
      mediaContent,
      progressRate,
      symbolInfo?.crowdFundingIssueToken?.symbol,
      symbolName,
      tokenEle,
    ],
  );

  return (
    <div className="symbol-info-wrapper">
      <div className="common-card symbol-info-content">
        <div className="symbol-detail">{isMobile ? mobileEle : pcEle}</div>
        <div className="font-size-2 symbol-introduction">{additionalInfo?.description ?? ''}</div>
      </div>
      {!isCreate && (
        <div className="common-card ido-progress-wrapper">
          <div className="font-size-2 flex-between-center raise-header">
            <div className="raise-content">
              <span>{divDecimalsStr(symbolInfo?.currentRaisedAmount, symbolInfo?.toRaiseToken?.decimals)}</span>
              <span>{`${symbolInfo?.toRaiseToken?.symbol ?? '--'} raised`}</span>
            </div>
            {percent.gte(100) && <div className="max-tip">MAX</div>}
          </div>
          <ProjectProgress percent={percent} />
          <div className="flex-between-center font-size-4 participant-wrapper">
            <span>{`${symbolInfo?.participantCount || '--'} participants`}</span>
            <span>
              {`${divDecimalsStr(
                symbolInfo?.currentRaisedAmount ?? 0,
                symbolInfo?.toRaiseToken?.decimals,
              )} /${divDecimalsStr(symbolInfo?.toRaisedAmount, symbolInfo?.toRaiseToken?.decimals)} ${
                symbolInfo?.toRaiseToken?.symbol || '--'
              }`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
