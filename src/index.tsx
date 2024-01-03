import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { NetworkContextName } from 'constants/index';
import { useLanguage } from 'i18n';
import { ANTD_LOCAL } from 'i18n/config';
import { ConfigProvider } from 'antd';
import getLibrary from 'utils/getLibrary';
import ModalProvider from './contexts/useModal';
import ChainProvider from 'contexts/useChain';
import StoreProvider from 'contexts/useStore';
import AElfContractProvider from 'contexts/useAElfContract';
import ProjectProvider from 'contexts/useProject';
import './index.css';
import { prefixCls } from 'constants/theme';
import { WhiteListProvider } from 'components/WhitelistService';
import ProjectInfoContext from 'contexts/useProjectInfo';
import { APP_NAME } from 'constants/aelf';
import { AElfReactProvider } from '@aelf-react/core';
import AElfReactManager from 'components/AElfReactManager';
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);
ConfigProvider.config({
  prefixCls,
});

function ContextProviders({ children }: { children?: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <ConfigProvider locale={ANTD_LOCAL[language]} autoInsertSpaceInButton={false} prefixCls={prefixCls}>
      <ProjectProvider>
        <ModalProvider>
          <WhiteListProvider>
            <ProjectInfoContext>{children}</ProjectInfoContext>
          </WhiteListProvider>
        </ModalProvider>
      </ProjectProvider>
    </ConfigProvider>
  );
}
ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <AElfReactProvider appName={APP_NAME || ''}>
        <AElfReactManager>
          <AElfContractProvider>
            <ChainProvider>
              <StoreProvider>
                <ContextProviders>
                  <App />
                </ContextProviders>
              </StoreProvider>
            </ChainProvider>
          </AElfContractProvider>
        </AElfReactManager>
      </AElfReactProvider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
