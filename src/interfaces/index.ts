type Priority = 'low' | 'medium' | 'high';
type Status = 'active' | 'completed' | 'expired' | 'postponed';

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority?: Priority;
  updatedAt: string;
  userId: string;
  createdAt: string;
  deadline?: string;
  status?: Status;
}

export type TodoReqBody = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export interface User {
  id: string;
  name: string;
  username: string;
}

export type UserReqBody = Omit<User, 'id'>;

export interface Password {
  value: string;
  userId: string;
}
