import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockAdapter from 'axios-mock-adapter';
import partition from 'lodash/partition';
import httpCommon from '../../../src/services/http-common';
import Todo from '../../../src/components/todo.component';
const host = process.env.REACT_APP_API_HOST;
const mock = new MockAdapter(httpCommon);
const data = [
  {
    description: 'First Task',
    completed: true,
    createdAt: '2022-12-24T17:14:32.386Z',
    updatedAt: '2022-12-24T18:49:49.685Z',
    id: 'a1'
  },
  {
    description: 'Second Task',
    completed: false,
    createdAt: '2022-12-24T18:49:46.982Z',
    updatedAt: '2022-12-24T18:49:46.982Z',
    id: 'a2'
  },
  {
    description: 'Third Task',
    completed: false,
    createdAt: '2022-12-24T18:59:24.385Z',
    updatedAt: '2022-12-24T18:59:24.385Z',
    id: 'a3'
  },
  {
    description: 'Fourth Task',
    completed: true,
    createdAt: '2022-12-24T18:59:52.842Z',
    updatedAt: '2022-12-25T10:36:24.403Z',
    id: 'a4'
  },
  {
    description: 'Fifth Task',
    completed: false,
    createdAt: '2022-12-25T10:19:59.766Z',
    updatedAt: '2022-12-25T10:19:59.766Z',
    id: 'a5'
  }
];

