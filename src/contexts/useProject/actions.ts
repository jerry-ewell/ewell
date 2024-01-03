import { basicActions } from 'contexts/utils';
import { ProjectItem } from 'types/project';

const ProjectActions = {
  setProjectList: 'setProjectList',
  getProjectList: 'getProjectList',
  setProjectMap: 'setProjectMap',
  setList: 'setList',
  destroy: 'DESTROY',
};

export type dacState = {
  projectList: ProjectItem[];
  projectMap: { [projectId: string]: ProjectItem };
  projectListTotal?: number;
};
export const basicProjectView = {
  setList: {
    type: ProjectActions['setList'],
    actions: (k: any, list: any, total?: number, skipCount?: number, isUpdate?: boolean) =>
      basicActions(ProjectActions['setList'], {
        list,
        total,
        skipCount,
        isUpdate,
        k,
      }),
  },
  setProjectList: {
    type: ProjectActions['setProjectList'],
    actions: (projectList: any[], projectListTotal?: number, isAdd?: boolean) =>
      basicActions(ProjectActions['setProjectList'], {
        projectList,
        projectListTotal,
        isAdd,
      }),
  },
  setProjectMap: {
    type: ProjectActions['setProjectMap'],
    actions: (project: any) =>
      basicActions(ProjectActions['setProjectMap'], {
        project,
      }),
  },
  destroy: {
    type: ProjectActions['destroy'],
    actions: () => basicActions(ProjectActions['destroy']),
  },
};
