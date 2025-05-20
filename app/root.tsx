import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useNavigate,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { createContext, useEffect, useState } from "react";
import * as React from "react";
import { AuthResponse, User } from "./types";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Création du contexte d'authentification
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

function Navbar() {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
    <nav className="bg-[#CDE5D7] text-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#2D3748]">BlogIt</Link>
        <div className="flex gap-5">
          <Link to="/" className="hover:text-[#4A5568] font-medium">Accueil</Link>
          <Link to="/posts" className="hover:text-[#4A5568] font-medium">Articles</Link>
          <Link to="/contact" className="hover:text-[#4A5568] font-medium">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-[#4A5568] font-medium">Mon profil</Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }} 
                className="hover:text-[#4A5568] font-medium"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#4A5568] font-medium">Se connecter</Link>
              <Link to="/register" className="hover:text-[#4A5568] font-medium">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="bg-[#F9F7F7]">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: #BCF4DE;
            --color-secondary: #CDE5D7;
            --color-tertiary: #DED6D1;
          }
          body {
            background-color: #F9F7F7;
            color: #2D3748;
          }
        `}} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Récupérer les données d'authentification du stockage local au chargement
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.jwt);
    localStorage.setItem('token', response.jwt);
    localStorage.setItem('user', JSON.stringify(response.user));
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      token, 
      login, 
      logout 
    }}>
      <Navbar />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </AuthContext.Provider>
  );
}