describe('Todo Component', () => {
  beforeEach(() => {
    mock.onGet(`${host}/api/tasks`).reply(200, data);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Renders App', async () => {
    await act(async () => render(<Todo />));
    // check task table is in DOM
    const table = await screen.findByTestId('table-tasks');
    expect(table).toBeInTheDocument();
    // check row count
    const tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // check no toaster on load
    expect(screen.queryByTestId(/toaster/i)).toBeNull();
  });

  it('Tab Change', async () => {
    await act(async () => render(<Todo />));
    const partitionedList = partition(data, 'completed');
    // click on completed task tab
    let tab = await screen.findByTestId('nav-tab-completed');
    await userEvent.click(tab);
    // check row count of task list
    let tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(partitionedList[0].length);

    // click on pending task tab
    tab = await screen.findByTestId('nav-tab-pending');
    await userEvent.click(tab);
    // check row count of task list
    tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(partitionedList[1].length);

    // click on all task tab
    tab = await screen.findByTestId('nav-tab-all');
    await userEvent.click(tab);
    // check row count of task list
    tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
  });

  it('Add Task', async () => {
    await act(async () => render(<Todo />));
    const newTask = {
      description: 'New Task',
      completed: false,
      createdAt: '2022-12-25T10:19:59.766Z',
      updatedAt: '2022-12-25T10:19:59.766Z',
      id: 'a6'
    };
    mock.onPost(`${host}/api/tasks`).reply(200, newTask);
    // check row count match to initial task list
    let tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // set description
    const description = await screen.findByTestId('text-description');
    await fireEvent.change(description, { target: { value: 'New Task' } });
    // click on Add Task Button
    const button = await screen.findByTestId('button-add-task');
    await userEvent.click(button);
    waitFor(async () => {
      // Check updated length of task table rows
      tableRows = await screen.findAllByTestId('task-row');
      expect(tableRows.length).toBe(data.length + 1);
      // check toaster
      const toaster = await screen.findByTestId('toaster');
      expect(toaster).toBeInTheDocument();
      const toasterBody = await screen.findByTestId('toaster-body');
      expect(toasterBody).toBeInTheDocument();
      expect(toasterBody.innerHTML).toBe('Task Added Successfully');
      expect(toaster).toHaveClass('bg-success');
    });
  });

  it('Add Task - Enter', async () => {
    await act(async () => render(<Todo />));
    const newTask = {
      description: 'New Task',
      completed: false,
      createdAt: '2022-12-25T10:19:59.766Z',
      updatedAt: '2022-12-25T10:19:59.766Z',
      id: 'a6'
    };
    mock.onPost(`${host}/api/tasks`).reply(200, newTask);
    // check row count match to initial task list
    let tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // set description
    const description = await screen.findByTestId('text-description');
    // Mock user typing description and then pressing `Enter` key
    await userEvent.type(description, 'New Task{enter}');
    waitFor(async () => {
      // Check updated length of task table rows
      tableRows = await screen.findAllByTestId('task-row');
      expect(tableRows.length).toBe(data.length + 1);
      // check toaster
      const toaster = await screen.findByTestId('toaster');
      expect(toaster).toBeInTheDocument();
      const toasterBody = await screen.findByTestId('toaster-body');
      expect(toasterBody).toBeInTheDocument();
      expect(toasterBody.innerHTML).toBe('Task Added Successfully');
      expect(toaster).toHaveClass('bg-success');
    });
  });

  it('Mark Task Complete', async () => {
    await act(async () => render(<Todo />));
    const taskToBeCompleted = 'a3';
    mock
      .onPatch(`${host}/api/tasks/${taskToBeCompleted}`, { completed: true })
      .reply(200, { completed: true });
    // simulate: click on check
    let checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
    await userEvent.click(checkbox);
    // Check updated row content
    checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
    expect(checkbox).toBeChecked();
    // check toaster
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Task status changed to Completed');
    expect(toaster).toHaveClass('bg-success');
  });

  it('Mark Task Un-Complete', async () => {
    const taskToBeCompleted = 'a1';
    mock
      .onPatch(`${host}/api/tasks/${taskToBeCompleted}`, { completed: false })
      .reply(200, { completed: false });
    await act(async () => render(<Todo />));
    // simulate: click on check
    let checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
    await userEvent.click(checkbox);
    // Check updated row content
    checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
    expect(checkbox).not.toBeChecked();
    // check toaster
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Task status changed to Pending');
    expect(toaster).toHaveClass('bg-success');
  });

  it('Delete Task', async () => {
    const taskToBeDeleted = 'a3';
    mock.onDelete(`${host}/api/tasks/${taskToBeDeleted}`).reply(200, { message: 'Task Deleted' });
    await act(async () => render(<Todo />));
    let tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // simulate: click on Delete Task Button
    const button = await screen.findByTestId(`button-delete-task-${taskToBeDeleted}`);
    await userEvent.click(button);
    // check modal is in DOM
    const modal = await screen.findByTestId('action-modal');
    expect(modal).toBeInTheDocument();
    //  simulate: click on Delete Button
    const buttonDelete = await screen.findByTestId('button-action');
    await userEvent.click(buttonDelete);
    // Check updated length of task table rows
    waitFor(async () => {
      tableRows = await screen.findAllByTestId('task-row');
      expect(tableRows.length).toBe(data.length - 1);
      // check toaster
      const toaster = await screen.findByTestId('toaster');
      expect(toaster).toBeInTheDocument();
      const toasterBody = await screen.findByTestId('toaster-body');
      expect(toasterBody).toBeInTheDocument();
      expect(toasterBody.innerHTML).toBe('Task Deleted Successfully');
      expect(toaster).toHaveClass('bg-success');
    });
  });

  it('API Failed: Get Tasks', async () => {
    mock.onGet(`${host}/api/tasks`).reply(400, { message: 'Network Error' });
    await act(async () => render(<Todo />));
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Network Error');
    expect(toaster).toHaveClass('bg-danger');
  });

  it('API Failed: Add Task', async () => {
    await act(async () => render(<Todo />));
    mock.onPost(`${host}/api/tasks`).reply(400, {
      message: 'Content can not be empty!'
    });
    let tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // set description
    const description = await screen.findByTestId('text-description');
    await fireEvent.change(description, { target: { value: '' } });
    // simulate: click on Add Task Button
    const button = await screen.findByTestId('button-add-task');
    await userEvent.click(button);
    // Check updated length of task table rows
    tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // check toaster
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Content can not be empty!');
    expect(toaster).toHaveClass('bg-danger');
  });

  it('API Failed: Update Task', async () => {
    await act(async () => render(<Todo />));
    const taskToBeCompleted = 'a3';
    mock
      .onPatch(`${host}/api/tasks/${taskToBeCompleted}`, { completed: true })
      .reply(400, { message: 'Content can not be empty!' });
    // simulate: click on check
    const checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
    await userEvent.click(checkbox);
    // check toaster
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Content can not be empty!');
    expect(toaster).toHaveClass('bg-danger');
  });

  it('API Failed: Delete Task', async () => {
    const taskToBeDeleted = 'a3';
    mock
      .onDelete(`${host}/api/tasks/${taskToBeDeleted}`)
      .reply(400, { message: 'Failed to delete task!' });
    await act(async () => render(<Todo />));
    const tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
    // simulate: click on Delete Task Button
    const button = await screen.findByTestId(`button-delete-task-${taskToBeDeleted}`);
    await userEvent.click(button);
    // check modal is in DOM
    const modal = await screen.findByTestId('action-modal');
    expect(modal).toBeInTheDocument();
    //  simulate: click on Delete Button
    const buttonDelete = await screen.findByTestId('button-action');
    await userEvent.click(buttonDelete);
    // check toaster
    const toaster = await screen.findByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    const toasterBody = await screen.findByTestId('toaster-body');
    expect(toasterBody).toBeInTheDocument();
    expect(toasterBody.innerHTML).toBe('Failed to delete task!');
    expect(toaster).toHaveClass('bg-danger');
  });
});
