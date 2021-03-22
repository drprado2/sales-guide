import axios from 'axios';
import * as Envs from './envs';

export default axios.create({
  baseURL: Envs.getApiRoute(),
});
