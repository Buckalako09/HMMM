import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        name: name,
        email: email,
        role: 'user',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }
}
