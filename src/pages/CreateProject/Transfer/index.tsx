import * as React from 'react';
import { Button, Steps } from 'antd';
import { stepsItems } from '../constants';
import { whiteArrow } from 'assets/images/project/index';
import './styles.less';
import { useLocalStorage } from 'react-use';
import storages from '../storages';

const Transfer: React.FC = () => {
  const [additional] = useLocalStorage(storages.AdditionalInformation);
  // const [projectPanel] = useLocalStorage(storages.ProjectPanel);
  return (
    <div className="transfer-page">
      <div className="common-page-1360 transfer-container">
        <div className="transfer-nav">
          <img src={whiteArrow} />
          <span>Previous</span>
        </div>
        <Steps className="transfer-steps" current={4} items={stepsItems} />
        <div className="transfer-guide">
          <div className="guide-text">
            You are previewing the project. Last Step: Transfer the Token to the smart contract to create the project.
          </div>
          <Button className="guide-btn">
            <div className="btn-content">
              <span>Transfer Now</span>
              <img src={whiteArrow} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
