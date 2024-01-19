import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Breadcrumb } from 'antd';
import './styles.less';
import ConfirmTradingPair from './ConfirmTradingPair';
import ProjectInfo from './ProjectInfo';
import IDOInfo from './IDOInfo';
import Transfer from './Transfer';
import ESteps from './components/ESteps';
import { CreateStepPorps, TSteps } from './types';
import { stepsItems } from './constants';
import './styles.less';

const ProjectSteps: React.FC<CreateStepPorps>[] = [ConfirmTradingPair, ProjectInfo, IDOInfo, Transfer];

const CreateProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TSteps>(TSteps.THREE);

  const onNext = useCallback(() => {
    console.log('onNext');
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const onPre = useCallback(() => {
    setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case TSteps.ONE:
        return <ConfirmTradingPair onNext={onNext} />;
      case TSteps.TWO:
        return <ProjectInfo onNext={onNext} onPre={onPre} />;
      case TSteps.THREE:
        return <IDOInfo onNext={onNext} onPre={onPre} />;
      case TSteps.FOURE:
        return <Transfer />;
    }
  }, [currentStep, onNext, onPre]);

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
        <ESteps current={currentStep} items={stepsItems} />
        {renderStep}
      </div>
    </div>
  );
};

export default CreateProject;
