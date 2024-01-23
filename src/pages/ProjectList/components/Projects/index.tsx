import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col } from 'antd';
import { useEffectOnce } from 'react-use';
import { useCardCol } from '../../hooks/useCardCol';
import PorjectCard from '../Card';
import Empty from 'components/Empty';
import { useGetList, IListData } from '../../hooks/useGetList';
import { ProjecType } from 'types/project';
import InfiniteList from 'components/InfiniteList';
import { emitLoading } from 'utils/events';

const Projects: React.FC = () => {
  // const [colNum] = useCardCol();
  const colNum = 3;
  const [activeItems, setActiveItems] = useState<IListData['activeItems']>([]);
  const [closedItems, setClosedItems] = useState<IListData['closedItems']>([]);
  const [closedListPage, setClosedListPage] = useState(0);
  const [loadAllClosedItems, setLoadAllClosedItems] = useState(false);
  const { getList } = useGetList();

  const getActiveProjects = useCallback(async () => {
    const { activeItems } = await getList({ types: ProjecType.ACTIVE });
    setActiveItems(activeItems || []);
  }, [getList]);

  const getClosedProject = useCallback(
    async (loading: boolean = false) => {
      console.log('getClosed-project');
      if (loading) emitLoading(true, { text: 'loading...' });

      const list = await getList({
        types: ProjecType.CLOSED,
        skipCount: closedListPage,
        maxResultCount: colNum * 3,
        // maxResultCount: 3,
      });

      if (loading) emitLoading(false);

      if (list.closedItems.length === 0) return;
      const newList = closedItems.concat(list.closedItems);
      setClosedItems(newList);
      setClosedListPage(closedListPage + 1);
      setLoadAllClosedItems(newList.length >= list.totalCount);
    },
    [closedItems, closedListPage, colNum, getList],
  );

  useEffectOnce(() => {
    getActiveProjects();
    getClosedProject();
  });

  const render = useMemo(() => {
    if (!activeItems.length && !closedItems.length) {
      return (
        <>
          <div className="project-type">All Projects</div>
          <Empty className="empty-full" text="There are currently no projects, please stay tuned" />
        </>
      );
    }

    return (
      <>
        <div className="project-type">Active Projects</div>
        {/* <Row gutter={[24, 24]}>
          {Array.from({ length: 50 }).map((item, index) => (
            <Col span={24 / colNum} key={`${index}`}>
              <PorjectCard data={{}} />
            </Col>
          ))}
        </Row> */}
        {activeItems.length ? (
          <Row gutter={[24, 24]}>
            {activeItems.map((item, index) => (
              <Col span={24 / colNum} key={`${index}-${item.id}`}>
                <PorjectCard data={item} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty text="There are currently no active projects, please stay tuned" />
        )}

        {/* <InfiniteList
          showScrollToTop={false}
          loaded={loadAllClosedItems}
          loadMoreData={getClosedProject}
          id="project-list-scroll"
          dataLength={closedItems.length}>
          {!!closedItems.length && <div className="project-type">Closed Projects</div>}
          <Row gutter={[24, 24]}>
            {closedItems.map((item) => (
              <Col span={24 / colNum} key={item.id}>
                <PorjectCard data={item} />
              </Col>
            ))}
          </Row>
        </InfiniteList> */}
      </>
    );
  }, [activeItems, closedItems, colNum]);

  return (
    <div className="project-page" id="project-list-scroll">
      {render}
    </div>
  );
};

export default Projects;
