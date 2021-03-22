import React, { PropsWithChildren } from 'react';
import './styles.scss';
import { Card } from 'primereact/card';

interface Props {
  backgroundColor: string;
  value: string;
  legend: string
  image: string;
}

const DashboardCard: React.FC<Props> = ({
  image, legend, value, backgroundColor,
}) => (
  <Card className="dashboard-card" style={{ background: backgroundColor }}>
    <div className="card-content-wrapper">
      <div className="card-texts">
        <div className="value">{value}</div>
        <div className="legend">{legend}</div>
      </div>
      <img className="card-img" src={image} alt="Courses done" />
    </div>
  </Card>
);

export default DashboardCard;
