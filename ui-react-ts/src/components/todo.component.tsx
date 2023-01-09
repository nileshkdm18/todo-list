import { useState, useEffect, useReducer } from 'react';
import { AxiosResponse } from 'axios';
// lodash utilities
import find from 'lodash/find';
import remove from 'lodash/remove';
import partition from 'lodash/partition';
// bootstrap components
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
// common custom components
import ActionModal from './ui/action-modal.component';
import Toaster from './ui/toaster.component';
// local project imports
import TaskService from '../services/task.service';
import ITaskData from '../types/task.type';
import { InputChangeEvent, KeyboardEvent } from '../types/events.type';
import { getErrorText } from '../utils/error-handling';

interface ITaskStatusCount {
  all: number;
  pending: number;
  completed: number;
}

const TASK_STATUS_INITIAL_COUNTS = Object.freeze({
  all: 0,
  pending: 0,
  completed: 0
});

interface IAlertAction {
  message: string;
  type: string;
}

interface IAlertState {
  show: boolean;
  message: string;
  type: string;
}

const ALERT_INITIAL_STATE = Object.freeze({
  show: false,
  message: '',
  type: ''
});

const alertAction = (state: IAlertState = ALERT_INITIAL_STATE, action: IAlertAction) => {
  if (action.type === 'SUCCESS' || action.type === 'ERROR') {
    return {
      show: true,
      message: action.message,
      type: action.type
    };
  }
  if (action.type === 'CLEAR') {
    return ALERT_INITIAL_STATE;
  }

  return state;
};

