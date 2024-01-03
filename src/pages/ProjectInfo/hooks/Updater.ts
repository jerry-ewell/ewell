import { useUpdateWhiteListConfig } from 'components/WhitelistService';
import { useProjectById } from 'contexts/useProject/hooks';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { basicProjectInfoView, ProjectItemExt } from 'contexts/useProjectInfo/actions';
import { useProjectInfoByFetch, useProjectInfoDispatch } from 'contexts/useProjectInfo/hooks';
import { useProjectInfoByContract } from 'contexts/useProjectInfo/useProjectInfoByContract';
import { getProjectProgress } from 'contexts/useProjectInfo/utils';
import { useWhiteListContract } from 'hooks/useContract';
import { useActiveWeb3React } from 'hooks/web3';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

export const ProjectInfoUpdater = () => {
  const { projectId } = useParams();
  const dispatch = useProjectInfoDispatch();
  const { account } = useActiveWeb3React();
  const whiteListContract = useWhiteListContract();
  const [{ refresh, idoContract }] = useProjectInfo();
  const [project, setProject] = useState<any>();

  const projectByList = useProjectById(projectId ?? '');

  useEffect(() => {
    if (!projectByList) return;
    const infoExt = {
      ...projectByList,
      progressRate: getProjectProgress(projectByList?.startTime, projectByList?.endTime, projectByList?.isCanceled),
    };
    setProject(infoExt);
  }, [dispatch, projectByList]);

  const info = useProjectInfoByFetch(refresh);

  useEffect(() => {
    info && setProject(info);
  }, [dispatch, info]);

  const projectInfo = useProjectInfoByContract(idoContract, refresh);

  const idoInfo: any = useMemo(() => {
    const info: ProjectItemExt | undefined = project;
    return {
      ...(info ?? {}),
      creator: projectInfo?.projectInfo?.creator ?? info?.creator,
      crowdFundingIssueAmount: projectInfo?.projectInfo?.crowdFundingIssueAmount ?? info?.crowdFundingIssueAmount,
      crowdFundingType: projectInfo?.projectInfo?.crowdFundingType ?? info?.crowdFundingType,
      additionalInfo: projectInfo?.projectInfo?.additionalInfo?.data ?? info?.additionalInfo,
      projectId: projectInfo?.projectInfo?.projectId ?? info?.hash,
      progressRate: projectInfo?.projectInfo?.progressRate ?? info?.progressRate,
      toRaiseToken: {
        ...(info?.toRaiseToken ?? {}),
        symbol: projectInfo?.projectInfo?.acceptedCurrency ?? info?.toRaiseToken?.symbol,
      },
      startTime: projectInfo?.projectInfo?.startTime?.seconds ?? info?.startTime,
      endTime: projectInfo?.projectInfo?.endTime?.seconds ?? info?.endTime,
      maxSubscription: projectInfo?.projectInfo?.maxSubscription ?? info?.maxSubscription,
      minSubscription: projectInfo?.projectInfo?.minSubscription ?? info?.minSubscription,

      preSalePrice: projectInfo?.projectInfo?.preSalePrice ?? info?.preSalePrice,
      publicSalePrice: projectInfo?.listingInfo?.publicSalePrice ?? info?.publicSalePrice,
      crowdFundingIssueToken: {
        ...(info?.crowdFundingIssueToken ?? {}),
        symbol: projectInfo?.projectInfo?.projectCurrency ?? info?.crowdFundingIssueToken?.symbol,
      },
      isCanceled: projectInfo?.projectInfo ? !projectInfo?.projectInfo?.enabled : info?.isCanceled,
      userInvest: projectInfo?.userInvest,
      userProfit: projectInfo?.userProfit,
      listingInfo: projectInfo?.listingInfo,
      currentRaisedAmount: projectInfo?.projectInfo?.currentRaisedAmount ?? info?.currentRaisedAmount,
      // toRaisedAmount: projectInfo?.projectInfo?.toRaisedAmount ?? info?.toRaisedAmount,
    };
  }, [project, projectInfo]);

  useUpdateEffect(() => {
    dispatch(basicProjectInfoView.updateProjectInfo.actions(idoInfo));
  }, [idoInfo]);

  useUpdateWhiteListConfig({
    whitelistId: idoInfo?.whitelistId, // idoInfo?.whitelistId, // idoInfo
    account: account ?? undefined,
    contract: whiteListContract,
  });

  return null;
};
