import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GrainIcon from '@material-ui/icons/Grain';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store';
import './styles.scss';

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    color: '#f5f5f5',
    fontWeight: 500,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

const Breadcrumb: React.FC = () => {
  const history = useHistory();

  const classes = useStyles();

  const handleClick = (event: any, path: string) => {
    event.preventDefault();
    history.push(path);
  };

  const {
    icon, title, pageImage, breadcrumbRoutes,
  } = useSelector((state: StoreState) => state.template);

  return (
    <div id="breadcrumb">
      {pageImage && <div className="icon-page" style={{ backgroundImage: `url(${pageImage})` }} />}
      <div className="title">{title}</div>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbRoutes.map((r, i) => (
          <Link color="inherit" onClick={(event: any) => handleClick(event, r.path)} className={classes.link}>
            {i === 0 && <HomeIcon className={classes.icon} />}
            {r.title}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;
