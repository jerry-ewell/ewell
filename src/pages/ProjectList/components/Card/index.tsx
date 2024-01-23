import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Row, Col, Flex, Typography } from 'antd';
import { Typography as AELFTypography, FontWeightEnum, Progress } from 'aelf-design';
import { getProjectStatus, ProjectStatus } from 'utils/project';
import ProImg from 'assets/images/project/proimg.png';
import ProIcon from 'assets/images/project/proIcon.png';
import CommonLink from 'components/CommonLink';
import IconFont from 'components/IconFont';
import communityLogo from 'assets/images/communityLogo';
import { IProjectInfo, IAdditionalInfo } from './types';
import { mockDetail } from './mock';
import { ZERO } from 'constants/misc';
import { divDecimals } from 'utils/calculate';
import { NumberFormat } from 'utils/format';
import { ProjectStatus as IProjectStatus } from 'types/project';
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

const { Text } = AELFTypography;
const { Paragraph } = Typography;

const Card: React.FC<ProjectCardProps> = ({ data }) => {
  const {
    additionalInfo = '',
    preSalePrice,
    crowdFundingIssueToken,
    currentRaisedAmount,
    toRaisedAmount,
    toRaiseToken,
    status,
  } = mockDetail;
  const { projectName, projectSummary, projectDescription, logoUrl, projectImgs, ...community } = JSON.parse(
    additionalInfo,
  ) as IAdditionalInfo;

  const progressPercent = useMemo(() => {
    const percent = ZERO.plus(currentRaisedAmount ?? 0)
      .div(toRaisedAmount ?? 0)
      .times(1e2);
    return percent.isNaN() ? ZERO : percent;
  }, [currentRaisedAmount, toRaisedAmount]);

  return (
    <div className="project-card">
      <img className="project-img" src={projectImgs.split(',')[0]} />
      <Flex className="project-card-info">
        <img className="project-card-logo" src={logoUrl?.split(',')[0]} alt="" />
        <div>
          <div className="project-name">{projectName}</div>
          {/* <ProjectStatusRow status={'Upcoming'} /> */}
        </div>
      </Flex>
      <Paragraph className="project-desc" ellipsis={{ rows: 2 }}>
        {projectSummary}
      </Paragraph>
      <div className="project-community">
        {Object.keys(community).map((key, index) => (
          <img
            key={index}
            className="cursor-pointer"
            src={communityLogo[key]}
            alt=""
            onClick={() => {
              window.open(community[key], '_blank');
            }}
          />
        ))}
      </div>
      <Flex className="project-card-sale" justify="space-between">
        <div className="text-left">
          <div>Sale Price</div>
          {/* TODO: caculate preprice */}
          <div>
            1 ELF ={divDecimals(preSalePrice, crowdFundingIssueToken.decimals).toFixed()}
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
          {divDecimals(currentRaisedAmount, toRaiseToken.decimals).toFixed()}/
          {divDecimals(toRaisedAmount, toRaiseToken.decimals).toFixed()} ELF
        </Text>
      </Flex>
    </div>
  );
};

export default Card;
