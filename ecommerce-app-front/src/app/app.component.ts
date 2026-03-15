import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce-app-front';
  private readonly router = inject(Router);

  readonly isAuthRoute = signal(this.isAuthPath(this.router.url ?? ''));

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAuthRoute.set(this.isAuthPath((event as NavigationEnd).urlAfterRedirects));
      });
  }

  private isAuthPath(url: string): boolean {
    return url.startsWith('/login') || url.startsWith('/register');
  }
}
