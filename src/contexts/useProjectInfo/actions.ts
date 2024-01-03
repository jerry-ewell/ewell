import { basicActions } from 'contexts/utils';
import { PROGRESS_RATE, ProjectItem } from 'types/project';
import { ContractBasic } from 'utils/contract';
import { InvestDetail, ProfitDetail, ProjectListInfo, UserProjectInfo } from './useProjectInfoByContract';

const ProjectInfoActions = {
  destroy: 'DESTROY',
  updateProjectInfo: 'UPDATE_PROJECT_INFO',
  updateRefresh: 'UPDATE_REFRESH',
};

export interface ProjectItemExt extends ProjectItem {
  progressRate?: PROGRESS_RATE;
  projectId?: string;
  userInvest?: InvestDetail;
  userProfit?: ProfitDetail;
  listingInfo?: ProjectListInfo;
}

export type ProjectInfoState = {
  idoInfo?: ProjectItemExt;
  refresh?: number;
  idoContract: ContractBasic | null;
  projectInfo?: UserProjectInfo;
};
export const basicProjectInfoView = {
  updateProjectInfo: {
    type: ProjectInfoActions.updateProjectInfo,
    actions: (info: ProjectItemExt) => basicActions(ProjectInfoActions.updateProjectInfo, info),
  },
  updateRefresh: {
    type: ProjectInfoActions.updateRefresh,
    actions: () => basicActions(ProjectInfoActions.updateRefresh),
  },
  destroy: {
    type: ProjectInfoActions['destroy'],
    actions: () => basicActions(ProjectInfoActions['destroy']),
  },
};
