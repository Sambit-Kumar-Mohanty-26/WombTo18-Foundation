import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { auth } from "../lib/auth";

interface AuthState {
  user: {
    identifier: string;
    eligible: boolean;
    name?: string;
    mobile?: string;
    donorId?: string;
    volunteerId?: string;
    partnerId?: string;
    organizationName?: string;
    role: 'DONOR' | 'VOLUNTEER' | 'PARTNER' | 'ADMIN';
    tier?: string;
    profileCompleted?: boolean;
  } | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: AuthState["user"] }
  | { type: "LOGOUT" }
  | { type: "SET_LOADED" }
  | { type: "UPDATE_ROLE"; payload: Partial<NonNullable<AuthState["user"]>> };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (identifier: string, eligible: boolean, name?: string, role?: string, extra?: Record<string, any>) => void;
  logout: () => void;
} | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true, isLoaded: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoaded: true };
    case "SET_LOADED":
      return { ...state, isLoaded: true };
    case "UPDATE_ROLE":
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
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
          donorId: session.donorId,
          volunteerId: session.volunteerId,
          partnerId: session.partnerId,
          organizationName: session.organizationName,
          role: session.role || 'DONOR',
          tier: session.tier,
          profileCompleted: session.profileCompleted,
        },
      });
    } else {
      dispatch({ type: "SET_LOADED" });
    }
  }, []);

  const login = (identifier: string, eligible: boolean, name?: string, role?: string, extra?: Record<string, any>) => {
    dispatch({
      type: "LOGIN",
      payload: {
        identifier,
        eligible,
        name,
        role: (role as any) || 'DONOR',
        profileCompleted: extra?.profileCompleted,
        ...extra,
      },
    });
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
