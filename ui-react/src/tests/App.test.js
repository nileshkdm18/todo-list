import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import getHost from '../apis/host';
const host = getHost();
const mock = new MockAdapter(axios);
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

beforeEach(() => {
  mock.onGet(`${host}/api/tasks`).reply(200, data);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Renders App', async () => {
  render(<App />);
  const table = await screen.findByTestId('table-tasks');
  expect(table).toBeInTheDocument();
  const tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length);
});

test('Add Task', async () => {
  const newTask = {
    description: 'New Task',
    completed: false,
    createdAt: '2022-12-25T10:19:59.766Z',
    updatedAt: '2022-12-25T10:19:59.766Z',
    id: 'a6'
  };
  mock.onPost(`${host}/api/tasks`).reply(200, newTask);
  render(<App />);
  let tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length);
  // set description
  const description = await screen.findByTestId('text-description');
  await fireEvent.change(description, { target: { value: 'New Task' } });
  // click on Add Task Button
  const button = await screen.findByTestId('button-add-task');
  await userEvent.click(button);
  // Check updated length of task table rows
  tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length + 1);
});

test('Add Task - Enter', async () => {
  const newTask = {
    description: 'New Task',
    completed: false,
    createdAt: '2022-12-25T10:19:59.766Z',
    updatedAt: '2022-12-25T10:19:59.766Z',
    id: 'a6'
  };
  mock.onPost(`${host}/api/tasks`).reply(200, newTask);
  render(<App />);
  let tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length);
  // set description
  const description = await screen.findByTestId('text-description');
  // Mock user typing description and then pressing `Enter` key
  await userEvent.type(description, 'New Task{enter}');
  // Check updated length of task table rows
  tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length + 1);
});

test('Mark Task Complete', async () => {
  const taskToBeCompleted = 'a3';
  mock
    .onPatch(`${host}/api/tasks/${taskToBeCompleted}`, { completed: true })
    .reply(200, { completed: true });
  render(<App />);
  // click on Add Task Button
  let checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
  await userEvent.click(checkbox);
  // Check updated length of task table rows
  checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
  expect(checkbox).toBeChecked();
});

test('Mark Task Un-Complete', async () => {
  const taskToBeCompleted = 'a1';
  mock
    .onPatch(`${host}/api/tasks/${taskToBeCompleted}`, { completed: false })
    .reply(200, { completed: false });
  render(<App />);
  // click on Add Task Button
  let checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
  await userEvent.click(checkbox);
  // Check updated length of task table rows
  checkbox = await screen.findByTestId(`checkbox-complete-task-${taskToBeCompleted}`);
  expect(checkbox).not.toBeChecked();
});

test('Delete Task', async () => {
  const taskToBeDeleted = 'a3';
  mock.onDelete(`${host}/api/tasks/${taskToBeDeleted}`).reply(200, { message: 'Task Deleted' });
  render(<App />);
  let tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length);
  // click on Add Task Button
  const button = await screen.findByTestId(`button-delete-task-${taskToBeDeleted}`);
  await userEvent.click(button);
  // check modal is in dom
  let modal = await screen.findByTestId('modal-delete-task');
  expect(modal).toBeInTheDocument();
  // click on Delete Button
  const buttonDelete = await screen.findByTestId(`button-action`);
  await userEvent.click(buttonDelete);
  // Check updated length of task table rows
  tableRows = await screen.findAllByTestId('task-row');
  expect(tableRows.length).toBe(data.length - 1);
});
