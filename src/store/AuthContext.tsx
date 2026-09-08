/* ------------------------------------------------------------------
   Admin sign-in.

   Only the team signs in — buyers never need an account, so there is no
   sign-up anywhere in the app. An admin is created once in the Firebase
   console (Authentication → Add user), and then given a document at
   admins/{uid}. The rules check that document, so revoking someone is a
   matter of deleting one row rather than redeploying.

   `isAdmin` here only decides what the UI offers. It is not a security
   boundary — the rules are. A signed-in non-admin who forced their way to
   /admin would see an empty screen, because every read would be denied.
   ------------------------------------------------------------------ */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { getAuthed, getDb, isConfigured } from "@/lib/firebase";

interface AuthValue {
  user: User | null;
  isAdmin: boolean;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOutNow: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(!isConfigured);

  useEffect(() => {
    if (!isConfigured) return;
    let stop: (() => void) | undefined;
    let dead = false;

    void (async () => {
      const [{ onAuthStateChanged }, authed] = await Promise.all([
        import("firebase/auth"), getAuthed(),
      ]);
      if (dead) return;
      stop = onAuthStateChanged(authed, async (u) => {
        setUser(u);
        if (u) {
          try {
            const [{ doc, getDoc }, database] = await Promise.all([
              import("firebase/firestore"), getDb(),
            ]);
            setIsAdmin((await getDoc(doc(database, "admins", u.uid))).exists());
          } catch {
            setIsAdmin(false);   // a denied read means not an admin
          }
        } else {
          setIsAdmin(false);
        }
        setReady(true);
      });
    })();

    return () => { dead = true; stop?.(); };
  }, []);

  const value = useMemo<AuthValue>(() => ({
    user, isAdmin, ready,
    signIn: async (email, password) => {
      const [{ signInWithEmailAndPassword }, authed] = await Promise.all([
        import("firebase/auth"), getAuthed(),
      ]);
      await signInWithEmailAndPassword(authed, email.trim(), password);
    },
    signOutNow: async () => {
      const [{ signOut }, authed] = await Promise.all([
        import("firebase/auth"), getAuthed(),
      ]);
      await signOut(authed);
    },
  }), [user, isAdmin, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
