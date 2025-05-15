import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly storageKey = 'user';

  setUserSession(user: {
    uid: string;
    email: string;
    name: string;
    role: string;
  }): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  getUserSession(): {
    uid: string;
    email: string;
    name: string;
    role: string;
  } | null {
    const stored = sessionStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  clearUserSession(): void {
    sessionStorage.removeItem(this.storageKey);
  }
}
