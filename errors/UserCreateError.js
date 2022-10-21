class UserCreateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserCreateError';
    this.statusCode = 409;
  }
}

module.exports = { UserCreateError };
