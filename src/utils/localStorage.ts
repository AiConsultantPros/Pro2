import { Client, Task, User } from '../types';

const CLIENTS_KEY = 'clients';
const TASKS_KEY = 'tasks';
const USERS_KEY = 'users';

export const getClients = (): Client[] => {
  const clients = localStorage.getItem(CLIENTS_KEY);
  return clients ? JSON.parse(clients) : [];
};

export const saveClients = (clients: Client[]): void => {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};