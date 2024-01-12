import React from 'react';
import { Flex, Row, Col } from 'antd';
import PorjectCard from '../Card';

const Projects: React.FC = () => {
  return (
    <div className="project-page">
      <div className="project-type">Active Projects</div>
      {/* <Flex wrap="wrap">
        <PorjectCard />
        <PorjectCard />
        <PorjectCard />
        <PorjectCard />
      </Flex> */}
      <Row gutter={[24, 24]}>
        <Col xl={6} xxl={6} lg={8} md={8} sm={12} xs={24}>
          <PorjectCard />
        </Col>
        <Col xl={6} xxl={6} lg={8} md={8} sm={12} xs={24}>
          <PorjectCard />
        </Col>
        <Col xl={6} xxl={6} lg={8} md={8} sm={12} xs={24}>
          <PorjectCard />
        </Col>
        <Col xl={6} xxl={6} lg={8} md={8} sm={12} xs={24}>
          <PorjectCard />
        </Col>
      </Row>
    </div>
  );
};

export default Projects;
