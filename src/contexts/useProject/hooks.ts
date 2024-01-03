import { useMemo } from 'react';
import { useProject } from '.';

export function useProjectById(id: string) {
  const [{ projectList, projectMap }] = useProject();
  return useMemo(() => {
    const projectFromList = projectList?.find((item) => item.hash === id);
    const projectFromMap = projectMap?.[id];
    if ((projectFromMap?.lastModificationTime ?? 0) > (projectFromList?.lastModificationTime ?? 0))
      return projectFromMap;

    return projectFromList || projectFromMap;
  }, [projectList, projectMap, id]);
}
