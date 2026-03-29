import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { auth } from "../lib/auth";

interface AuthState {
  user: {
    identifier: string;
    eligible: boolean;
    name?: string;
    role: 'DONOR' | 'PARTNER' | 'ADMIN';
  } | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { identifier: string; eligible: boolean; name?: string; role: 'DONOR' | 'PARTNER' | 'ADMIN' } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADED" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (identifier: string, eligible: boolean, name?: string, role?: 'DONOR' | 'PARTNER' | 'ADMIN') => void;
  logout: () => void;
} | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoaded: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoaded: true,
      };
    case "SET_LOADED":
      return {
        ...state,
        isLoaded: true,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoaded: false,
  });

  useEffect(() => {
    const session = auth.getSession();
    if (session) {
      dispatch({ 
        type: "LOGIN", 
        payload: { 
          identifier: session.identifier, 
          eligible: session.eligible,
          name: session.name,
          role: (session as any).role || 'DONOR'
        } 
      });
    } else {
      dispatch({ type: "SET_LOADED" });
    }
  }, []);

  const login = (identifier: string, eligible: boolean, name?: string, role?: 'DONOR' | 'PARTNER' | 'ADMIN') => {
    dispatch({ type: "LOGIN", payload: { identifier, eligible, name, role: role || 'DONOR' } });
  };

  const logout = () => {
    auth.logout();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
