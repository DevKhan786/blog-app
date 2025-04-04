import "@testing-library/jest-dom";

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("firebase/auth");
jest.mock("firebase/firestore");
jest.mock("firebase/app");
