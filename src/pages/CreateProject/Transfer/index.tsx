import * as React from 'react';
import './styles.less';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import ButtonGroup from '../components/ButtonGroup';
import { CreateStepPorps } from '../types';

const Transfer: React.FC<CreateStepPorps> = ({ onPre }) => {
  // const [additional] = useLocalStorage(storages.AdditionalInformation);
  // const [projectPanel] = useLocalStorage(storages.ConfirmTradingPair);
  const onTransfer = () => {
    console.log('transfer');
  };
  return (
    <div className="transfer-page">
      <ButtonGroup onPre={onPre} onNext={onTransfer} nextText="Transfer Now" />
    </div>
  );
};

export default Transfer;
