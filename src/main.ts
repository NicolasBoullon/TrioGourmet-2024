import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"triogourmetpps","appId":"1:107493929792:web:143ece4e0ec2319fc880a5","storageBucket":"triogourmetpps.firebasestorage.app","apiKey":"AIzaSyDgy98WJ7ovyGUBE0hNeyTeOSuBdGPCiVE","authDomain":"triogourmetpps.firebaseapp.com","messagingSenderId":"107493929792"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
