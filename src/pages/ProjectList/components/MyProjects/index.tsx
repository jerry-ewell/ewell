import React, { useMemo, useState, useCallback } from 'react';
import { Row, Col } from 'antd';
import { useEffectOnce } from 'react-use';
import { useCardCol } from '../../hooks/useCardCol';
import PorjectCard, { IProjectCard } from '../Card';
import { useGetList, IListData } from '../../hooks/useGetList';
import { ProjecType } from 'types/project';
import Empty from 'components/Empty';
import { emitLoading } from 'utils/events';
import InfiniteList from 'components/InfiniteList';
interface ProjectListProps {
  createdItems?: IProjectCard[];
  participateItems?: IProjectCard[];
}

const MyProjects: React.FC<ProjectListProps> = () => {
  const [colNum] = useCardCol();
  const [createdItems, setCreatedItems] = useState<IListData['createdItems']>([]);
  const [participateItems, setParticipateItems] = useState<IListData['participateItems']>([]);
  const [participateListPageNum, setParticipateListPageNum] = useState(0);
  const [loadAllParticipateItems, setLoadAllParticipateItems] = useState(false);
  const { getList } = useGetList();

  const getCreatedProjects = useCallback(async () => {
    const { createdItems } = await getList({ types: ProjecType.CREATED });
    setCreatedItems(createdItems || []);
  }, [getList]);

  const getParticipateProject = useCallback(
    async (loading: boolean = false) => {
      if (loading) emitLoading(true, { text: 'loading...' });

      const list = await getList({
        types: ProjecType.PARTICIPATE,
        skipCount: participateListPageNum,
        maxResultCount: colNum * 3,
        // maxResultCount: 3,
      });

      if (loading) emitLoading(false);

      if (list.participateItems.length === 0) return;
      const newList = participateItems.concat(list.participateItems);
      setParticipateItems(newList);
      setParticipateListPageNum(participateListPageNum + 1);
      setLoadAllParticipateItems(newList.length >= list.totalCount);
    },
    [colNum, getList, participateItems, participateListPageNum],
  );

  useEffectOnce(() => {
    getCreatedProjects();
    getParticipateProject();
  });

  const emptyText = useMemo(() => {
    return (
      <div style={{ fontSize: 14, textAlign: 'center', padding: '0 17vw' }}>
        There are currently no projects. Take a look at
        <span style={{ color: '#863DFF', fontWeight: 500 }}> Projects</span>
      </div>
    );
  }, []);

  return (
    <div className="project-page">
      {!createdItems.length && !participateItems.length && (
        <>
          <div className="project-type"> No Projects</div>
          <Empty className="empty-full" text={emptyText} />
        </>
      )}
      {!!createdItems.length && (
        <>
          <div className="project-type">Created</div>
          <Row gutter={[24, 24]}>
            {createdItems.map((item) => (
              <Col span={24 / colNum} key={item.id}>
                <PorjectCard data={item} />
              </Col>
            ))}
          </Row>
        </>
      )}
      <InfiniteList
        showScrollToTop={false}
        loaded={loadAllParticipateItems}
        loadMoreData={getParticipateProject}
        dataLength={participateItems.length}>
        {!!participateItems.length && <div className="project-type">Participate</div>}
        <Row gutter={[24, 24]}>
          {participateItems.map((item) => (
            <Col span={24 / colNum} key={item.id}>
              <PorjectCard data={item} />
            </Col>
          ))}
        </Row>
      </InfiniteList>
    </div>
  );
};

export default MyProjects;
