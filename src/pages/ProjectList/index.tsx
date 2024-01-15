import React from 'react';
import Prjects from './components/Projects';
import MyProjects from './components/MyProjects';
import './styles.less';

const ProjectList: React.FC = () => {
  return (
    <div className="common-page-1360 project-list">
      {/* <Prjects /> */}
      <MyProjects />
    </div>
  );
};

export default ProjectList;
