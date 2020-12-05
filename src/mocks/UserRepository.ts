// Consider this as model / repository / persistent entity

import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';

let users: User[] = []; // users table / collection (actually, a global variable!)

// insert few users at the time of app initialization
(function createUsers(): void {
  const totalUsers = 5;
  for (let i = 0; i < totalUsers; i++) {
    users.push({ id: uuid.v4(), username: `user${i + 1}@example.com` });
  }
})();

export default class UserRepository {
  /* eslint-disable class-methods-use-this */
  getAllUsers(): User[] {
    return users;
  }

  findUser(userId: string): User {
    return users.find(user => user.id === userId);
  }

  addUser(user: User): User {
    const newUser: User = {
      ...user,
      id: uuid.v4(),
    };
    users.push(newUser);
    return newUser;
  }

  updateUser(user: User): User {
    const updatedUser = Object.assign(user, this.findUser(user.id));
    users[users.findIndex(({ id: userId }) => userId === user.id)] = updatedUser;
    return updatedUser;
  }

  removeUser(userId: string): void {
    users = users.filter(user => userId !== user.id);
  }
}
