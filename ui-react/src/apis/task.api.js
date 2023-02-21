import axios from 'axios';
import getApiHost from './host';

const host = getApiHost();

export function getTasks() {
  const url = `${host}/api/tasks`;
  return axios.get(url).then(resp => resp.data);
}

export function addTask(payload) {
  const url = `${host}/api/tasks`;
  return axios.post(url, payload).then(resp => resp.data);
}

export function updateTask(id, payload) {
  const url = `${host}/api/tasks/${id}`;
  return axios.patch(url, payload).then(resp => resp.data);
}

export function deleteTask(id) {
  const url = `${host}/api/tasks/${id}`;
  return axios.delete(url).then(resp => resp.data);
}
