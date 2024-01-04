import React from 'react';
import './styles.less';

const TradingPairCard: React.FC = () => {
  return (
    <div className="trading-card">
      <div className="card-left">
        <div className="token-icon">P</div>
        <div>
          <div className="token-name">PIGE</div>
          <div className="chain-info">MainChain AELF</div>
        </div>
      </div>
      <div className="card-right">
        <div className="token-quantity">500,000,000,000</div>
        <div className="token-value">$ 378,239,584</div>
      </div>
    </div>
  );
};
export default TradingPairCard;
