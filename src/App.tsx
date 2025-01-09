import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/header/Header";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey='vite-ui-theme' >
        <BrowserRouter>
          <Header />
          <Router />
        </BrowserRouter>

        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}