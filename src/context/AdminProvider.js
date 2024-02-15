import { createContext, useState } from "react";

const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState({});

  return (
    <AdminContext.Provider
      value={{
        admin,
        setAdmin
      }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
