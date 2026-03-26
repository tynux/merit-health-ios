import React, { createContext, useContext, useState, useEffect } from "react";

interface DemoUser {
  id: number;
  name: string;
  email: string;
  openId: string;
  role: "user" | "admin";
}

interface DemoUserContextType {
  demoUser: DemoUser | null;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

const DEMO_USER: DemoUser = {
  id: 999,
  name: "演示用户",
  email: "demo@merit-game.local",
  openId: "demo-user-999",
  role: "user",
};

export function DemoUserProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setDemoUser(DEMO_USER);
      // Store in localStorage for persistence
      localStorage.setItem("merit_demo_mode", "true");
      localStorage.setItem("merit_demo_user_id", DEMO_USER.id.toString());
    } else {
      setDemoUser(null);
      localStorage.removeItem("merit_demo_mode");
      localStorage.removeItem("merit_demo_user_id");
    }
  }, [isDemoMode]);

  return (
    <DemoUserContext.Provider value={{ demoUser, isDemoMode, setDemoMode: setIsDemoMode }}>
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (context === undefined) {
    throw new Error("useDemoUser must be used within DemoUserProvider");
  }
  return context;
}
