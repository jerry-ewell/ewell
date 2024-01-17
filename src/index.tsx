import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import { prefixCls } from 'constants/theme';
import WalletProvider from './contexts/useWallet';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import { ReactNode } from 'react';
import StoreProvider from './contexts/useStore';
import ViewContractProvider from 'contexts/useViewContract';
import { AELFDProvider, HashAddress } from 'aelf-design';
import { ConfigProvider } from 'antd';
import { AELFD_CUSTOM_TOKEN_CONFIG, AELFD_THEME_CONFIG, ANTD_THEME_CONFIG } from 'themTokenConfig';

ConfigProvider.config({
  prefixCls,
});

function ContextProviders({ children }: { children?: ReactNode }) {
  return (
    <AELFDProvider customToken={AELFD_CUSTOM_TOKEN_CONFIG} prefixCls={prefixCls} theme={AELFD_THEME_CONFIG}>
      <ConfigProvider prefixCls={prefixCls} theme={ANTD_THEME_CONFIG}>
        <StoreProvider>
          <ViewContractProvider>
            <WalletProvider>{children}</WalletProvider>
          </ViewContractProvider>
        </StoreProvider>
      </ConfigProvider>
    </AELFDProvider>
  );
}
ReactDOM.render(
  <ContextProviders>
    <App />
  </ContextProviders>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
