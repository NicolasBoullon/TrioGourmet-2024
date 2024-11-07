import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'clase-04',
        appId: '1:370486161236:web:66904594150219f6fe22c1',
        storageBucket: 'clase-04.appspot.com',
        apiKey: 'AIzaSyB9PaP9DO4MSrTX_niLx9DMQaqGywyLufQ',
        authDomain: 'clase-04.firebaseapp.com',
        messagingSenderId: '370486161236',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    {
      provide: FIREBASE_OPTIONS,
      useValue: {
        projectId: 'clase-04',
        appId: '1:370486161236:web:66904594150219f6fe22c1',
        storageBucket: 'clase-04.appspot.com',
        apiKey: 'AIzaSyB9PaP9DO4MSrTX_niLx9DMQaqGywyLufQ',
        authDomain: 'clase-04.firebaseapp.com',
        messagingSenderId: '370486161236',
      },
    },
  ],
});