function Todo() {
  // states
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [description, setDescription] = useState<string>('');
  const [modalShow, setModalShow] = useState(false);
  const [tempTaskId, setTempTaskId] = useState<string>('');
  const [filteredTasks, setFilteredTasks] = useState<ITaskData[]>([]);
  const [taskCounts, setTaskCounts] = useState<ITaskStatusCount>(TASK_STATUS_INITIAL_COUNTS);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [alertState, dispatchAlertAction] = useReducer(alertAction, ALERT_INITIAL_STATE);

  // load all task
  useEffect(() => {
    TaskService.getAll()
      .then((resp: AxiosResponse<ITaskData[]>) => {
        setTasks([...resp.data]);
      })
      .catch((error: Error) => {
        dispatchAlertAction({ type: 'ERROR', message: getErrorText(error) });
      });
  }, []);

  // filter task based on tab selected
  useEffect(() => {
    let list: ITaskData[] = [...tasks];
    const counts: ITaskStatusCount = { ...TASK_STATUS_INITIAL_COUNTS };
    const partitionedList = partition(list, 'completed');
    counts.all = list.length;
    counts.completed = partitionedList[0].length;
    counts.pending = partitionedList[1].length;
    if (selectedTab === 'completed') {
      list = partitionedList[0];
    }
    if (selectedTab === 'pending') {
      list = partitionedList[1];
    }
    setTaskCounts(counts);
    setFilteredTasks(list);
  }, [tasks, selectedTab]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onAddClick();
    }
  }

  // Add task handler
  function onAddClick() {
    dispatchAlertAction({ type: 'CLEAR', message: '' });
    TaskService.create({ description: description })
      .then((resp: AxiosResponse<ITaskData>) => {
        // Append newly added task to task list and update state
        setTasks([...tasks, resp.data]);
        setDescription('');
        dispatchAlertAction({ type: 'SUCCESS', message: 'Task Added Successfully' });
      })
      .catch((error: Error) => {
        dispatchAlertAction({ type: 'ERROR', message: getErrorText(error) });
      });
  }

  // Task status change handler
  function onStatusChange(id: string, e: InputChangeEvent) {
    dispatchAlertAction({ type: 'CLEAR', message: '' });
    TaskService.update(id, { completed: e.target.checked })
      .then((resp: AxiosResponse<ITaskData>) => {
        const list = [...tasks];
        const task = find(list, { id });
        // update task properties
        if (task) {
          Object.assign(task, resp.data);
        }
        // update state
        setTasks([...list]);
        dispatchAlertAction({
          type: 'SUCCESS',
          message: `Task status changed to ${resp.data.completed ? 'Completed' : 'Pending'}`
        });
      })
      .catch((error: Error) => {
        dispatchAlertAction({ type: 'ERROR', message: getErrorText(error) });
      });
  }

  // Task delete handler
  function onDeleteTask(id: string) {
    dispatchAlertAction({ type: 'CLEAR', message: '' });
    TaskService.delete(id)
      .then(() => {
        const list = [...tasks];
        // remove task
        remove(list, { id });
        // update state
        setTasks([...list]);
        closeModel();
        dispatchAlertAction({
          type: 'SUCCESS',
          message: 'Task Deleted Successfully'
        });
      })
      .catch((error: Error) => {
        dispatchAlertAction({ type: 'ERROR', message: getErrorText(error) });
      });
  }

  // Tab select handler
  function handleSelect(eventKey: string) {
    setSelectedTab(eventKey);
  }

  // Delete Modal show handler
  function openModel(id: string) {
    setTempTaskId(id);
    setModalShow(true);
  }

  // Delete Modal hide handler
  function closeModel() {
    setTempTaskId('');
    setModalShow(false);
  }

  return (
    <div>
      <Toaster
        show={alertState.show}
        bg={alertState.type === 'ERROR' ? 'danger' : 'success'}
        delay={alertState.type === 'ERROR' ? 0 : 3000}
        autoHide={alertState.type === 'ERROR' ? false : true}
        message={alertState.message}
      />
      <ActionModal
        show={modalShow}
        bodyMessage='Are you sure you want to delete task?'
        actionButtonVariant='danger'
        actionButtonText='Delete'
        onModelCloseClick={closeModel}
        onActionClick={() => onDeleteTask(tempTaskId)}
      />
      <Container className='main'>
        <Row>
          <Col lg={9}>
            <Form.Control
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder='Task'
              data-testid='text-description'
            />
          </Col>
          <Col lg={3}>
            <Button
              style={{ width: '100%' }}
              variant='primary'
              type='button'
              onClick={onAddClick}
              data-testid='button-add-task'>
              Add
            </Button>
          </Col>
        </Row>
        <Row className='padding-top-2-x'>
          <Col lg={12}>
            <Card>
              <Card.Header>
                <Nav
                  variant='tabs'
                  onSelect={key => handleSelect(String(key))}
                  defaultActiveKey={selectedTab}>
                  <Nav.Item>
                    <Nav.Link eventKey='all' data-testid='nav-tab-all'>
                      All&nbsp;
                      <Badge pill bg='primary'>
                        {taskCounts.all}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='pending' data-testid='nav-tab-pending'>
                      Pending&nbsp;
                      <Badge pill bg='primary'>
                        {taskCounts.pending}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey='completed' data-testid='nav-tab-completed'>
                      Completed&nbsp;
                      <Badge pill bg='primary'>
                        {taskCounts.completed}
                      </Badge>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Table bordered hover data-testid='table-tasks'>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>#</th>
                      <th style={{ width: '70%', textAlign: 'left' }}>Description</th>
                      <th style={{ width: '8%' }}>Completed</th>
                      <th style={{ width: '2%' }}>X</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task, idx) => {
                      return (
                        <tr
                          key={idx}
                          style={
                            task.completed && selectedTab === 'all'
                              ? { background: '#198754' }
                              : { background: 'none' }
                          }
                          data-testid='task-row'>
                          <td>{task.id}</td>
                          <td style={{ textAlign: 'left' }}>{task.description}</td>
                          <td>
                            <Form.Check
                              type='checkbox'
                              checked={task.completed}
                              onChange={e => onStatusChange(String(task.id), e)}
                              data-testid={`checkbox-complete-task-${task.id}`}
                            />
                          </td>
                          <td>
                            <Button
                              type='button'
                              variant='danger'
                              size='sm'
                              onClick={() => openModel(String(task.id))}
                              data-testid={`button-delete-task-${task.id}`}>
                              X
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer>
                <small className='text-muted'>{`${taskCounts.pending} task left`}</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Todo;
