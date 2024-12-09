import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/contexts/theme";
import { Header } from "./pages/Header";
import { Router } from "./Router";
import { Toaster } from "./components/ui/sonner";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey='vite-ui-theme' >
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>

      <Toaster />
    </ThemeProvider>
  )
}