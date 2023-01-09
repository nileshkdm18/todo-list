import http from './http-common';
import ITaskData from '../types/task.type';

class TaskDataService {
  /**
   * fetch all task
   * @returns {Array<ITaskData>} list of tasks
   */
  getAll() {
    return http.get<Array<ITaskData>>('/tasks');
  }

  // commenting because not in use
  // get specific task
  // get(id: string) {
  //   return http.get<ITaskData>(`/tasks/${id}`);
  // }

  /**
   * create new task
   * @param data content
   * @returns {ITaskData} created task
   */
  create(data: ITaskData) {
    return http.post<ITaskData>('/tasks', data);
  }

  /**
   * mark task complete or pending
   * @param id task id
   * @param data content
   * @returns {ITaskData} updated task
   */
  update(id: string, data: ITaskData | object) {
    return http.patch<ITaskData>(`/tasks/${id}`, data);
  }

  /**
   * delete task
   * @param id task id
   * @returns {string} success message
   */
  delete(id: string) {
    return http.delete<string>(`/tasks/${id}`);
  }

  // commenting because not in use
  // deleteAll() {
  //   return http.get<ITaskData>('/tasks');
  // }
}

export default new TaskDataService();
