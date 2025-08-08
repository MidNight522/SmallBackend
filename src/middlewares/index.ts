import { NextFunction, Request, Response } from 'express';
import { Todo, TodoReqBody, User, UserReqBody } from '../interfaces';

import { todos, users } from '../storage';
import { Password } from '../interfaces/index';
import { Users } from '../classes';

export const ValidateSuchTodoExists = async (
  req: Request<{}, {}, { data: Todo }, { id: string }>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const incomeTodo = req?.body?.data;
    const incomeTodoId = req?.query?.id;

    if (incomeTodoId) {
      const todo = todos.getTodoById(incomeTodoId);
      if (!todo) throw new Error(`Todo with id ${incomeTodoId} NOT FOUND`);
      return next();
    }
    if (incomeTodo.id) {
      const suchTodoExists = todos.checkIsSuchTodoExists(incomeTodo.id);
      if (!suchTodoExists)
        throw new Error(`Todo with id ${incomeTodo.id} NOT FOUND`);
      return next();
    }
  } catch (error: any) {
    res.status(404).json({ data: error.message });
  }
};

export const ValidateTodo = async (
  req: Request<{}, {}, { data: Todo }, { id: string }>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const todoReqBody = req.body.data;

    if (!todoReqBody.title || !todoReqBody.description)
      throw new Error('REQUIRED DATA WAS NOT PROVIDED');

    if (
      typeof todoReqBody.title !== 'string' ||
      typeof todoReqBody.description !== 'string' ||
      (todoReqBody?.priority &&
        todoReqBody?.priority !== 'low' &&
        todoReqBody?.priority !== 'medium' &&
        todoReqBody?.priority !== 'high') ||
      (todoReqBody?.status &&
        todoReqBody?.status !== 'active' &&
        todoReqBody?.status !== 'completed' &&
        todoReqBody?.status !== 'expired' &&
        todoReqBody?.status !== 'postponed') ||
      !todoReqBody.userId
    )
      throw new Error('WRONG DATA TYPES');

    return next();
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};
export const CreateTodo = async (
  req: Request<{}, {}, { data: TodoReqBody }, { id: string }>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const todoReqBody = req.body.data;

    const todoToCreate: Todo = {
      id: todos.generateId(),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      ...todoReqBody,
    };

    todos.addTodo(todoToCreate);
    res.status(201).send({ data: todoToCreate });
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const GetAllTodos = async (
  req: Request<{}, {}, {}, {}>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const username = (req.headers['username'] as string) || undefined;
    const user = username ? users.getUserByUsername(username) : '';
    if (!user) {
      const allTodos = todos.getTodos();
      res.status(200).json({ data: allTodos });
    } else {
      const allTodos = todos
        .getTodos()
        .filter((todo) => todo.userId === user.id);
      res.status(200).json({ data: allTodos });
    }
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const GetTodo = async (
  req: Request<{}, {}, {}, { id: string }>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const idOfTodo = req.query.id;
    const todo = todos.getTodoById(idOfTodo);
    res.status(200).json({ data: todo });
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const UpdateTodo = async (
  req: Request<{}, {}, { data: Todo }>,
  res: Response<{ data: Todo | unknown }>,
  next: NextFunction
) => {
  try {
    const incomeTodo = req.body.data;

    const suchTodoExists = todos.checkIsSuchTodoExists(incomeTodo.id);
    if (!suchTodoExists) throw new Error('SUCH TODO DOES NOT EXISTS');

    todos.editTodo(incomeTodo);
    res.status(200).json({ data: incomeTodo });
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const DeleteTodo = async (
  req: Request<{}, {}, {}, { id: string }>,
  res: Response<{ data: string | unknown }>,
  next: NextFunction
) => {
  try {
    const incomeTodo = req.query.id;

    todos.deleteTodo(incomeTodo);
    res.status(200).json({ data: `TODO ${incomeTodo} WAS DELETED ` });
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const SignUp = async (
  req: Request<{}, {}, { data: UserReqBody; password: string }, {}>,
  res: Response<{ data: User | unknown }>,
  next: NextFunction
) => {
  try {
    const incomeUserToCreate = req.body.data;
    const incomePassword = req.body.password;
    const createdUser = users.createNewUser(incomeUserToCreate, incomePassword);
    res.status(200).json({ data: createdUser });
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const ValidatePassword = async (
  req: Request<{}, {}, { data: UserReqBody; password: string }, {}>,
  res: Response<{ data: string | unknown }>,
  next: NextFunction
) => {
  try {
    const incomePassword = req.body.password;
    const isValidPassword = Users.validatePassword(incomePassword);
    if (isValidPassword) return next();
    throw new Error(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.'
    );
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const ValidateUserNotExist = async (
  req: Request<{}, {}, { data: UserReqBody; password: string }, {}>,
  res: Response<{ data: string | unknown }>,
  next: NextFunction
) => {
  try {
    const incomeUserToCreate = req.body.data;
    const userExists = users.checkSuchUserExistsByUsername(incomeUserToCreate);
    if (userExists)
      throw new Error(
        `User with username ${incomeUserToCreate.username} already exists`
      );
    next();
  } catch (error: any) {
    res.status(400).send({ data: error.message });
  }
};

export const CheckAuth = async (
  req: Request<{}, {}, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  try {
    const username = (req.headers['username'] as string) || undefined;
    const password = (req.headers['password'] as string) || undefined;
    if (!username || !password) throw new Error('NO CREDS PROVIDED');

    const user = users.getUserByUsername(username);
    if (!user) throw new Error('USER NOT FOUND');

    const checkPasswordIsValid = users.checkPasswordIsValid(password, user!.id);
    if (!checkPasswordIsValid) throw new Error('PASSWORD IS NOT VALID');
    else next();
  } catch (error: any) {
    res.status(401).send({ data: error.message });
  }
};
// export const;
