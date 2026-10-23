import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { GithubProvider } from "./context/GithubContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

/* Home ships in the entry chunk; every other route is fetched on demand. */
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Work = lazy(() => import("./pages/Work").then((m) => ({ default: m.Work })));
const Stack = lazy(() => import("./pages/Stack").then((m) => ({ default: m.Stack })));
const Lab = lazy(() => import("./pages/Lab").then((m) => ({ default: m.Lab })));
const Arcade = lazy(() => import("./pages/Arcade").then((m) => ({ default: m.Arcade })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

/** Keeps the paper visible while a route chunk arrives. */
function PageFallback() {
  return (
    <div className="flex min-h-[62vh] flex-col items-center justify-center gap-5 px-6">
      <div className="flex items-start">
        <span className="font-script text-[52px] leading-none">AK</span>
        <span className="mark-plus font-display mt-2 text-xl leading-none">+</span>
      </div>
      <span className="loader-rule" style={{ transform: "scaleX(1)", width: 96 }} />
      <p className="micro-label">Loading</p>
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
              <Route
                path="/about"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/work"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Work />
                  </Suspense>
                }
              />
              <Route
                path="/stack"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Stack />
                  </Suspense>
                }
              />
              <Route
                path="/lab"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Lab />
                  </Suspense>
                }
              />
              <Route
                path="/arcade"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Arcade />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <Contact />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </GithubProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
