import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './App.css';
import Todo from './components/todo.component';

function App() {
  return (
    <div className='App'>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container>
          <Navbar.Brand href='#home'>Todo List</Navbar.Brand>
        </Container>
      </Navbar>
      <Todo></Todo>
    </div>
  );
}

export default App;
