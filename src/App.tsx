import Gridbackground from "./components/Gridbackground";
import { PixelatedCanvas } from "./components/PixelatedCanvas";
import SetupForm from "./components/SetupForm";
import cxlogo from "./assets/cxlogo.png";
import { Button } from "./components/Button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./store";
import { useEffect } from "react";

function App() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "theme-light");
  }, []);

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  const themeStateMachine = (theme: "theme-light" | "dark" | "system") => {
    setTheme(theme);
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <Gridbackground text="" />
      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform">
        <PixelatedCanvas
          src={cxlogo}
          width={400}
          height={400}
          cellSize={3}
          dotScale={0.9}
          shape="square"
          backgroundColor="#000000"
          dropoutStrength={0.4}
          interactive
          distortionStrength={3}
          distortionRadius={80}
          distortionMode="attract"
          followSpeed={0.2}
          jitterStrength={4}
          jitterSpeed={4}
          sampleAverage
          tintColor="#FFFFFF"
          tintStrength={0.2}
          className="rounded-xl border border-neutral-800 shadow-lg"
        />
      </div>
      <SetupForm />
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 lg:bottom-8 lg:right-8 z-50 flex space-x-2">
        <Button
          onClick={() =>
            themeStateMachine(theme === "dark" ? "theme-light" : "dark")
          }
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200 "
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : theme === "theme-light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default App;
