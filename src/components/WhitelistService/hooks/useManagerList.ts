import { useMemo } from 'react';
import { useWhiteList } from '../context/useWhiteList';

export const useManagerList = (chainId?: number, whitelistHash?: string, projectId?: string) => {
  // const [list, setList] = useState<ManagerItem[]>();
  const [{ whitelistInfo }] = useWhiteList();
  // const fetch = useCallback(async () => {
  //   const res = await request.getManagers({
  //     params: formatObjEmpty({
  //       chainId,
  //       projectId,
  //       whitelistHash,
  //       skipCount: 0,
  //       maxResultCount: 999,
  //     }),
  //   });
  //   if (res?.error) return;
  //   if (res?.items) {
  //     setList(res?.items ?? []);
  //   }
  //   console.log(res, 'res==useManagerList=');
  // }, [chainId, projectId, whitelistHash]);

  // useEffect(() => {
  //   fetch();
  // }, [fetch]);
  console.log(chainId, whitelistHash, projectId);
  return useMemo(
    () =>
      whitelistInfo?.manager?.value?.map((man) => ({
        manager: man,
      })),
    [whitelistInfo?.manager?.value],
  );
};
