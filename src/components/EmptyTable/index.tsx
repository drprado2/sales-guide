import React, { PropsWithChildren } from 'react';
import './styles.scss';
import emptyDataImg from '../../assets/images/no-data-img.svg';

const EmptyTable: React.FC = () => (
  <div className="empty-table">
    <div className="text">Nenhum registro encontrado!</div>
    <img src={emptyDataImg} alt="Sem registros" width="160px" height="auto" />
  </div>
);

export default EmptyTable;
