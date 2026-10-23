import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fallbackData, loadGithub, syncGithub, type GithubData } from "../lib/github";

type Status = "loading" | "ready" | "error";

interface GithubValue {
  data: GithubData;
  status: Status;
  syncing: boolean;
  resync: () => Promise<void>;
  lastSync: number;
}

const GithubContext = createContext<GithubValue | null>(null);

export function GithubProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GithubData>(() => fallbackData());
  const [status, setStatus] = useState<Status>("loading");
  const [syncing, setSyncing] = useState(false);

  const fetchProfile = useCallback(async (force = false) => {
    setSyncing(true);
    try {
      const result = force ? await syncGithub() : await loadGithub();
      setData(result);
      setStatus(result.live ? "ready" : "error");
    } catch {
      setData(fallbackData());
      setStatus("error");
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Deferred a microtask so the first paint is never blocked by the fetch
    // handshake (and so the effect body stays free of synchronous setState).
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void fetchProfile(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const resync = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  const value = useMemo(
    () => ({ data, status, syncing, resync, lastSync: data.syncedAt }),
    [data, status, syncing, resync]
  );

  return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>;
}

export function useGithub(): GithubValue {
  const ctx = useContext(GithubContext);
  if (!ctx) throw new Error("useGithub must be used inside <GithubProvider>");
  return ctx;
}
