"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
app.post('/todo/create', middlewares_1.CheckAuth, middlewares_1.ValidateTodo, middlewares_1.CreateTodo);
app.get('/todo/all', middlewares_1.CheckAuth, middlewares_1.GetAllTodos);
app.get('/todo', middlewares_1.CheckAuth, middlewares_1.ValidateSuchTodoExists, middlewares_1.GetTodo);
app.put('/todo/update', middlewares_1.CheckAuth, middlewares_1.ValidateTodo, middlewares_1.UpdateTodo);
app.delete('/todo/delete', middlewares_1.CheckAuth, middlewares_1.ValidateSuchTodoExists, middlewares_1.DeleteTodo);
app.post('/user/create', middlewares_1.ValidatePassword, middlewares_1.ValidateUserNotExist, middlewares_1.SignUp);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
