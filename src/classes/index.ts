import { Todo, User } from '../interfaces';
import { UserReqBody, Password } from '../interfaces/index';
import { generateIdForArray } from '../utils';

export class Todos {
  private todos: Todo[];

  constructor(todos: Todo[]) {
    this.todos = todos;
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  getTodoById(todoId: string) {
    try {
      const checkSuchTodoExists = this.checkIsSuchTodoExists(todoId);
      if (!checkSuchTodoExists) return false;
      else return this.todos.find((todo) => todo.id === todoId) || false;
    } catch (error: any) {
      console.log('ERROR:', error);
      return false;
    }
  }

  checkIsSuchTodoExists(todoId: string) {
    return this.todos.some((todo) => todo.id === todoId);
  }

  addTodo(todo: Todo) {
    try {
      const suchTodoExists = this.checkIsSuchTodoExists(todo.id);
      if (suchTodoExists) throw new Error('SUCH TODO EXISTS');
      this.todos.push(todo);
    } catch (error) {}
  }

  editTodo(todo: Todo) {
    try {
      const checkSuchTodoExists = this.checkIsSuchTodoExists(todo.id);
      if (!checkSuchTodoExists) throw new Error('SUCH TODO DOES NOT EXISTS');

      const indexOfTodoToEdit = this.todos.map((t) => t.id).indexOf(todo.id);
      this.todos[indexOfTodoToEdit] = todo;
    } catch (error: any) {
      console.log('ERROR:', error);
    }
  }

  deleteTodo(todoId: string) {
    try {
      const checkSuchTodoExists = this.checkIsSuchTodoExists(todoId);
      if (!checkSuchTodoExists) throw new Error('SUCH TODO DOES NOT EXISTS');

      const indexOfTodoToEdit = this.todos.map((t) => t.id).indexOf(todoId);
      this.todos.splice(indexOfTodoToEdit, 1);
    } catch (error: any) {
      console.log('ERROR:', error);
    }
  }

  generateId() {
    return generateIdForArray(this.todos);
  }
}

export class Users {
  private users: User[];
  private password: Password[];

  constructor(users: User[]) {
    this.users = users;
    this.password = [];
  }

  createNewUser(UserReqBody: UserReqBody, password: string) {
    const id = this.generateIdForUser();
    const user: User = {
      id: id,
      ...UserReqBody,
    };
    const newPassword: Password = {
      userId: id,
      value: password,
    };
    this.users.push(user);
    this.password.push(newPassword);
    return user;
  }
  getUsers(userId: string) {
    return this.users.find((user) => user.id === user.id);
  }
  getUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  checkPasswordIsValid(password: string, userId: string) {
    const passwordOfUser = this.password.find((p) => p.userId === userId);
    return passwordOfUser?.value === password;
  }

  checkSuchUserExistsByUsername(UserReqBody: UserReqBody) {
    return this.users.some((user) => user.username === UserReqBody.username);
  }

  generateIdForUser() {
    return generateIdForArray(this.users);
  }

  static validatePassword(password: string) {
    // return password.length > 4;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }
}
