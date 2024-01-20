import React from 'react';
import Projects from './components/Projects';
import MyProjects from './components/MyProjects';
import { useParams } from 'react-router-dom';
import './styles.less';

const ProjectList: React.FC = () => {
  const { type } = useParams();
  console.log('useparams', type);
  return <div className="common-page-1360 project-list">{type === 'my' ? <MyProjects /> : <Projects />}</div>;
};

export default ProjectList;
