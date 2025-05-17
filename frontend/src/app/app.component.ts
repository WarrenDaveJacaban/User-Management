// frontend/src/app/app.component.ts (Vercel-safe implementation)
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from './_services/account.service';
import { Account, Role } from './_models';
import { environment } from '../environments/environment';

@Component({
  selector: 'app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
  Role = Role;
  account: Account | null;
  apiEndpoint = environment.apiUrl;
  detectedEnv = environment.detectedEnvironment;
  isProduction = environment.production;
  isAdminRoute = false;

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.account.subscribe(x => this.account = x);
    
    // Track route changes to determine admin routes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
    });
  }

  ngOnInit() {
    // Verify authentication on app startup/refresh
    if (typeof this.accountService.verifyAuth === 'function') {
      this.accountService.verifyAuth();
    }
    
    // Log API endpoint for debugging
    if (!environment.production) {
      console.log(`Environment: ${environment.detectedEnvironment}`);
      console.log(`API Endpoint: ${environment.apiUrl}`);
    }
  }

  logout() {
    console.log('Logout triggered');
    
    // Vercel-safe implementation that doesn't rely on service methods
    // This ensures logout works even if the service method is undefined
    try {
      // Try using the service method first
      if (this.accountService && typeof this.accountService.logout === 'function') {
        this.accountService.logout();
      } else {
        // Fallback manual implementation
        this.manualLogout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      this.manualLogout();
    }
  }

  // Manual logout that doesn't depend on the service
  private manualLogout() {
    console.log('Using manual logout fallback');
    
    // Clear all authentication data
    localStorage.removeItem('account');
    localStorage.removeItem('refreshToken');
    
    // Clear cookies that might contain tokens
    this.clearAuthCookies();
    
    // Update the account subject if we can
    // Try to update the account observable if possible (even though accountSubject is private)
    if (this.accountService && typeof (this.accountService as any).accountSubject?.next === 'function') {
      try {
      (this.accountService as any).accountSubject.next(null);
      } catch (e) {
      console.error('Error updating account subject:', e);
      }
    }
    
    // Navigate to login page
    this.router.navigate(['/account/login']);
  }

  // Helper method to clear auth cookies
  private clearAuthCookies() {
    try {
      // Try to clear the refreshToken cookie
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // If deployed on a specific domain
      const domain = window.location.hostname;
      if (domain.includes('vercel.app')) {
        document.cookie = `refreshToken=; Path=/; Domain=.vercel.app; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      }
    } catch (e) {
      console.error('Error clearing cookies:', e);
    }
  }
}