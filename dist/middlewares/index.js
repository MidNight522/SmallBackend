"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuth = exports.ValidateUserNotExist = exports.ValidatePassword = exports.SignUp = exports.DeleteTodo = exports.UpdateTodo = exports.GetTodo = exports.GetAllTodos = exports.CreateTodo = exports.ValidateTodo = exports.ValidateSuchTodoExists = void 0;
const storage_1 = require("../storage");
const classes_1 = require("../classes");
const ValidateSuchTodoExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const incomeTodo = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data;
        const incomeTodoId = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.id;
        if (incomeTodoId) {
            const todo = storage_1.todos.getTodoById(incomeTodoId);
            if (!todo)
                throw new Error(`Todo with id ${incomeTodoId} NOT FOUND`);
            return next();
        }
        if (incomeTodo.id) {
            const suchTodoExists = storage_1.todos.checkIsSuchTodoExists(incomeTodo.id);
            if (!suchTodoExists)
                throw new Error(`Todo with id ${incomeTodo.id} NOT FOUND`);
            return next();
        }
    }
    catch (error) {
        res.status(404).json({ data: error.message });
    }
});
exports.ValidateSuchTodoExists = ValidateSuchTodoExists;
const ValidateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoReqBody = req.body.data;
        if (!todoReqBody.title || !todoReqBody.description)
            throw new Error('REQUIRED DATA WAS NOT PROVIDED');
        if (typeof todoReqBody.title !== 'string' ||
            typeof todoReqBody.description !== 'string' ||
            ((todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.priority) &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.priority) !== 'low' &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.priority) !== 'medium' &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.priority) !== 'high') ||
            ((todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.status) &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.status) !== 'active' &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.status) !== 'completed' &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.status) !== 'expired' &&
                (todoReqBody === null || todoReqBody === void 0 ? void 0 : todoReqBody.status) !== 'postponed') ||
            !todoReqBody.userId)
            throw new Error('WRONG DATA TYPES');
        return next();
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.ValidateTodo = ValidateTodo;
const CreateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todoReqBody = req.body.data;
        const todoToCreate = Object.assign({ id: storage_1.todos.generateId(), createdAt: new Date().toString(), updatedAt: new Date().toString() }, todoReqBody);
        storage_1.todos.addTodo(todoToCreate);
        res.status(201).send({ data: todoToCreate });
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.CreateTodo = CreateTodo;
const GetAllTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.headers['username'] || undefined;
        const user = username ? storage_1.users.getUserByUsername(username) : '';
        if (!user) {
            const allTodos = storage_1.todos.getTodos();
            res.status(200).json({ data: allTodos });
        }
        else {
            const allTodos = storage_1.todos
                .getTodos()
                .filter((todo) => todo.userId === user.id);
            res.status(200).json({ data: allTodos });
        }
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.GetAllTodos = GetAllTodos;
const GetTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idOfTodo = req.query.id;
        const todo = storage_1.todos.getTodoById(idOfTodo);
        res.status(200).json({ data: todo });
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.GetTodo = GetTodo;
const UpdateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomeTodo = req.body.data;
        const suchTodoExists = storage_1.todos.checkIsSuchTodoExists(incomeTodo.id);
        if (!suchTodoExists)
            throw new Error('SUCH TODO DOES NOT EXISTS');
        storage_1.todos.editTodo(incomeTodo);
        res.status(200).json({ data: incomeTodo });
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.UpdateTodo = UpdateTodo;
const DeleteTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomeTodo = req.query.id;
        storage_1.todos.deleteTodo(incomeTodo);
        res.status(200).json({ data: `TODO ${incomeTodo} WAS DELETED ` });
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.DeleteTodo = DeleteTodo;
const SignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomeUserToCreate = req.body.data;
        const incomePassword = req.body.password;
        const createdUser = storage_1.users.createNewUser(incomeUserToCreate, incomePassword);
        res.status(200).json({ data: createdUser });
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.SignUp = SignUp;
const ValidatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomePassword = req.body.password;
        const isValidPassword = classes_1.Users.validatePassword(incomePassword);
        if (isValidPassword)
            return next();
        throw new Error('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.ValidatePassword = ValidatePassword;
const ValidateUserNotExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomeUserToCreate = req.body.data;
        const userExists = storage_1.users.checkSuchUserExistsByUsername(incomeUserToCreate);
        if (userExists)
            throw new Error(`User with username ${incomeUserToCreate.username} already exists`);
        next();
    }
    catch (error) {
        res.status(400).send({ data: error.message });
    }
});
exports.ValidateUserNotExist = ValidateUserNotExist;
const CheckAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.headers['username'] || undefined;
        const password = req.headers['password'] || undefined;
        if (!username || !password)
            throw new Error('NO CREDS PROVIDED');
        const user = storage_1.users.getUserByUsername(username);
        if (!user)
            throw new Error('USER NOT FOUND');
        const checkPasswordIsValid = storage_1.users.checkPasswordIsValid(password, user.id);
        if (!checkPasswordIsValid)
            throw new Error('PASSWORD IS NOT VALID');
        else
            next();
    }
    catch (error) {
        res.status(401).send({ data: error.message });
    }
});
exports.CheckAuth = CheckAuth;
// export const;
