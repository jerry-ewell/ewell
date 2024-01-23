import React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { request } from 'api';
import { Flex, message } from 'antd';
import { Typography } from 'aelf-design';
import ActionCard from './components/ActionCard';
import InfoWrapper from './components/InfoWrapper';
import { useMobile } from 'contexts/useStore/hooks';
import { useWallet } from 'contexts/useWallet/hooks';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { IProjectInfo } from 'types/project';
import myEvents from 'utils/myEvent';
import { mockDetail, mockWhitelistInfo, mockPreviewData } from './mock';
import { emitLoading } from 'utils/events';
import { tableEmpty } from 'assets/images';
import './styles.less';

interface IProjectInfoProps {
  previewData?: IProjectInfo;
  style?: React.CSSProperties;
}

const { Text } = Typography;

export default function ProjectInfo({ previewData, style }: IProjectInfoProps) {
  const isMobile = useMobile();
  const { wallet } = useWallet();
  const { projectId } = useParams();
  const { getWhitelistContract } = useViewContract();
  const isPreview = useMemo(() => !!previewData, [previewData]);
  const [messageApi, contextHolder] = message.useMessage();

  const [projectInfo, setProjectInfo] = useState<IProjectInfo>({});

  const addressRef = useRef<string>();
  addressRef.current = wallet?.walletInfo.address;

  const getProjectInfo = useCallback(async () => {
    emitLoading(true);
    try {
      const result = await request.project.getProjectList({
        params: {
          chainId: DEFAULT_CHAIN_ID,
          projectId,
        },
      });

      const detail = result?.data?.detail;
      console.log('detail: ', detail);
      const creator = detail?.creator;
      const isCreator = creator === addressRef.current;
      const whitelistId = detail?.whitelistId;

      console.log('isCreator', isCreator);
      let whitelistInfo;
      if (whitelistId) {
        const whitelistContract = await getWhitelistContract();
        whitelistInfo = await whitelistContract.GetWhitelist.call(whitelistId);
      }

      console.log('whitelistInfo', whitelistInfo);
      let newProjectInfo = {};
      if (detail) {
        newProjectInfo = {
          ...detail,
          additionalInfo: detail?.additionalInfo ? JSON.parse(detail.additionalInfo) : {},
          listMarketInfo: detail?.listMarketInfo ? JSON.parse(detail.listMarketInfo) : [],
          whitelistInfo,
          isCreator,
          isInWhitelist: whitelistInfo?.extraInfoIdList?.value?.[0]?.addressList?.value?.includes(addressRef.current),
        };
      }
      console.log('newProjectInfo: ', newProjectInfo);
      setProjectInfo(newProjectInfo);
    } catch (error: any) {
      console.log('getDetail error', error);
      messageApi.open({
        type: 'error',
        content: error?.message || 'Get detail failed',
      });
    } finally {
      emitLoading(false);
    }
  }, [getWhitelistContract, messageApi, projectId]);

  useEffect(() => {
    if (isPreview) {
      return;
    }
    getProjectInfo();
    const { remove } = myEvents.AuthToken.addListener(() => {
      console.log('login success');
      getProjectInfo();
    });
    return () => {
      remove();
    };
  }, [isPreview, getProjectInfo]);

  const info = useMemo(() => previewData || projectInfo, [previewData, projectInfo]);

  const showInfo = useMemo(() => !!Object.keys(info).length, [info]);

  return (
    <>
      {contextHolder}
      <div className="common-page-1360 min-height-container project-info-wrapper" style={style}>
        {showInfo ? (
          <div className="flex project-info-content">
            <InfoWrapper projectInfo={info} />
            {!isMobile && <ActionCard projectInfo={info} isPreview={isPreview} handleRefresh={getProjectInfo} />}
          </div>
        ) : (
          // TODO: adjust ui
          <Flex className="min-height-container" vertical justify="center" align="center" gap={16}>
            <img src={tableEmpty} alt="empty" />
            <Text>Empty</Text>
          </Flex>
        )}
      </div>
    </>
  );
}
