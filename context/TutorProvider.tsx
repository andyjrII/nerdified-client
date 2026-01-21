"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Tutor {
  [key: string]: any;
}

interface TutorContextType {
  tutor: Tutor;
  setTutor: (tutor: Tutor) => void;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export const TutorProvider = ({ children }: { children: ReactNode }) => {
  const [tutor, setTutor] = useState<Tutor>({});

  return (
    <TutorContext.Provider value={{ tutor, setTutor }}>
      {children}
    </TutorContext.Provider>
  );
};

export const useTutor = () => {
  const context = useContext(TutorContext);
  if (context === undefined) {
    throw new Error("useTutor must be used within a TutorProvider");
  }
  return context;
};

export default TutorContext;
