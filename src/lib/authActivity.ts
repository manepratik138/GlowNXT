import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { localDb } from "@/lib/localStore";

export type LoginMethod = "email" | "phone" | "local-demo";

export interface LoginActivityInput {
  userId: string;
  email?: string | null;
  phone?: string;
  method: LoginMethod;
  role?: string;
}

export async function recordLoginActivity(input: LoginActivityInput): Promise<void> {
  const activity = {
    userId: input.userId,
    email: input.email || "",
    phone: input.phone || "",
    method: input.method,
    role: input.role || "customer",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : "server",
    createdAt: new Date().toISOString(),
  };

  if (db) {
    await addDoc(collection(db, "loginActivity"), activity);
  } else {
    localDb.setDoc("loginActivity", `login_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, activity);
  }
}