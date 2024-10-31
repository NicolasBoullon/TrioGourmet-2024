import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonText]
})
export class SplashPage {

  constructor(private _router: Router) {
    setTimeout(() => {
      // this._router.navigateByUrl('/login', { replaceUrl: true });
    }, 2000);
  }

}
