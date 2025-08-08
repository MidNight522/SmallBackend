import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import { Todo, TodoReqBody } from './interfaces';
import { Todos } from './classes';
import { todos } from './storage';
import {
  CheckAuth,
  CreateTodo,
  DeleteTodo,
  GetAllTodos,
  GetTodo,
  SignUp,
  UpdateTodo,
  ValidatePassword,
  ValidateSuchTodoExists,
  ValidateTodo,
  ValidateUserNotExist,
} from './middlewares';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/todo/create', CheckAuth, ValidateTodo, CreateTodo);

app.get('/todo/all', CheckAuth, GetAllTodos);

app.get('/todo', CheckAuth, ValidateSuchTodoExists, GetTodo);

app.put('/todo/update', CheckAuth, ValidateTodo, UpdateTodo);

app.delete('/todo/delete', CheckAuth, ValidateSuchTodoExists, DeleteTodo);

app.post('/user/create', ValidatePassword, ValidateUserNotExist, SignUp);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
