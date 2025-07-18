import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

const UserInfoContext = createContext(null);

export function UserInfoProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setJwt(token);
        } catch (err) {
          console.error("Failed to get ID token:", err);
          setJwt(null);
        }
      } else {
        setJwt(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserInfoContext.Provider value={{ user, jwt, loading }}>
      {children}
    </UserInfoContext.Provider>
  );
}

function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}

export default useUserInfo;

