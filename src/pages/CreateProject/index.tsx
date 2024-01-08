import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Steps, StepProps, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './styles.less';
import ConfirmTradingPair from './ConfirmTradingPair';
import ProjectInfo from './ProjectInfo';
import IDOInfo from './IDOInfo';
import Transfer from './Transfer';
import { ICreateStepPorps, ESteps } from './types';
import { stepsItems } from './constants';
import './styles.less';

const ProjectSteps: React.FC<any>[] = [ConfirmTradingPair, ProjectInfo, IDOInfo, Transfer];

const CreateProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ESteps>(ESteps.FOURE);

  const onNext = useCallback(() => {
    console.log('onNext');
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const onPre = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const renderStep = useMemo(() => ProjectSteps[currentStep]({ onNext, onPre }), [currentStep, onNext, onPre]);
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
        {currentStep !== ESteps.FOURE && <Steps current={currentStep} items={stepsItems} />}
        {renderStep}
      </div>
    </div>
  );
};

export default CreateProject;
