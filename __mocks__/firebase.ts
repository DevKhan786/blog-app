export const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  onAuthStateChanged: jest.fn((callback) => {
    callback(mockAuth.currentUser);
    return jest.fn();
  }),
};

export const getAuth = jest.fn(() => mockAuth);
export const GoogleAuthProvider = jest.fn();
