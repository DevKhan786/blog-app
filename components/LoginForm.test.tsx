import { render, screen } from "@testing-library/react";
import LoginForm from "./LoginForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    params: {},
  }),
}));

jest.mock("../lib/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
    handleSignInWithGoogle: jest.fn(),
    handleEmailPasswordAuth: jest.fn(),
    handleResetPassword: jest.fn(),
    clearError: jest.fn(),
  }),
}));

describe("LoginForm", () => {
  test("renders email and password inputs", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });
});
