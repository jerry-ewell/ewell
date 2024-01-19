import { Flex } from 'antd';
import { Typography, FontWeightEnum, Carousel } from 'aelf-design';
import ProjectLogo from 'components/ProjectLogo';
import ProjectTabs from '../ProjectTabs';
import communityLogo from 'assets/images/communityLogo';
import { image1, image2, image3 } from 'assets/images/test';
import './styles.less';

const { Title, Text } = Typography;

export default function InfoWrapper() {
  return (
    <div className="project-info-wrapper flex flex-1">
      <ProjectLogo src="" alt="logo" />
      <div className="info-wrapper flex-1 flex-column">
        <div className="info-header flex-column">
          <Title level={5} fontWeight={FontWeightEnum.Medium}>
            Citizen Conflict
          </Title>
          <Flex gap={12} align="center">
            {Object.entries({
              x: 'https://www.google.com',
              medium: 'https://www.google.com',
              telegram: 'https://www.google.com',
            }).map(([key, value], index) => (
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
          <Text>
            The mobile game immerses players in a metaverse that bridges the virtual and physical worlds, DEFY fuses
            hyper casual code-breaking gameplay, with real world exploration and Augmented Reality (AR) adventures.
          </Text>
        </div>
        <Carousel
          className="carousel"
          data={[
            {
              id: '1',
              url: image1,
            },
            {
              id: '2',
              url: image2,
            },
            {
              id: '3',
              url: image3,
            },
          ]}
        />
        <ProjectTabs />
      </div>
    </div>
  );
}
