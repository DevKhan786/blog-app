import { render, screen, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../lib/contexts/AuthContext";
import {
  mockClearError,
  mockHandleEmailPasswordAuth,
  mockHandleResetPassword,
  mockHandleSignInWithGoogle,
} from "../__mocks__/firebase";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("../lib/contexts/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    error: null,
    handleSignInWithGoogle: mockHandleSignInWithGoogle,
    handleEmailPasswordAuth: mockHandleEmailPasswordAuth,
    handleResetPassword: mockHandleResetPassword,
    clearError: mockClearError,
  })),
}));

const mockUseAuth = useAuth as jest.Mock;

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders email and password inputs", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors", async () => {
    render(<LoginForm />);
    userEvent.click(screen.getByText("Sign In"));

    expect(await screen.findByText("Email is required")).toBeVisible();
    expect(await screen.findByText("Password is required")).toBeVisible();
  });

  test("switches to signup mode", async () => {
    render(<LoginForm />);
    userEvent.click(screen.getByText("Need an account? Sign Up"));

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Create Account"
      );
    });
  });

  test("handles valid login", async () => {
    mockHandleEmailPasswordAuth.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockHandleEmailPasswordAuth).toHaveBeenCalledWith(
        "test@example.com",
        "password",
        false
      );
    });
  });

  test("shows reset password success", async () => {
    mockHandleResetPassword.mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByText(/forgot password/i));
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockHandleResetPassword).toHaveBeenCalledWith("test@example.com");
      expect(screen.getByText(/password reset email sent/i)).toBeVisible();
    });
  });
});
