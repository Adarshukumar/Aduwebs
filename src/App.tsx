import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Work } from "./pages/Work";
import { Stack } from "./pages/Stack";
import { Lab } from "./pages/Lab";
import { Arcade } from "./pages/Arcade";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { GithubProvider } from "./context/GithubContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

/** Route-level fallback that keeps the paper shell visible while a page loads. */
function PageFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <div className="flex items-start">
        <span className="font-script text-[52px] leading-none">AK</span>
        <span className="font-display mt-2 text-xl leading-none text-acid">+</span>
      </div>
      <p className="micro-label">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <GithubProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/work" element={<Work />} />
              <Route path="/stack" element={<Stack />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/arcade" element={<Arcade />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </GithubProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
