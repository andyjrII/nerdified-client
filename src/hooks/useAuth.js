import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthProvider';
import db from '../utils/localBase';

const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAuth = await db.collection('auth_student').get();
      if (storedAuth.length > 0) {
        setAuth(storedAuth[0]);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [setAuth]);

  return { auth, setAuth, loading };
};

export default useAuth;
