import React, { useMemo } from 'react';
import { Row, Col } from 'antd';
import { useCardCol } from '../../hooks/useCardCol';
import PorjectCard, { IProjectCard } from '../Card';
import Empty from 'components/Empty';
interface ProjectListProps {
  activeItems?: IProjectCard[];
  closedItems?: IProjectCard[];
}

const Projects: React.FC<ProjectListProps> = ({ activeItems = [], closedItems = [] }) => {
  const [colNum] = useCardCol();

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
        {activeItems.length ? (
          <Row gutter={[24, 24]}>
            {activeItems.map((item) => (
              <Col span={24 / colNum} key={item.id}>
                <PorjectCard data={item} />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty text="There are currently no active projects, please stay tuned" />
        )}
        {!!closedItems.length && (
          <>
            <div className="project-type">Closed Projects</div>
            <Row gutter={[24, 24]}>
              {closedItems.map((item) => (
                <Col span={24 / colNum} key={item.id}>
                  <PorjectCard data={item} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </>
    );
  }, [colNum, activeItems, closedItems]);
  return <div className="project-page">{render}</div>;
};

export default Projects;
