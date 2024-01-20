import React, { useCallback, useEffect, useState } from 'react';
import TradingPairList, { ITrandingParCard } from '../components/TradingPairList';
import './styles.less';
import { Button, message as adMessage } from 'antd';
import { CreateStepPorps } from '../types';
import { useLocalStorage } from 'react-use';
import storages from '../storages';
import { request } from 'api';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import ButtonGroup from '../components/ButtonGroup';

const ConfirmTradingPair: React.FC<CreateStepPorps> = ({ onNext }) => {
  const [tradingPair, setTradingPair] = useLocalStorage(storages.ConfirmTradingPair);
  const [select, setSelect] = useState<ITrandingParCard>(tradingPair as ITrandingParCard);
  const [tokenList, setTokenList] = useState<ITrandingParCard[]>([]);
  const [disabledBtn, setDisabledBtn] = useState<boolean>(true);

  const onSelect = useCallback((value: ITrandingParCard) => {
    setDisabledBtn(false);
    setSelect({ ...value });
  }, []);

  const onClick = useCallback(() => {
    setTradingPair(select);
    console.log('click-next');
    onNext?.();
  }, [setTradingPair, select, onNext]);

  const getTokenList = useCallback(async () => {
    try {
      const { code, data, message } = await request.project.getTokenList({
        params: { chainId: DEFAULT_CHAIN_ID },
      });
      if (code === '20000') {
        setTokenList(data);
        return;
      }
      message && adMessage.error(message);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    getTokenList();
  });

  return (
    <div className="trading-page">
      <div className="trading-title">Start your new project in EWELL</div>
      <div className="trading-sub-title">
        The token you choose will be used to sell, and the token from the sale will be ELF.
      </div>
      <TradingPairList list={tokenList} current={select} onChange={onSelect} />
      <div className="trading-footer">
        <div className="footer-text">
          There is proper token, go to <span className="link-text">Symbol Market</span> and create a?
        </div>
      </div>
      <ButtonGroup onNext={onClick} disabledNext={disabledBtn} />
    </div>
  );
};
export default ConfirmTradingPair;
