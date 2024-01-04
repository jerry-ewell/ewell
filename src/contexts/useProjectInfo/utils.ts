import dayjs from 'dayjs';
import { PROGRESS_RATE } from 'types/project';

export const progressText = {
  [PROGRESS_RATE.comingSoon]: 'Upcoming',
  [PROGRESS_RATE.onGoing]: 'On-going',
  [PROGRESS_RATE.over]: 'Ended',
  [PROGRESS_RATE.cancelled]: 'Cancelled',
};

export const getProjectProgress = (startTime = 0, endTime = Infinity, isCancel = false) => {
  const nowTime = dayjs().unix();
  if (isCancel) return PROGRESS_RATE.cancelled;
  if (!startTime) return PROGRESS_RATE.comingSoon;
  if (nowTime >= +endTime) return PROGRESS_RATE.over;
  if (nowTime >= +startTime) return PROGRESS_RATE.onGoing;
  if (nowTime < +startTime) return PROGRESS_RATE.comingSoon;
  return PROGRESS_RATE.comingSoon;
};
