import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { jwtDecode } from 'jwt-decode';  /// Use jwtDecode instead of jwt_decode
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) { }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    // Use bracket notation to access 'expectedRole' to avoid TypeScript error
    const expectedRoleArray: string[] = router.data['expectedRole'] || [];  // Fallback to empty array if undefined

    const token: string | null = localStorage.getItem("token"); // Retrieve token from local storage

    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token); // Corrected function name
    } catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    // Check if token is expired
    if (this.isTokenExpired(tokenPayload)) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    // Check if the role matches any expected role
    const roleMatch = expectedRoleArray.includes(tokenPayload.role);

    // If the token's role matches the expected role, allow access
    if (roleMatch) {
      if (this.auth.isAuthenticated()) {
        return true;
      } else {
        this.snackBarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
        this.router.navigate(['/cafe/dashboard']);
        return false;
      }
    } else {
      this.snackBarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);
      return false;
    }
  }

  // Utility function to check if the token is expired
  private isTokenExpired(tokenPayload: any): boolean {
    if (!tokenPayload || !tokenPayload.exp) {
      return true;
    }
    const expirationDate = new Date(0); // The exp is in seconds, so we multiply by 1000
    expirationDate.setUTCSeconds(tokenPayload.exp);
    return expirationDate < new Date();
  }
}
