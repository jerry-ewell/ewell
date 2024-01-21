import { Button, Modal, Upload } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import './styles.less';
import { useWallet } from 'contexts/useWallet/hooks';
import Web3Button from 'components/Web3Button';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { getProtobufTime } from 'utils';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { request } from 'api';
import myEvents from 'utils/myEvent';
import { WebLoginEvents, useWebLoginEvent } from 'aelf-web-login';
import { getLog } from 'utils/protoUtils';
import { mockCreateResult, walletAddressList } from './data';
import { ZERO } from 'constants/misc';
import { Input } from 'aelf-design';
import { InboxOutlined } from '@ant-design/icons';
import { useParseWhitelist } from 'hooks/useParseWhitelist';
import { identifyWhitelistData } from 'hooks/useParseWhitelist/utils';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';

const { Dragger } = Upload;

export default function Example() {
  const { login, logout, wallet, checkManagerSyncState } = useWallet();

  const { getTokenContract, getEwellContract, getWhitelistContract } = useViewContract();
  const [projectId, setProjectId] = useState('15d556a57222ef06ea9a46a6fb9db416bffb98b8de60ccef6bcded8ca851f407');
  const { updateFile } = useParseWhitelist();

  const transfer = useCallback(async () => {
    try {
      const txResult: any = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
        methodName: 'Transfer',
        args: {
          symbol: 'LINHONG',
          to: '2R7QtJp7e1qUcfh2RYYJzti9tKpPheNoAGD7dTVFd4m9NaCh27',
          amount: '100',
          memo: '',
        },
      });

      console.log('txResult', txResult);
    } catch (error) {
      console.log('error', error);
    }
  }, [wallet]);

  const preCreate = useCallback(
    async (amount?: string) => {
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
            amount: amount || '1000000000',
            memo: '',
          },
        });

        console.log('txResult', txResult);
      } catch (error) {
        console.log('error', error);
      }
    },
    [getEwellContract, wallet],
  );

  const create = useCallback(async () => {
    const registerInput = {
      acceptedCurrency: 'ELF',
      projectCurrency: 'LINHONG',
      crowdFundingType: 'Sell at the set price',
      crowdFundingIssueAmount: '1000000000',
      preSalePrice: '100000000',
      startTime: getProtobufTime(Date.now() + 60 * 1000),
      endTime: getProtobufTime(Date.now() + 40 * 60 * 60 * 1000),
      minSubscription: 1,
      maxSubscription: '1000000000',
      publicSalePrice: ZERO.plus('100000000').div(1.05).toFixed(), // preSalePrice / 1.05
      listMarketInfo: [], // fixed
      liquidityLockProportion: 0, // fixed
      unlockTime: getProtobufTime(Date.now() + 45 * 60 * 60 * 1000), // fixed
      isEnableWhitelist: false,
      isBurnRestToken: true,
      totalPeriod: 1, // fixed
      additionalInfo: {
        data: {
          name: 'test1',
          value: 'test2',
        },
      },
      firstDistributeProportion: '100000000', // fixed 100%
      restDistributeProportion: 0, // fixed
      periodDuration: 0, // fixed
      tokenReleaseTime: getProtobufTime(Date.now() + 45 * 60 * 60 * 1000),
    };
    console.log('registerInput', registerInput);

    try {
      const createResult = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'Register',
        args: registerInput,
      });
      console.log('create', createResult);
      const projectRegisteredInfo = getLog(createResult.Logs, 'ProjectRegistered');
      console.log('projectRegisteredInfo', projectRegisteredInfo);
      console.log('projectId', projectRegisteredInfo.ProjectRegistered.projectId);
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
      const result = await request.project.getProjectList({
        params: { chainId: DEFAULT_CHAIN_ID, types: '3' },
      });
      console.log('getList', result);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    const { remove } = myEvents.AuthToken.addListener(() => {
      console.log('login success');
    });
    return () => {
      remove();
    };
  }, []);

  const onLogin = useCallback(() => {
    console.log('onLogin');
  }, []);
  useWebLoginEvent(WebLoginEvents.LOGINED, onLogin);

  const onLogout = useCallback(() => {
    console.log('onLogout');
  }, []);
  useWebLoginEvent(WebLoginEvents.LOGOUT, onLogout);

  const checkSync = useCallback(async () => {
    const isManagerSynced = await checkManagerSyncState();
    console.log('isManagerSynced', isManagerSynced);
  }, [checkManagerSyncState]);

  const getDetail = useCallback(async () => {
    try {
      const result = await request.project.getProjectList({
        params: {
          chainId: DEFAULT_CHAIN_ID,
          projectId,
        },
      });

      const detail = result?.data?.detail;
      const creator = detail?.creator;
      const isCreator = creator === wallet?.walletInfo.address;

      console.log('isCreator', isCreator);
      console.log('api detail', detail);

      const ewellContract = await getEwellContract();
      const projectInfo = await ewellContract.GetProjectInfo.call(projectId);
      console.log('contract detail', projectInfo);
    } catch (error) {
      console.log('getDetail error', error);
    }
  }, [getEwellContract, projectId, wallet?.walletInfo.address]);

  const invest = useCallback(async () => {
    const investAmount = '10000000';

    try {
      const approveResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
        methodName: 'Approve',
        args: {
          spender: NETWORK_CONFIG.ewellContractAddress,
          symbol: 'ELF',
          amount: investAmount,
        },
      });
      console.log('approveResult', approveResult);
    } catch (error) {
      console.log('error', error);
    }

    const times = 1;
    for (let i = 0; i < times; i++) {
      try {
        const investResult = await wallet?.callContract<any, any>({
          contractAddress: NETWORK_CONFIG.ewellContractAddress,
          methodName: 'Invest',
          args: {
            projectId,
            currency: 'ELF',
            investAmount: ZERO.plus(investAmount).div(times).toFixed(),
          },
        });
        console.log('investResult', investResult);
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [projectId, wallet]);

  const getMockLog = useCallback(async () => {
    const projectRegisteredLog = getLog(mockCreateResult.Logs, 'ProjectRegistered');
    console.log('projectRegisteredLog', projectRegisteredLog);
  }, []);

  const getTokenList = useCallback(async () => {
    try {
      const result = await request.project.getTokenList({
        params: { chainId: DEFAULT_CHAIN_ID },
      });
      console.log('getTokenList', result);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  const getProjectUserList = useCallback(async () => {
    try {
      const result = await request.project.getProjectUserList({
        params: { chainId: DEFAULT_CHAIN_ID, projectId: projectId },
      });
      console.log('getProjectUserList', result);
    } catch (error) {
      console.log('error', error);
    }
  }, [projectId]);

  const openWhite = useCallback(async () => {
    try {
      const ewellContract = await getEwellContract();
      const whitelistId = await ewellContract.GetWhitelistId.call(projectId);
      console.log('whitelistId', whitelistId);

      const txResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName: 'EnableWhitelist',
        // methodName: 'DisableWhitelist',
        args: whitelistId,
      });
      console.log('txResult', txResult);
    } catch (error) {
      console.log('openWhite', error);
    }
  }, [getEwellContract, projectId, wallet]);

  const getWhite = useCallback(async () => {
    try {
      const ewellContract = await getEwellContract();
      const whitelistId = await ewellContract.GetWhitelistId.call(projectId);
      console.log('whitelistId', whitelistId);
      const whitelistContract = await getWhitelistContract();
      const whitelistDetail = await whitelistContract.GetWhitelist.call(whitelistId);
      console.log('whitelistDetail', whitelistDetail);
    } catch (error) {
      console.log('getWhite', error);
    }
  }, [getEwellContract, getWhitelistContract, projectId]);

  const updateAddition = useCallback(async () => {
    try {
      const result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'UpdateAdditionalInfo',
        args: {
          projectId: projectId,
          additionalInfo: {
            data: {
              name: `testName${Date.now()}`,
              value: `testValue${Date.now()}`,
            },
          },
        },
      });
      console.log('updateAddition result', result);
    } catch (error) {
      console.log('updateAddition error', error);
    }
  }, [projectId, wallet]);

  const onUploadChange = useCallback(
    async (e: any) => {
      try {
        const addressList = await updateFile(e);
        const originList = ['ELF_2R7QtJp7e1qUcfh2RYYJzti9tKpPheNoAGD7dTVFd4m9NaCh27_tDVV'];
        const fileResult = identifyWhitelistData({
          originData: originList,
          identifyData: addressList,
          type: UpdateType.REMOVE,
        });
        console.log('fileResult', fileResult);
      } catch (error) {
        console.log('file error', error);
      }
    },
    [updateFile],
  );

  const addWhitelist = useCallback(async () => {
    const ewellContract = await getEwellContract();
    const whitelistId = await ewellContract.GetWhitelistId.call(projectId);
    const txResult = await wallet?.callContract({
      contractAddress: NETWORK_CONFIG.whitelistContractAddress,
      methodName: 'AddAddressInfoListToWhitelist',
      args: {
        whitelistId,
        extraInfoIdList: {
          value: [
            {
              addressList: {
                value: ['ELF_2R7QtJp7e1qUcfh2RYYJzti9tKpPheNoAGD7dTVFd4m9NaCh27_tDVV', ...walletAddressList],
              },
            },
          ],
        },
      },
    });
    console.log('txResult', txResult);
  }, [getEwellContract, projectId, wallet]);

  const getWhitelistDetail = useCallback(async () => {
    const ewellContract = await getEwellContract();
    const whitelistId = await ewellContract.GetWhitelistId.call(projectId);
    console.log('whitelistId', whitelistId);
    const whitelistContract = await getWhitelistContract();
    const whitelistDetail = await whitelistContract.GetWhitelistDetail.call(whitelistId);
    console.log('getWhitelistDetail ', whitelistDetail);
  }, [getEwellContract, getWhitelistContract, projectId]);

  return (
    <div>
      <Web3Button
        onClick={() => {
          console.log('jump');
        }}>
        Launch with EWELL
      </Web3Button>
      <Input
        value={projectId}
        onChange={(e) => {
          setProjectId(e.target.value);
        }}></Input>
      <div>
        <Button
          onClick={() => {
            preCreate();
          }}>
          preCreate
        </Button>
        <Button onClick={create}>create</Button>
        <Button onClick={getList}>getList</Button>
        <Button onClick={getDetail}>getDetail</Button>
        <Button onClick={invest}>invest</Button>
        <Button onClick={openWhite}>openWhite</Button>
        <Button onClick={getWhite}>getWhite</Button>
        <Button onClick={updateAddition}>updateAddition</Button>
      </div>
      <div>
        <Button onClick={transfer}>transfer</Button>
        <Button onClick={checkSync}>checkSync</Button>
        <Button type="primary" onClick={getBalance}>
          balance
        </Button>
        <Button type="primary" onClick={getMockLog}>
          getMockLog
        </Button>
        <Button type="primary" onClick={getTokenList}>
          getTokenList
        </Button>
        <Button type="primary" onClick={getProjectUserList}>
          getProjectUserList
        </Button>
      </div>
      <div>
        <Button onClick={addWhitelist}>addWhitelist</Button>
        <Button onClick={getWhitelistDetail}>getWhitelistDetail</Button>
      </div>
      <div>
        <Dragger
          accept=".xlsx,.csv"
          onRemove={() => {
            console.log('onRemove');
            // setExcelData([]);
          }}
          beforeUpload={(e) => {
            onUploadChange(e);
          }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>

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
    </div>
  );
}
