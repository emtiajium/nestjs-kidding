// Consider this as model / repository / persistent entity

import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';

let users = []; // global variable

function createUsers(): void {
  const totalUsers = 5;
  for (let i = 0; i < totalUsers; i++) {
    users.push({ id: uuid.v4(), username: `user${i + 1}@example.com` });
  }
}

// insert few users
createUsers();

function getAllUsers(): User[] {
  return users;
}

function findUser(userId: string): User {
  return users.find(user => user.id === userId);
}

function addUser(user: User): User {
  const newUser = {
    ...user,
    id: uuid.v4(),
  };
  users.push(newUser);
  return newUser;
}

function updateUser(user: User): User {
  const updatedUser = Object.assign(user, findUser(user.id));
  users[users.findIndex(({ id: userId }) => userId === user.id)] = updatedUser;
  return updatedUser;
}

function removeUser(userId: string): void {
  users = users.filter(user => userId !== user.id);
}

export { getAllUsers, findUser, addUser, updateUser, removeUser };
