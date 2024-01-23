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
import ScrollToTop from 'components/ScrollToTop';
import './styles.less';

const CreateProject: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<TSteps>(TSteps.ONE);

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
        return <Transfer onPre={onPre} />;
    }
  }, [currentStep, onNext, onPre]);

  return (
    <div className="common-page-1360 cre-project page-body">
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
      <div className={clsx('project-wrapper', currentStep === TSteps.FOURE && 'project-wrapper-full')}>
        {/* TODO: scroll top */}
        {/* <ScrollToTop /> */}
        <ESteps current={currentStep} items={stepsItems} />
        {renderStep}
      </div>
    </div>
  );
};

export default CreateProject;
