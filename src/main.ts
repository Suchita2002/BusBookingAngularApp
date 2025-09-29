import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

// ✅ Only ONE bootstrapApplication call
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // makes HttpClient injectable
  ]
}).catch((err) => console.error(err));
