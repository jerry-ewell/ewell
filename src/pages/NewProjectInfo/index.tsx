import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { request } from 'api';
import ActionCard from './components/ActionCard';
import InfoWrapper from './components/InfoWrapper';
import { useMobile } from 'contexts/useStore/hooks';
import { useWallet } from 'contexts/useWallet/hooks';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { IProjectInfo } from 'types/project';
import { mockDetail, mockWhitelistInfo } from './mock';
import './styles.less';

interface IProjectInfoProps {
  previewData?: IProjectInfo;
}

export default function ProjectInfo({ previewData }: IProjectInfoProps) {
  const isMobile = useMobile();
  const { wallet } = useWallet();
  const { projectId } = useParams();
  const { getWhitelistContract } = useViewContract();

  const [projectInfo, setProjectInfo] = useState<IProjectInfo>({});

  const getProjectInfo = useCallback(async () => {
    try {
      // const result = await request.project.getProjectList({
      //   params: {
      //     chainId: DEFAULT_CHAIN_ID,
      //     projectId,
      //   },
      // });

      // const detail = result?.data?.detail;
      // const creator = detail?.creator;
      // const isCreator = creator === wallet?.walletInfo.address;
      // const whitelistId = detail?.whitelistId;

      // console.log('isCreator', isCreator);
      // console.log('api detail', detail);
      // const whitelistContract = await getWhitelistContract();
      // const whitelistInfo = await whitelistContract.GetWhitelist.call(whitelistId);

      // console.log('whitelistInfo', whitelistInfo);
      const newProjectInfo = {
        ...mockDetail,
        additionalInfo: JSON.parse(mockDetail.additionalInfo),
        listMarketInfo: JSON.parse(mockDetail.listMarketInfo),
        isCreator: true,
        whitelistInfo: mockWhitelistInfo,
      };
      setProjectInfo(newProjectInfo);
    } catch (error) {
      console.log('getDetail error', error);
    }
  }, [getWhitelistContract, projectId, wallet?.walletInfo.address]);

  useEffect(() => {
    if (!previewData) {
      getProjectInfo();
    }
  }, [previewData, getProjectInfo]);

  return (
    <div className="common-page-1360 min-height-container project-info-wrapper">
      <div className="flex project-info-content">
        <InfoWrapper projectInfo={previewData || projectInfo} />
        {!isMobile && <ActionCard projectInfo={previewData || projectInfo} />}
      </div>
    </div>
  );
}
