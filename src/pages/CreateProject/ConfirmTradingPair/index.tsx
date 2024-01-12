import React from 'react';
import TradingPairCard from '../components/TradingPairCard';
import './styles.less';
import { Button } from 'antd';
import { CreateStepPorps } from '../types';

const ConfirmTradingPair: React.FC<CreateStepPorps> = ({ onNext, onPre }) => {
  return (
    <div className="trading-page">
      <div className="trading-title">Start your new project in EWELL</div>
      <div className="trading-sub-title">
        The token you choose will be used to sell, and the token from the sale will be ELF.
      </div>
      <TradingPairCard />
      <div className="trading-footer">
        <div className="footer-text">
          There is proper token, go to <span className="link-text">Symbol Market</span> and create a?
        </div>
      </div>
      <Button onClick={() => onNext?.()}>{`Next >`}</Button>
    </div>
  );
};
export default ConfirmTradingPair;
