import React from 'react';
import clsx from 'clsx';
import { Steps, StepProps, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './styles.less';
import ConfirmTradingPair from './ConfirmTradingPair';

const stepsItems: StepProps[] = [
  {
    title: 'Trading Pair',
  },
  {
    title: 'Project Information',
  },
  {
    title: 'IDO Information',
  },
  {
    title: 'Preview & Transfer',
  },
];

const CreateProject: React.FC = () => {
  return (
    <div className="common-page-1360 cre-project">
      <Breadcrumb
        className="project-nav"
        separator="\"
        items={[
          {
            title: 'Home',
          },
          {
            title: 'Lanch with EWELL',
          },
        ]}
      />
      <div className="project-wrapper">
        <Steps current={0} items={stepsItems} />
        <ConfirmTradingPair />
      </div>
    </div>
  );
};

export default CreateProject;
