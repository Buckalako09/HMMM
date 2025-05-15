import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from './session.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sessionService: SessionService, private router: Router) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.sessionService.getUserSession();

    if (user && user.role === 'admin') {
      return true;
    }

    alert('Nincs jogosultsága az oldal megtekintéséhez');
    return this.router.createUrlTree(['/login']);
  }
}
