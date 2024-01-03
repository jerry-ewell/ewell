import { request } from 'api';
import { useActiveWeb3React } from 'hooks/web3';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectInfo } from '.';
import { ProjectItemExt } from './actions';
import { getProjectProgress } from './utils';

export function useProjectInfoDispatch() {
  const [, { dispatch }] = useProjectInfo();
  return useCallback(dispatch, [dispatch]);
}

export function useProjectInfoByFetch(timeStamp?: number) {
  const { projectId } = useParams();
  const [info, setInfo] = useState<ProjectItemExt>();
  const { apiChainId } = useActiveWeb3React();
  const getProjectInfo = useCallback(async () => {
    if (!projectId) return;
    // TODO
    const res = await request.project.list({
      params: {
        chainId: apiChainId,
        hash: projectId,
        skipCount: 0,
        maxResultCount: 99,
      },
    });
    console.log(projectId, !res?.items?.[0], 'projectId===');
    if (!res || res?.error || !res?.items?.[0]) return;
    const info = res?.items?.[0];
    const infoExt = {
      ...info,
      progressRate: getProjectProgress(info?.startTime, info?.endTime, info?.isCanceled),
    };
    setInfo(infoExt);
  }, [apiChainId, projectId]);

  useEffect(() => {
    getProjectInfo();
  }, [getProjectInfo, timeStamp]);

  return info;
}
