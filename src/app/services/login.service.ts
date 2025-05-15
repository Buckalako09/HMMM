import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private session = inject(SessionService);

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user)
        throw new Error('Bejelentkezés sikertelen: nincs felhasználó.');

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('A felhasználó Firestore rekordja nem található.');
      }

      const userData = userDocSnap.data() as {
        role: string;
        name?: string;
        email?: string;
      };

      this.session.setUserSession({
        uid: user.uid,
        email: user.email || '',
        name: userData.name || '',
        role: userData.role || 'user',
      });
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      throw error;
    }
  }
}
