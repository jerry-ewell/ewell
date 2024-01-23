import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Row, Col, Flex } from 'antd';
import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import { getProjectStatus, ProjectStatus } from 'utils/project';
import communityLogo from 'assets/images/communityLogo';
import { IProjectInfo, IAdditionalInfo } from './types';
import { mockDetail } from './mock';
import { ZERO } from 'constants/misc';
import { divDecimals } from 'utils/calculate';
import { NumberFormat } from 'utils/format';
import { ProjectStatus as IProjectStatus } from 'types/project';
import { useNavigate } from 'react-router-dom';
import { stringifyUrl } from 'query-string';
import { parseAdditionalInfo } from 'utils/project';
import './styles.less';

export interface IProjectCard {
  id?: string;
  chainId?: string;
  creator?: string;
  crowdFundingType?: string;
  crowdFundingIssueAmount?: string;
  preSalePrice?: number;
  additionalInfo?: string[];
  startTime?: number;
  endTime?: number;
  unlockTime?: number;
  isCanceled?: boolean;
  cancelTime?: number;
  toRaisedAmount?: number;
  currentRaisedAmount?: number;
}

export interface ProjectCardProps {
  data: IProjectInfo;
}

const { Text } = Typography;
const Card: React.FC<ProjectCardProps> = ({ data }) => {
  const {
    additionalInfo = '',
    preSalePrice,
    crowdFundingIssueToken,
    currentRaisedAmount,
    toRaisedAmount,
    toRaiseToken,
    status,
  } = data;

  const _additionalInfo = useMemo(() => parseAdditionalInfo(additionalInfo), [additionalInfo]);

  const progressPercent = useMemo(() => {
    const percent = ZERO.plus(currentRaisedAmount ?? 0)
      .div(toRaisedAmount ?? 0)
      .times(1e2);
    return percent.isNaN() ? ZERO : percent;
  }, [currentRaisedAmount, toRaisedAmount]);
  const navigate = useNavigate();

  const jumpDetail = useCallback(() => {
    navigate(
      stringifyUrl({
        url: `/participant-list/${data.id}`,
        query: {
          projectName: _additionalInfo?.projectName || '',
        },
      }),
    );
  }, [_additionalInfo?.projectName, data.id, navigate]);

  return (
    <div className="project-card" onClick={jumpDetail}>
      <img className="project-img" src={_additionalInfo?.projectImgs.split(',')[0] || ''} />
      <Flex className="project-card-info">
        <img className="project-card-logo" src={_additionalInfo?.logoUrl?.split(',')[0] || ''} alt="" />
        <div>
          <div className="project-name">{_additionalInfo?.projectName || '--'}</div>
          {/* <ProjectStatusRow status={'Upcoming'} /> */}
        </div>
      </Flex>
      <div className="project-desc">{_additionalInfo?.projectSummary}</div>
      <div className="project-community">
        {Object.entries(additionalInfo || [])
          .filter(([key]) => Object.keys(communityLogo).find((item) => item === key))
          .map(([key, value], index) => (
            <img
              key={index}
              className="cursor-pointer"
              src={communityLogo[key]}
              alt="community"
              onClick={() => {
                window.open(value, '_blank');
              }}
            />
          ))}
      </div>
      <Flex className="project-card-sale" justify="space-between">
        <div className="text-left">
          <div>Sale Price</div>
          {/* TODO: calculate prePrice */}
          <div>
            1 ELF ={divDecimals(preSalePrice, crowdFundingIssueToken?.decimals).toFixed()}
            PIGE
          </div>
        </div>
        <div className="text-right">
          <div>Ended Time</div>
          <div>30 Nov 2023</div>
        </div>
      </Flex>
      <Progress
        size={['100%', 12]}
        percent={progressPercent.toNumber()}
        strokeColor={status === IProjectStatus.PARTICIPATORY ? '#131631' : '#C1C2C9'}
        trailColor="#F5F5F6"
      />
      <Flex className="project-progress" justify="space-between">
        <Text>{progressPercent.toNumber()}%</Text>
        <Text>
          {divDecimals(currentRaisedAmount, toRaiseToken?.decimals).toFixed()}/
          {divDecimals(toRaisedAmount, toRaiseToken?.decimals).toFixed()} ELF
        </Text>
      </Flex>
    </div>
  );
};

export default Card;
