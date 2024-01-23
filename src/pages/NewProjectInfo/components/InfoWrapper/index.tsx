import { Flex } from 'antd';
import { Typography, FontWeightEnum, Carousel } from 'aelf-design';
import ProjectLogo from 'components/ProjectLogo';
import ProjectTabs from '../ProjectTabs';
import communityLogo from 'assets/images/communityLogo';
import { IProjectInfo } from 'types/project';
import './styles.less';

const { Title, Text } = Typography;

interface IInfoWrapperProps {
  projectInfo: IProjectInfo;
}

export default function InfoWrapper({ projectInfo }: IInfoWrapperProps) {
  const { additionalInfo } = projectInfo;
  const projectImgs = (additionalInfo?.projectImgs?.split(',') || []).map((item, index) => ({
    id: index,
    url: item,
  }));
  return (
    <div className="project-info-wrapper flex flex-1">
      <ProjectLogo src={additionalInfo?.logoUrl} alt="logo" />
      <div className="info-wrapper flex-1 flex-column">
        <div className="info-header flex-column">
          <Title level={5} fontWeight={FontWeightEnum.Medium}>
            {additionalInfo?.projectName || '--'}
          </Title>
          <Flex gap={12} align="center">
            {Object.entries(additionalInfo || [])
              .filter(([key]) => Object.keys(communityLogo).find((item) => item === key))
              .map(([key, value], index) => (
                <img
                  key={index}
                  className="cursor-pointer"
                  src={communityLogo[key]}
                  alt="community"
                  onClick={() => {
                    window.open(value, '_blank');
                  }}
                />
              ))}
          </Flex>
          {!!additionalInfo?.projectSummary && <Text>{additionalInfo?.projectSummary}</Text>}
        </div>
        {projectImgs.length > 0 && <Carousel className="carousel" data={projectImgs} />}
        <ProjectTabs projectInfo={projectInfo} />
      </div>
    </div>
  );
}
