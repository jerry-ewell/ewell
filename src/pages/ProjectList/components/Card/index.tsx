import React from 'react';
import clsx from 'clsx';
import { Row, Col, Flex } from 'antd';
import { getProjectStatus, ProjectStatus } from 'utils/project';
import ProImg from 'assets/images/project/proimg.png';
import ProIcon from 'assets/images/project/proIcon.png';
import CommonLink from 'components/CommonLink';
import IconFont from 'components/IconFont';

import './styles.less';

function ProjectStatusRow({ status }: { status: keyof typeof ProjectStatus }) {
  if (!status) return null;
  return <div className={clsx('project-status-row', `project-status-row-${status}`)}>{ProjectStatus[status]}</div>;
}

const Card: React.FC = () => {
  return (
    <div className="project-card">
      <img className="project-img" src={ProImg} />
      <Flex className="project-card-info">
        <img className="project-card-logo" src={ProIcon} alt="" />
        <div>
          <div className="project-name">Citizen Conflict</div>
          <ProjectStatusRow status={'Upcoming'} />
        </div>
      </Flex>
      <div className="project-desc">A particularly realistic gunfight game that won&apos;t stop once it starts</div>
      <div className="project-community">
        {/* <CommonLink href={''} isTagA> */}
        <IconFont type="icon-twitter" style={{ fontSize: 16, color: 'black' }} />
        {/* </CommonLink> */}
      </div>
      <Flex className="project-card-sale" justify="space-between">
        <div className="text-left">
          <div>Sale Price</div>
          <div>1 ELF = 1 PIGE</div>
        </div>
        <div className="text-right">
          <div>Ended Time</div>
          <div>30 Nov 2023</div>
        </div>
      </Flex>
      <div className="project-progress"></div>
    </div>
  );
};

export default Card;
