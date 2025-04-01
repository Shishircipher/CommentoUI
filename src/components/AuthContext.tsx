import { createContext, useContext, useState, useEffect, ReactNode } from "react";


interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Google OAuth Client ID
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        ux_mode: "popup", // Force traditional popup
        
        auto_select: false,
        context: "signin",
        itp_support: false, // Explicitly disable Intelligent Tracking Prevention
      });
    }
  };

  const handleCredentialResponse = (response: any) => {
    console.log("Google Sign-In Response:", response);

    const jwtToken = response.credential;
    const userData = decodeJwt(jwtToken);

    setUser(userData);
    console.log(userData)
  };

  // Decode JWT Token (Extract User Data)
  const decodeJwt = (token: string): User => {
    const base64Url = token.split(".")[1]; // Get payload (2nd part of JWT)
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);
    return {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    };
  };

 const login = () => {
    window.google.accounts.id.prompt();
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
