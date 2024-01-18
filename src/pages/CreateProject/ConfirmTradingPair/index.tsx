import React, { useCallback, useState } from 'react';
import TradingPairList, { ITrandingParCard } from '../components/TradingPairList';
import './styles.less';
import { Button } from 'antd';
import { CreateStepPorps } from '../types';
import { useLocalStorage } from 'react-use';
import storages from '../storages';

const tokenlist = [
  {
    chainId: 'tDVV',
    symbol: 'WWX',
    tokenName: 'willtest',
    imageUrl: 'https://forest-dev.s3.ap-northeast-1.amazonaws.com/1705560566744-1700130464178-20230421-145342.jpeg',
    decimals: 2,
    balance: 100000,
  },
  {
    chainId: 'AELF',
    symbol: 'TTV',
    tokenName: 'willtest',
    imageUrl: 'https://forest-dev.s3.ap-northeast-1.amazonaws.com/1705560566744-1700130464178-20230421-145342.jpeg',
    decimals: 3,
    balance: 100000,
  },
  {
    chainId: 'tDVV',
    symbol: 'RRS',
    tokenName: 'willtest',
    imageUrl: 'https://forest-dev.s3.ap-northeast-1.amazonaws.com/1705560566744-1700130464178-20230421-145342.jpeg',
    decimals: 4,
    balance: 100000,
  },
];

const ConfirmTradingPair: React.FC<CreateStepPorps> = ({ onNext, onPre }) => {
  const [tradingPair, setTradingPair] = useLocalStorage(storages.ConfirmTradingPair);
  const [select, setSelect] = useState<ITrandingParCard>(tradingPair as ITrandingParCard);

  const onSelect = useCallback((value: ITrandingParCard) => {
    setSelect({ ...value });
  }, []);

  const onClick = useCallback(() => {
    setTradingPair(select);
    onNext?.();
  }, [setTradingPair, select, onNext]);

  return (
    <div className="trading-page">
      <div className="trading-title">Start your new project in EWELL</div>
      <div className="trading-sub-title">
        The token you choose will be used to sell, and the token from the sale will be ELF.
      </div>
      <TradingPairList list={tokenlist} current={select} onChange={onSelect} />
      <div className="trading-footer">
        <div className="footer-text">
          There is proper token, go to <span className="link-text">Symbol Market</span> and create a?
        </div>
      </div>
      <Button onClick={onClick}>{`Next >`}</Button>
    </div>
  );
};
export default ConfirmTradingPair;
