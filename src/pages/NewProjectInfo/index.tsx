import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { request } from 'api';
import ActionCard from './components/ActionCard';
import InfoWrapper from './components/InfoWrapper';
import { useMobile } from 'contexts/useStore/hooks';
import { useWallet } from 'contexts/useWallet/hooks';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { IProjectInfo } from 'types/project';
import myEvents from 'utils/myEvent';
import { mockDetail, mockWhitelistInfo, mockPreviewData } from './mock';
import './styles.less';

interface IProjectInfoProps {
  previewData?: IProjectInfo;
}

export default function ProjectInfo({ previewData }: IProjectInfoProps) {
  const isMobile = useMobile();
  const { wallet } = useWallet();
  const { projectId } = useParams();
  const { getWhitelistContract } = useViewContract();
  const isPreview = useMemo(() => !!previewData, [previewData]);

  const [projectInfo, setProjectInfo] = useState<IProjectInfo>({});

  const addressRef = useRef<string>();
  addressRef.current = wallet?.walletInfo.address;

  const getProjectInfo = useCallback(async () => {
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
      const whitelistContract = await getWhitelistContract();
      const whitelistInfo = await whitelistContract.GetWhitelist.call(whitelistId);

      console.log('whitelistInfo', whitelistInfo);
      const newProjectInfo = {
        ...detail,
        additionalInfo: JSON.parse(detail.additionalInfo),
        listMarketInfo: JSON.parse(detail.listMarketInfo),
        whitelistInfo,
        isCreator,
        isInWhitelist: whitelistInfo?.extraInfoIdList?.value?.[0]?.addressList?.value?.includes(addressRef.current),
      };
      console.log('newProjectInfo: ', newProjectInfo);
      setProjectInfo(newProjectInfo);
    } catch (error) {
      console.log('getDetail error', error);
    }
  }, [getWhitelistContract, projectId]);

  useEffect(() => {
    if (isPreview) {
      return;
    }
    if (!addressRef.current) {
      getProjectInfo();
    }
    const { remove } = myEvents.AuthToken.addListener(() => {
      console.log('login success');
      getProjectInfo();
    });
    return () => {
      remove();
    };
  }, [isPreview, getProjectInfo]);

  return (
    <div className="common-page-1360 min-height-container project-info-wrapper">
      <div className="flex project-info-content">
        <InfoWrapper projectInfo={previewData || projectInfo} />
        {!isMobile && <ActionCard projectInfo={previewData || projectInfo} isPreview={isPreview} />}
      </div>
    </div>
  );
}
