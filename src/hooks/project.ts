import { useCallback, useEffect, useState } from 'react';
import { ProjectItem } from 'types/project';
import { unifySecond } from 'utils/time';
import { useIDOContract } from './useContract';
import { useActiveWeb3React } from './web3';

export function unifyProject(project: any) {
  const startTime = unifySecond(project.startTime);
  const endTime = unifySecond(project.endTime);
  const unlockTime = unifySecond(project.unlockTime);
  return {
    ...project,
    unlockTime,
    endTime,
    startTime,
    additionalInfo: project.additionalInfo.data,
  };
}

export function useProjectInfoByChain(hash?: string): [ProjectItem | undefined, () => void] {
  const iDOContract = useIDOContract();
  const [projectInfo, setProjectInfo] = useState<ProjectItem>();
  const getProjectInfo = useCallback(async () => {
    if (!iDOContract) return;
    const req = await iDOContract.callViewMethod('GetProjectInfo', hash);
    if (req && !req.error) {
      setProjectInfo(unifyProject(req));
    }
  }, [hash, iDOContract]);
  useEffect(() => {
    getProjectInfo();
  }, [getProjectInfo]);
  return [projectInfo, getProjectInfo];
}

export function usePendingProjectAddress() {
  const { account } = useActiveWeb3React();
  const [state, setState] = useState();
  const idoContract = useIDOContract();
  const getPendingProjectAddress = useCallback(async () => {
    if (!idoContract || !account) return;
    const req = await idoContract.callViewMethod('GetPendingProjectAddress', [account]);
    if (!req.error) setState(req);
  }, [account, idoContract]);
  useEffect(() => {
    getPendingProjectAddress();
  }, [getPendingProjectAddress]);
  return state;
}
