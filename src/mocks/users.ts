import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';

function getUsers(): User[] {
  const users = [];
  const totalUsers = 5;
  for (let i = 0; i < totalUsers; i++) {
    users.push({ id: uuid.v4(), username: `user${i + 1}@example.com` });
  }
  return users;
}

const users = getUsers();

export default users;
