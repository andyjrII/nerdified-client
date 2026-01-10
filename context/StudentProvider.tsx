"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Student {
  [key: string]: any;
}

interface StudentContextType {
  student: Student;
  setStudent: (student: Student) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student>({});

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};

export default StudentContext;
