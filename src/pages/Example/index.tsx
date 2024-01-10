import { useLockCallback } from 'hooks';
import { useState } from 'react';
import { setThemes } from 'utils/themes';
import './styles.less';
import { useWallet } from 'contexts/useWallet/hooks';
import Web3Button from 'components/Web3Button';
import { Tabs, Search, Button, Input, Pagination, Dropdown, Typography, Collapse } from 'test-my-design';

export default function Example() {
  const [url, setUrl] = useState('');
  const submit = useLockCallback(async () => {
    // console.log('submit strat');
    // await mockApiRequest();
    // console.log('submit end', url);
  }, [url]);

  const { login, logout, wallet } = useWallet();

  return (
    <div>
      <Web3Button
        onClick={() => {
          console.log('111');
        }}>
        Continue
      </Web3Button>
      <Button
        // type="primary"
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
      <div style={{ width: '300px', height: '500px' }}>
        <Pagination total={100}></Pagination>
      </div>

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
