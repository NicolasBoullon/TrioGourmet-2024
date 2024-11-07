import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonIcon, IonItem, IonButton, IonText } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { addIcons } from 'ionicons';
import { camera, cameraOutline, eyeOffOutline, eyeOutline, lockClosedOutline, logInOutline, mailOutline, personAddOutline, personOutline, qrCodeOutline } from 'ionicons/icons';


@Component({
  selector: 'app-cliente-sign-up',
  templateUrl: './cliente-sign-up.page.html',
  styleUrls: ['./cliente-sign-up.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    ReactiveFormsModule,
    IonLabel,
    IonInput,
    IonIcon,
    IonItem,
    IonButton,
    HeaderComponent,
    CommonModule
  ]
})
export class ClienteSignUpPage  {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService)

  protected showPassword: boolean = false;
  protected imageSelected?: File;
  protected imagePreviewUrl: string | null = null;

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z ]+$')]),
    apellido: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    dni: new FormControl('', [Validators.required, Validators.min(10000000), Validators.max(100000000),Validators.pattern('^[0-9]+$')]),
    image: new FormControl('', [Validators.required]),
  })

  constructor() { 
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logInOutline, personOutline, personAddOutline,cameraOutline,qrCodeOutline});
  }

  showOrHidePassword() : void {
    this.showPassword = !this.showPassword;
  }

  async submit() : Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
        await this._authService.signUp(this.form.value.email!, this.form.value.password!, this.form.value.name!);
        this._notificationService.presentToast('¡Cuenta creada!', 1000, 'success', 'middle');
        this.form.reset();
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.presentToast('¡Error: El correo ya está registrado!', 2000, 'danger', 'middle');
        } else {
          this._notificationService.presentToast('¡Error: No se pudo crear la cuenta!', 2000, 'danger', 'middle');
        }
      } finally {
        this._notificationService.dismissLoading();
      }
    }
    else
    {
      this.form.markAllAsTouched(); 
    }
  }

  uploadFile(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // IMAGE SELECTED ES LA IMAGEN QUE SUBO A FIRESTORE PERO LA GUARDO AHI PORQUE SOLO LA SUBO CUANDO LE DE A SUBMIT
      this.imageSelected = file;
      // ACÁ LO PONGO PARA QUE NO DE ERROR QUE NO SUBIÓ FOTO 
      this.form.get('image')?.setValue(file.name);
      // ACÁ PONGO VISTA PREVIA DE LA IMAGEN, NO SE COMO HACE PERO CREA UNA URL DE LA IMAGEN
      this.imagePreviewUrl = URL.createObjectURL(file);
    }
  }

  
}
