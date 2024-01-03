import { Steps, Tabs } from 'antd';
import { pageToTop } from 'components/ToTop/utils';
import { useMobile } from 'contexts/useStore/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectOnce, useSessionStorage, useUpdateEffect } from 'react-use';
import { showModal } from 'utils/modal';
import AdditionalInformation from './components/AdditionalInformation';
import CompleteCreation from './components/CompleteCreation';
import ConfirmTradingPair from './components/ConfirmTradingPair';
import ProjectPanel from './components/ProjectPanel';
import storages from './storages';
import './styles.less';
import { reSetSessionStorage } from './utils';
const { Step } = Steps;
// const { TabPane } = Tabs;
const steps = [
  {
    title: 'Confirm the Trading Pair',
    description: 'Please enter the token symbol and confirm.',
  },
  {
    title: 'Fill in the panel parameter for the project',
    description: 'Please fill in all the details about this IDO event.',
  },
  {
    title: 'Add Additional Project Information',
    description: 'Please add additional information like URLs to introduce your project.',
  },
  {
    title: 'Complete the Project Creation',
    description: 'Please confirm that above information is correct.',
  },
];

export default function CreateProject() {
  const [current, setCurrent] = useState(0);
  const isMobile = useMobile();
  const ref = useRef<any>();
  const onNext = useCallback(() => {
    setCurrent(current + 1);
  }, [current]);
  const onPre = useCallback(() => {
    setCurrent(current - 1);
  }, [current]);
  useEffect(() => {
    pageToTop({ top: 0 });
  }, [current]);
  const [tradingPair, setTradingPair] = useSessionStorage<any>(storages.ConfirmTradingPair);
  useEffectOnce(() => {
    if (tradingPair) {
      showModal({
        title: 'Tips',
        content: 'Do you want to autofill what you filled in last time?',
        closeIcon: () => null,
        onOk: () => {
          ref.current?.setFieldsValue(tradingPair);
        },
        onCancel: () => {
          reSetSessionStorage();
        },
      });
    }
  });
  useUpdateEffect(() => {
    if (tradingPair && current === 0) {
      ref.current.setFieldsValue(tradingPair);
    }
  }, [current]);
  const stepsMemo = useMemo(() => {
    if (isMobile)
      return (
        <div className="mobile-step flex-column-center">
          <div className="mobile-step-icon">{current + 1}</div>
          <div className="mobile-step-title">{steps[current].title}</div>
          <div className="mobile-step-description">{steps[current].description}</div>
        </div>
      );
    return (
      <Steps current={current} onChange={setCurrent} labelPlacement="vertical">
        {steps.map((item, key) => {
          return <Step disabled={true} key={key} {...item} />;
        })}
      </Steps>
    );
  }, [current, isMobile]);
  const items = useMemo(() => {
    return [
      {
        key: '0',
        label: '',
        children: (
          <ConfirmTradingPair tradingPair={tradingPair} ref={ref} onNext={onNext} setTradingPair={setTradingPair} />
        ),
      },
      {
        key: '1',
        label: '',
        children: <ProjectPanel onPre={onPre} onNext={onNext} />,
      },
      {
        key: '2',
        label: '',
        children: <AdditionalInformation onNext={onNext} onPre={onPre} />,
      },
      {
        key: '3',
        label: '',
        children: <CompleteCreation onPre={onPre} />,
      },
    ];
  }, [tradingPair, ref, onNext, onPre, setTradingPair]);
  return (
    <div className="page-body common-page create-project">
      {stepsMemo}
      <Tabs activeKey={current.toString()} items={items} destroyInactiveTabPane>
        {/* <TabPane key="0">
          <ConfirmTradingPair tradingPair={tradingPair} ref={ref} onNext={onNext} setTradingPair={setTradingPair} />
        </TabPane>
        <TabPane key="1">
          <ProjectPanel onPre={onPre} onNext={onNext} />
        </TabPane>
        <TabPane key="2">
          <AdditionalInformation onNext={onNext} onPre={onPre} />
        </TabPane>
        <TabPane key="3">
          <CompleteCreation onPre={onPre} />
        </TabPane> */}
      </Tabs>
    </div>
  );
}
