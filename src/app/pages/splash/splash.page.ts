import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonText } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonText]
})
export class SplashPage {
  
  constructor(private _router: Router) {
    this.reproducirAudioIniciar();
  }

  ionViewWillEnter() {
    SplashScreen.hide();
    setTimeout(() => {
      this._router.navigateByUrl('/login', { replaceUrl: true });
    }, 2000);
  }

  reproducirAudioIniciar() {
    const audio = new Audio('../../assets/audio/iniciar.mp3');
    audio.load();
    audio.play();
  }
}
