import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import FindCare from "./pages/FindCare";

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [view, setView] = useState<"home" | "assessment" | "care">("home");

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          {view === "home" && <Home onStart={() => setView("assessment")} onFindCare={() => setView("care")} />}
          {view === "assessment" && <Assessment onBack={() => setView("home")} />}
          {view === "care" && <FindCare onBack={() => setView("home")} />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
