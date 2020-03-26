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

module.exports = { userJoin, getCurrentUser };
