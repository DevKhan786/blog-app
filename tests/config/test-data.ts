interface UserCredentials {
  email: string;
  password: string;
}

interface TestUsers {
  admin: UserCredentials;
  invalid: UserCredentials;
}

export const TestUser: TestUsers = {
  admin: {
    email: "test123@gmail.com",
    password: "test123",
  },
  invalid: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
} as const;
