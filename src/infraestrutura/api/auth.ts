//npm install firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export function registrarFirebase(email: string, senha: string) {
  return createUserWithEmailAndPassword(auth, email, senha);
}

export function loginFirebase(email: string, senha: string) {
  return signInWithEmailAndPassword(auth, email, senha);
}
