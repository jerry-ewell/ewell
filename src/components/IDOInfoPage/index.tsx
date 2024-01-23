import clsx from 'clsx';
import IconFont from 'components/IconFont';
import ToTop from 'components/ToTop';
import { Icons } from 'constants/iconfont';
import { InstallmentDecimal, ZERO } from 'constants/misc';
import { useMobile } from 'contexts/useStore/hooks';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { ProjectItem } from 'types/project';
import { getPriceDecimal } from 'utils';
import { divDecimals, divDecimalsStr } from 'utils/calculate';
import './styles.less';

export default function IDOInfoPage({ idoInfo, isCreate }: { idoInfo?: ProjectItem; isCreate?: boolean }) {
  const isMobile = useMobile();
  const wrapTitle = useCallback(
    (a: string, b: string) => (
      <>
        {a}&nbsp;
        {isMobile ? <br /> : ''}
        {b}&nbsp;
      </>
    ),
    [isMobile],
  );

  const idoInfoList = useMemo(
    () => [
      {
        title: 'IDO type',
        key: 'crowdFundingType',
        value: idoInfo?.crowdFundingType ?? '--',
      },
      {
        title: 'Initial offer price',
        key: 'preSalePrice',
        value: idoInfo?.preSalePrice
          ? `1 ${idoInfo?.toRaiseToken?.symbol ?? '--'} = ${
              divDecimals(
                idoInfo?.preSalePrice ?? 0,
                getPriceDecimal(idoInfo?.crowdFundingIssueToken, idoInfo?.toRaiseToken),
              ).toFixed() ?? '--'
            }  ${idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}`
          : '--',
      },
      {
        title: 'Supply',
        key: 'circulation',
        value: divDecimalsStr(idoInfo?.crowdFundingIssueAmount, idoInfo?.crowdFundingIssueToken?.decimals ?? 8),
      },
      // TODO

      {
        title: 'Token unsold',
        key: 'unsoldTokens',
        value: idoInfo ? (idoInfo?.isBurnRestToken ? 'Burn' : 'Return') : '--',
      },

      {
        title: 'IDO starts at',
        key: 'startTime',
        value: idoInfo?.startTime ? dayjs((idoInfo?.startTime ?? 0) * 1000).format('YYYY.MM.DD HH:mm') : '--',
      },
      {
        title: 'IDO ends at',
        key: 'endTime',
        value: idoInfo?.endTime ? dayjs((idoInfo?.endTime ?? 0) * 1000).format('YYYY.MM.DD HH:mm') : '--',
      },
      // TODO
      {
        title: wrapTitle('Distribution', 'mechanism'),
        key: 'distributionMechanism',
        value: idoInfo ? (idoInfo?.totalPeriod == 1 ? 'Distribution in full' : 'Distribution by installments') : '--',
        className: 'wrap-line',
      },

      // { title: 'Listed on', key: 'marketName', value: listMarket?.market ?? '--' },
      {
        title: 'Listing price',
        key: 'publicSalePrice',
        value: idoInfo?.publicSalePrice
          ? `1 ${idoInfo?.toRaiseToken?.symbol ?? '--'} = ${
              divDecimals(
                idoInfo?.publicSalePrice,
                getPriceDecimal(idoInfo?.crowdFundingIssueToken, idoInfo?.toRaiseToken),
              ).toFixed() ?? '--'
            }  ${idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}`
          : '--',
      },

      // {
      //   title: 'Percentage liquidity',
      //   key: 'liquidityLockProportion',
      //   value: `${idoInfo?.liquidityLockProportion ?? '--'}%`,
      // },
      // {
      //   title: wrapTitle('Liquidity lock-up', 'period'),
      //   key: 'unlockTime',
      //   value: idoInfo?.unlockTime,
      //   className: 'wrap-line',
      // },
    ],
    [idoInfo, wrapTitle],
  );

  const projectInfo = useMemo(
    () => [
      {
        title: wrapTitle('Initial distribution', '(percentage)'),
        key: 'firstDistributionProportion',
        value: `${divDecimalsStr(idoInfo?.firstDistributeProportion, InstallmentDecimal - 2)}%`,
        className: 'wrap-line',
      },
      {
        title: wrapTitle('Distribution by installments', '(percentage)'),
        key: 'periodizationDistributionProportion',
        value: `${divDecimalsStr(idoInfo?.restDistributeProportion, InstallmentDecimal - 2)}%`,
        className: 'wrap-line',
      },
      {
        title: 'Terms',
        key: 'totalPeriod',
        value: idoInfo?.totalPeriod ?? '--',
        // className: 'wrap-line',
      },
      {
        title: wrapTitle('Distribution period', '(minutes)'),
        key: 'terms',
        value: idoInfo?.periodDuration ? ZERO.plus(idoInfo?.periodDuration).div(60).toFixed() : '--',
        className: 'wrap-line',
      },
    ],
    [idoInfo, wrapTitle],
  );
  // const teamCanGetInfo = useMemo(
  //   () => [
  //     { title: '团队所得总数', key: 'teamGetTotal', value: '--' },
  //     { title: '上市后首次发放（分钟）', key: 'teamStagingReleaseRate', value: '--' },
  //     { title: 'Initial distribution (percentage)', key: 'teamFirstReleaseRate', className: '', value: '--' },
  //     { title: '分期发放比例', key: 'teamStagingReleaseRate1', value: '--' },
  //     { title: 'Distribution period (minutes)', key: 'teamCycle', value: '--' },
  //   ],
  //   [],
  // );
  return (
    <div className="ido-info-wrapper">
      <div className="common-card ido-info-content">
        <h3 className="font-size-title flex-row-center card-title">
          <IconFont type={Icons.idoInfo} />
          <i>IDO information</i>
        </h3>
        <ul className="common-info-detail">
          {idoInfoList.map((info) => (
            <li key={info.key} className={clsx('flex-between-center', info?.className)}>
              <span title="type-title">{info.title}</span>
              <span>{info?.value ?? '--'}</span>
            </li>
          ))}
        </ul>
      </div>
      {idoInfo?.totalPeriod && idoInfo?.totalPeriod > 1 && (
        <div className="common-card project-release-info">
          <h3 className={clsx('font-size-title flex-row-center card-title', isMobile && 'card-wrap-title')}>
            <IconFont type={Icons.stagingMethod} />
            <i>Regarding distribution by installments</i>
          </h3>
          <ul className="common-info-detail">
            {projectInfo.map((info) => (
              <li className={clsx('flex-between-center', info?.className)} key={info.key}>
                <span title="type-title">{info.title}</span>
                <span>{info?.value ?? '--'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next stage */}
      {/* {idoInfo?.teamCanGet && ( */}
      {/* <div className="common-card project-team-get">
        <h3 className="font-size-title flex-row-center card-title">
          <IconFont type={Icons.team} />
          <i>团队所得信息</i>
        </h3>
        <ul className="common-info-detail">
          {teamCanGetInfo.map((info) => (
            <li className={clsx('flex-between-center', info?.className)} key={info.key}>
              <span title='type-title'>{info.title}</h6>
              <span>{info?.value ?? '--'}</span>
            </li>
          ))}
        </ul>
      </div> */}
      {/* )} */}
      {!isCreate && isMobile && <ToTop />}
    </div>
  );
}
