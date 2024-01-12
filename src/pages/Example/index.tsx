import { Button } from 'antd';
import { useLockCallback } from 'hooks';
import { useCallback, useState } from 'react';
import { setThemes } from 'utils/themes';
import './styles.less';
import { useWallet } from 'contexts/useWallet/hooks';
import Web3Button from 'components/Web3Button';
import { NETWORK_CONFIG } from 'constants/network';
import { getProtobufTime } from 'utils';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { request } from 'api';

export default function Example() {
  const [url, setUrl] = useState('');
  const submit = useLockCallback(async () => {
    // console.log('submit strat');
    // await mockApiRequest();
    // console.log('submit end', url);
  }, [url]);

  const { login, logout, wallet } = useWallet();

  const { getTokenContract, getEwellContract } = useViewContract();

  const transfer = useCallback(async () => {
    try {
      const ewellContract = await getEwellContract();
      const addressData = await ewellContract.GetPendingProjectAddress.call(wallet?.walletInfo.address);
      console.log('addressData', addressData);

      const txResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
        methodName: 'Transfer',
        args: {
          symbol: 'LINHONG',
          to: addressData,
          amount: '10000000000',
          memo: '',
        },
      });

      console.log('txResult', txResult);
    } catch (error) {
      console.log('error', error);
    }
  }, [getEwellContract, wallet]);

  const create = useCallback(async () => {
    const registerInput = {
      acceptedCurrency: 'ELF',
      projectCurrency: 'LINHONG',
      crowdFundingType: 'Sell at the set price',
      crowdFundingIssueAmount: '10000000000',
      preSalePrice: 100000000,
      startTime: getProtobufTime(Date.now() + 1 * 60 * 60 * 1000),
      endTime: getProtobufTime(Date.now() + 40 * 60 * 60 * 1000),
      minSubscription: 1,
      maxSubscription: 1000,
      publicSalePrice: 200000000,
      listMarketInfo: [],
      liquidityLockProportion: 50,
      unlockTime: getProtobufTime(Date.now() + 30 * 60 * 60 * 1000),
      isEnableWhitelist: false,
      isBurnRestToken: true,
      totalPeriod: 1,
      additionalInfo: {},
      firstDistributeProportion: '100000000',
      restDistributeProportion: 0,
      periodDuration: 0,
      tokenReleaseTime: getProtobufTime(Date.now() + 45 * 60 * 60 * 1000),
    };
    console.log('registerInput', registerInput);

    try {
      const createResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'Register',
        args: registerInput,
      });
      console.log('create', createResult);
    } catch (error) {
      console.log('error', error);
    }
  }, [wallet]);

  const getBalance = useCallback(async () => {
    const tokenContract = await getTokenContract();
    const result = await tokenContract.GetBalance.call({
      symbol: 'LINHONG',
      owner: 'vQfjcuW3RbGmkcL74YY4q3BX9UcH5rmwLmbQi3PsZxg8vE9Uk',
    });
    console.log('getBalance', result);
  }, [getTokenContract]);

  const getList = useCallback(async () => {
    try {
      const result = await request.project.list({});
      console.log('getList', result);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  return (
    <div>
      <Web3Button
        onClick={() => {
          console.log('111');
        }}>
        Continue
      </Web3Button>
      <Button onClick={transfer}>transfer</Button>
      <Button onClick={create}>create</Button>
      <Button onClick={getList}>getList</Button>
      <Button type="primary" onClick={getBalance}>
        balance
      </Button>
      <Button
        type="primary"
        onClick={() => {
          login();
        }}>
        login
      </Button>
      <Button
        type="primary"
        onClick={() => {
          logout();
        }}>
        logout
      </Button>
      <Button type="primary" onClick={() => setThemes('dark')}>
        dark
      </Button>
      <Button type="primary" onClick={() => setThemes('light')}>
        light
      </Button>
      {/* <Network /> */}
      <div className="dark-box" />
      <div className="light-box" />
      {/* {chainId} */}
      <div className="test-class" />
      {/* <Button type="primary" onClick={() => setUrl((v) => ({ ...v, a: 1 }))}>
        a
      </Button> */}
      {/* <Button type="primary" onClick={() => setUrl((v) => ({ ...v, b: 1 }))}>
        b
      </Button> */}
      <Button
        type="primary"
        onClick={() => {
          // tokenContract?.callSendMethod('Transfer', '', {
          //   symbol: 'WH',
          //   amount: 808000000,
          //   to: ChainConstants.constants.IDO_CONTRACT,
          // });
        }}>
        Transfer
      </Button>
      <Button type="primary" onClick={() => submit()}>
        submit
      </Button>
    </div>
  );
}
