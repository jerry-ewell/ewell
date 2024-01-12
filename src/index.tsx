import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import './index.css';
import { prefixCls } from 'constants/theme';
ConfigProvider.config({
  prefixCls,
});
import WalletProvider from './contexts/useWallet';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import { useLanguage } from 'i18n';
import { ANTD_LOCAL } from 'i18n/config';
import { ReactNode } from 'react';
import StoreProvider from './contexts/useStore';
import ViewContractProvider from 'contexts/useViewContract';

function ContextProviders({ children }: { children?: ReactNode }) {
  const { language } = useLanguage();
  return (
    <ConfigProvider locale={ANTD_LOCAL[language]} autoInsertSpaceInButton={false} prefixCls={prefixCls}>
      <StoreProvider>
        <ViewContractProvider>
          <WalletProvider>{children}</WalletProvider>
        </ViewContractProvider>
      </StoreProvider>
    </ConfigProvider>
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
