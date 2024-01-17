import React, { useMemo } from 'react';
import { Row, Col } from 'antd';
import { useCardCol } from '../../hooks/useCardCol';
import PorjectCard, { IProjectCard } from '../Card';
import Empty from 'components/Empty';

interface ProjectListProps {
  createdItems?: IProjectCard[];
  participateItems?: IProjectCard[];
}

const MyProjects: React.FC<ProjectListProps> = ({ createdItems = [], participateItems = [] }) => {
  const [colNum] = useCardCol();

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
      {!!participateItems.length && (
        <>
          <div className="project-type">Participate</div>
          <Row gutter={[24, 24]}>
            {participateItems.map((item) => (
              <Col span={24 / colNum} key={item.id}>
                <PorjectCard data={item} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default MyProjects;
