const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var testUsers;

  beforeEach(() => {
    testUsers = new Users();
    testUsers.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }];
  });

  it('should add new user', () => {
    var testADDUsers = new Users();
    var user = {
      id: '123',
      name: 'Andrew',
      room: 'The Office Fans'
    };
    var resUser = testADDUsers.addUser(user.id, user.name, user.room);

    expect(testADDUsers.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var userId = '1';
    var user = testUsers.removeUser(userId);

    expect(user.id).toBe(userId);
    expect(testUsers.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var userId = '99';
    var user = testUsers.removeUser(userId);

    expect(user).toBeFalsy();
    expect(testUsers.users.length).toBe(3);
  });

  it('should find user', () => {
    var userId = '2';
    var user = testUsers.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    var userId = '99';
    var user = testUsers.getUser(userId);

    expect(user).toBeFalsy();
  });

  it('should return names for node course', () => {
    var userList = testUsers.getUserList('Node Course');

    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    var userList = testUsers.getUserList('React Course');

    expect(userList).toEqual(['Jen']);
  });
});
