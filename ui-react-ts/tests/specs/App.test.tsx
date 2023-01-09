import React from 'react';
import { render, screen, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import httpCommon from '../../src/services/http-common';
import App from '../../src/App';
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

describe('App Component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Renders App', async () => {
    mock.onGet(`${host}/api/tasks`).reply(200, data);
    await act(async () => render(<App />));
    // check task table is in DOM
    const table = await screen.findByTestId('table-tasks');
    expect(table).toBeInTheDocument();
    // check row count
    const tableRows = await screen.findAllByTestId('task-row');
    expect(tableRows.length).toBe(data.length);
  });
});
