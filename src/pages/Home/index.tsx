import './styles.less';
import icon from './images/home-icon.png';
import { Button, Row } from 'antd';
import { NavLink } from 'react-router-dom';
export default function Home() {
  return (
    <div className="home">
      <div className="home-body common-page">
        <div className="home-card">
          <h1>EWELL IDO</h1>
          <p>Dedicated to facilitating DApps' fundraising</p>
          <Row className="home-button-row">
            <Button type="primary">
              <NavLink to="/project-list">Projects</NavLink>
            </Button>
            <Button ghost>
              <NavLink to="/create-project">Create</NavLink>
            </Button>
          </Row>
        </div>
        <img src={icon} alt="icon" />
      </div>
    </div>
  );
}
