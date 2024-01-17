import { Button, Card, Col, Row } from 'antd';
import './styles.less';
import { NavLink } from 'react-router-dom';
import Countdown from 'antd/lib/statistic/Countdown';
import { percentFormat, ProjectProgress } from 'components/BaseProgress';
import { ZERO } from 'constants/misc';
import { ProjectItem } from 'types/project';
import { useMemo } from 'react';
import IconFont from 'components/IconFont';
import { InfoIcons } from 'constants/iconfont';
import { getProjectStatus, ProjectStatus } from 'utils/project';
import clsx from 'clsx';
import ProjectLogo from 'components/ProjectLogo';
import { useMobile } from 'contexts/useStore/hooks';
import { unifyMillisecond } from 'utils/time';
import { useActiveWeb3React } from 'hooks/web3';
import CommonLink from 'components/CommonLink';
import { divDecimals } from 'utils/calculate';
import { getHref, getPriceDecimal } from 'utils';

function ProjectStatusRow({ status }: { status: keyof typeof ProjectStatus }) {
  if (!status) return null;
  return <div className={clsx('project-status-row', `project-status-row-${status}`)}>{ProjectStatus[status]}</div>;
}

export default function ProjectCard({ item }: { item: ProjectItem }) {
  const {
    toRaiseToken,
    crowdFundingIssueToken,
    additionalInfo,
    preSalePrice,
    endTime,
    startTime,
    hash,
    currentRaisedAmount,
    toRaisedAmount,
    creator,
    isEnableWhitelist,
  } = item || {};
  const isMobile = useMobile();
  const { account } = useActiveWeb3React();
  const [percent, formatPercent] = useMemo(() => {
    const percent = ZERO.plus(currentRaisedAmount ?? 0)
      .div(toRaisedAmount ?? 0)
      .times(1e2);
    const formatPercent = ZERO.plus(percentFormat(percent)).dp(2).toFixed();
    return [percent, formatPercent];
  }, [currentRaisedAmount, toRaisedAmount]);
  const projectStatus = getProjectStatus(item);
  return (
    <Card
      hoverable
      className="project-card"
      style={{ width: '100%' }}
      cover={
        <Col span={24} className="project-cover">
          <div className="info-card">
            <div className="logo-row">
              <ProjectLogo src={additionalInfo?.logoUrl} alt={crowdFundingIssueToken?.symbol} />
              {isMobile && <ProjectStatusRow status={projectStatus} />}
            </div>
            <Row justify="space-between" className="flex-row-center name-row">
              <div className="project-name">
                <span className="market-name">{crowdFundingIssueToken?.name}</span>
                {creator === account && <IconFont type={InfoIcons.owner} />}
                {isEnableWhitelist && <IconFont type={InfoIcons.whitelist} />}
              </div>
              {!isMobile && <ProjectStatusRow status={projectStatus} />}
            </Row>
            <Row className="info-icon-row">
              {additionalInfo &&
                Object.keys(additionalInfo || {}).map((i) => {
                  const type = (InfoIcons as any)[i];
                  const href = additionalInfo[i];
                  if (type)
                    return (
                      <CommonLink href={getHref(href)} isTagA key={i}>
                        <IconFont type={type} />
                      </CommonLink>
                    );
                })}
            </Row>
          </div>
          <div>
            <div>Sell at the Set Price</div>
            <div className="project-card-description">
              1 {toRaiseToken?.symbol} ={' '}
              {divDecimals(preSalePrice, getPriceDecimal(crowdFundingIssueToken, toRaiseToken)).toFixed()}{' '}
              {crowdFundingIssueToken?.symbol}
            </div>
          </div>
          <div className="progress-card">
            <ProjectProgress percent={percent} />
            <Row justify="space-between" className="amount-row">
              <div>
                {divDecimals(currentRaisedAmount, toRaiseToken?.decimals).toFixed()} {toRaiseToken?.symbol}
              </div>
              <div>
                {divDecimals(toRaisedAmount, toRaiseToken?.decimals).toFixed()} {toRaiseToken?.symbol}
              </div>
            </Row>
            <Row justify="space-between">
              <div>Fundraising Progress</div>
              <div>{formatPercent}%</div>
            </Row>
          </div>
          {projectStatus === ProjectStatus.Upcoming || projectStatus === ProjectStatus['On-going'] ? (
            <Row justify="space-between">
              <div>{projectStatus === ProjectStatus.Upcoming ? 'Fundraising starts in' : 'Fundraising ends in'}</div>
              <Countdown value={unifyMillisecond(projectStatus === ProjectStatus.Upcoming ? startTime : endTime)} />
            </Row>
          ) : (
            <div className="starts-placeholder" />
          )}
          <Button type="primary">
            <NavLink to={`/project/${hash}`}>Visit</NavLink>
          </Button>
        </Col>
      }
    />
  );
}
