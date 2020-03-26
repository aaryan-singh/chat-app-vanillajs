const users = [];

// User joins chat
const userJoin = ({ id, name, room }) => {
  const user = { id, name, room };
  users.push(user);
  return user;
};

// Get current user
const getCurrentUser = id => {
  return users.find(user => user.id === id);
};

// User leaves chat
const userLeave = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { userJoin, getCurrentUser, userLeave };
