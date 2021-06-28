import React, { PropsWithChildren } from 'react';
import './styles.scss';
import { Card } from 'primereact/card';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/all';

interface Props {
  backgroundColor: string;
  value: string;
  legend: string
  image: string;
  increase: number;
}

const DashboardCard: React.FC<Props> = ({
  image, legend, value, backgroundColor, increase,
}) => (
  <Card className="dashboard-card" style={{ background: backgroundColor }}>
    <div className="card-content-wrapper">
      <div className="card-texts">
        <div className="value">{value}</div>
        <div className="legend">{legend}</div>
        <div className={`increase-${increase > 0 ? 'up' : 'down'}`}>{increase}%  {increase <= 0 ? <BsFillCaretDownFill /> : <BsFillCaretUpFill />}</div>
      </div>
      <img className="card-img" src={image} alt="Courses done" />
    </div>
  </Card>
);

export default DashboardCard;
