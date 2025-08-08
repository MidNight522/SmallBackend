"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.Todos = void 0;
const utils_1 = require("../utils");
class Todos {
    constructor(todos) {
        this.todos = todos;
    }
    getTodos() {
        return this.todos;
    }
    getTodoById(todoId) {
        try {
            const checkSuchTodoExists = this.checkIsSuchTodoExists(todoId);
            if (!checkSuchTodoExists)
                return false;
            else
                return this.todos.find((todo) => todo.id === todoId) || false;
        }
        catch (error) {
            console.log('ERROR:', error);
            return false;
        }
    }
    checkIsSuchTodoExists(todoId) {
        return this.todos.some((todo) => todo.id === todoId);
    }
    addTodo(todo) {
        try {
            const suchTodoExists = this.checkIsSuchTodoExists(todo.id);
            if (suchTodoExists)
                throw new Error('SUCH TODO EXISTS');
            this.todos.push(todo);
        }
        catch (error) { }
    }
    editTodo(todo) {
        try {
            const checkSuchTodoExists = this.checkIsSuchTodoExists(todo.id);
            if (!checkSuchTodoExists)
                throw new Error('SUCH TODO DOES NOT EXISTS');
            const indexOfTodoToEdit = this.todos.map((t) => t.id).indexOf(todo.id);
            this.todos[indexOfTodoToEdit] = todo;
        }
        catch (error) {
            console.log('ERROR:', error);
        }
    }
    deleteTodo(todoId) {
        try {
            const checkSuchTodoExists = this.checkIsSuchTodoExists(todoId);
            if (!checkSuchTodoExists)
                throw new Error('SUCH TODO DOES NOT EXISTS');
            const indexOfTodoToEdit = this.todos.map((t) => t.id).indexOf(todoId);
            this.todos.splice(indexOfTodoToEdit, 1);
        }
        catch (error) {
            console.log('ERROR:', error);
        }
    }
    generateId() {
        return (0, utils_1.generateIdForArray)(this.todos);
    }
}
exports.Todos = Todos;
class Users {
    constructor(users) {
        this.users = users;
        this.password = [];
    }
    createNewUser(UserReqBody, password) {
        const id = this.generateIdForUser();
        const user = Object.assign({ id: id }, UserReqBody);
        const newPassword = {
            userId: id,
            value: password,
        };
        this.users.push(user);
        this.password.push(newPassword);
        return user;
    }
    getUsers(userId) {
        return this.users.find((user) => user.id === user.id);
    }
    getUserByUsername(username) {
        return this.users.find((user) => user.username === username);
    }
    checkPasswordIsValid(password, userId) {
        const passwordOfUser = this.password.find((p) => p.userId === userId);
        return (passwordOfUser === null || passwordOfUser === void 0 ? void 0 : passwordOfUser.value) === password;
    }
    checkSuchUserExistsByUsername(UserReqBody) {
        return this.users.some((user) => user.username === UserReqBody.username);
    }
    generateIdForUser() {
        return (0, utils_1.generateIdForArray)(this.users);
    }
    static validatePassword(password) {
        // return password.length > 4;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }
}
exports.Users = Users;
