import axios from 'axios';
const host = process.env.REACT_APP_API_HOST;
export default axios.create({
  baseURL: `${host}/api`,
  headers: {
    'Content-type': 'application/json'
  }
});
