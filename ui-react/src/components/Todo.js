import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect, useReducer } from 'react';

import find from 'lodash/find';
import remove from 'lodash/remove';

import { getTasks, addTask, updateTask, deleteTask } from '../apis/task.api';

import ActionModal from './common/ActionModal';
import Toaster from './common/Toaster';

const ALERT_META = Object.freeze({
  show: false,
  message: '',
  type: ''
});

const alertAction = (_state, action) => {
  if (action.type === 'SUCCESS' || action.type === 'ERROR') {
    return {
      show: true,
      message: action.message,
      type: action.type
    };
  }
  return ALERT_META;
};

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [tempTaskId, setTempTaskId] = useState(null);

  const [alertState, dispatchAlertAction] = useReducer(alertAction, ALERT_META);

  useEffect(() => {
    getTasks().then(data => {
      setTasks([...data]);
    });
  }, []);

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onAddClick();
    }
  }

  function onAddClick() {
    dispatchAlertAction({ type: 'CLEAR' });
    addTask({ description: description })
      .then(resp => setTasks([...tasks, resp]))
      .then(() => {
        setDescription('');
        dispatchAlertAction({ type: 'SUCCESS', message: 'Task Added Successfully' });
      })
      .catch(error => {
        dispatchAlertAction({ type: 'ERROR', message: error.message });
      });
  }

  function onStatusChange(id, e) {
    dispatchAlertAction({ type: 'CLEAR' });
    updateTask(id, { completed: e.target.checked })
      .then(resp => {
        const _tasks = tasks;
        const task = find(_tasks, { id });
        // update task properties
        Object.assign(task, resp);
        // to make array reactive
        setTasks([..._tasks]);
        dispatchAlertAction({
          type: 'SUCCESS',
          message: `Task status changed to ${resp.completed ? 'Completed' : 'Pending'}`
        });
      })
      .catch(error => {
        dispatchAlertAction({ type: 'ERROR', message: error.message });
      });
  }

  function onDeleteTask(id) {
    dispatchAlertAction({ type: 'CLEAR' });
    deleteTask(id)
      .then(() => {
        const _tasks = tasks;
        // remove task
        remove(_tasks, { id });
        // to make array reactive
        setTasks([..._tasks]);
        closeModel();
        dispatchAlertAction({
          type: 'SUCCESS',
          message: 'Task Deleted Successfully'
        });
      })
      .catch(error => {
        dispatchAlertAction({ type: 'ERROR', message: error.message });
      });
  }

  function openModel(id) {
    setTempTaskId(id);
    setModalShow(true);
  }

  function closeModel() {
    setTempTaskId(null);
    setModalShow(false);
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">ToDo List</Navbar.Brand>
        </Container>
      </Navbar>
      <Toaster
        show={alertState.show}
        bg={alertState.type === 'ERROR' ? 'danger' : 'success'}
        delay={alertState.type === 'ERROR' ? 0 : 3000}
        message={alertState.message}
      />
      <ActionModal
        show={modalShow}
        bodyMessage="Are you sure you want to delete task?"
        actionButtonVariant="danger"
        actionButtonText="Delete"
        onModelCloseClick={closeModel}
        onActionClick={() => onDeleteTask(tempTaskId)}
      />
      <Container className="main">
        <Row>
          <Col lg={9}>
            <Form.Control
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Task"
              data-testid="text-description"
            />
          </Col>
          <Col lg={3}>
            <Button
              style={{ width: '100%' }}
              variant="primary"
              type="button"
              onClick={onAddClick}
              data-testid="button-add-task">
              Add
            </Button>
          </Col>
        </Row>
        <Row className="padding-top-2-x">
          <Col lg={12}>
            <Table bordered hover data-testid="table-tasks">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>#</th>
                  <th style={{ width: '70%' }}>Description</th>
                  <th style={{ width: '8%' }}>Completed</th>
                  <th style={{ width: '2%' }}>X</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => {
                  return (
                    <tr
                      key={idx}
                      style={task.completed ? { background: 'limegreen' } : { background: 'none' }}
                      data-testid="task-row">
                      <td>{task.id}</td>
                      <td>{task.description}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={task.completed}
                          onChange={e => onStatusChange(task.id, e)}
                          data-testid={`checkbox-complete-task-${task.id}`}
                        />
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => openModel(task.id)}
                          data-testid={`button-delete-task-${task.id}`}>
                          X
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Todo;
