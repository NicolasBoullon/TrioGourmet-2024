import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from "../../../shared/header/header.component";
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { cameraOutline, eyeOffOutline, eyeOutline, lockClosedOutline, logInOutline, mailOutline, personAddOutline, personOutline, qrCodeOutline } from 'ionicons/icons';
import { IonicModule } from '@ionic/angular';
import { PersonaCredenciales } from 'src/app/core/models/personaCredenciales.models';


@Component({
  selector: 'app-anonimo-sign-up',
  templateUrl: './anonimo-sign-up.page.html',
  styleUrls: ['./anonimo-sign-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, ReactiveFormsModule]
})
export class AnonimoSignUpPage implements OnInit {
  private _notificationService = inject(NotificationService);
  private _storageService = inject(StorageService);
  private _databaseService = inject(DatabaseService);
  private _authService = inject(AuthService);

  protected showPassword: boolean = false;
  protected imageSelected?: Blob;
  protected imagePreviewUrl: string | null = null;

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      logInOutline,
      personOutline,
      personAddOutline,
      cameraOutline,
      qrCodeOutline,
    });
  }

  ngOnInit() {
  }

  protected form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern('^[a-zA-Z ]+$'),
    ]),
    image: new FormControl('', [Validators.required]),
    perfil: new FormControl('anonimo')
  });

  showOrHidePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
        const anonimo: PersonaCredenciales = {
          name: this.form.value.name ?? '',
          email: (this.form.value.name ?? '').replace(/\s+/g, '').toLowerCase() + "@anonimo.com",
          password: '123456',
          perfil: this.form.value.perfil ?? ''
        };

        await this._authService.signUp(anonimo);
        await this.saveFormData();
        this._notificationService.presentToast(
          '¡Cuenta creada!',
          1000,
          'success',
          'middle'
        );
        this.form.reset();
        this._notificationService.routerLink('/home');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.presentToast(
            '¡Error: El correo ya está registrado!',
            2000,
            'danger',
            'middle'
          );
        } else {
          this._notificationService.presentToast(
            '¡Error: No se pudo crear la cuenta!',
            2000,
            'danger',
            'middle'
          );
        }
      } finally {
        this._notificationService.dismissLoading();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected async saveFormData(): Promise<void> {
    const formData = { ...this.form.value };

    const clienteData: any = {
      name: formData.name ?? '',
      email: (formData.name ?? '').replace(/\s+/g, '').toLowerCase() + "@anonimo.com",
      image: formData.image ?? '',
      perfil: formData.perfil ?? ''
    };

    const urlImage = await this.loadImage(
      this.imageSelected!,
      'usuarios',
      clienteData
    );
    clienteData.image = urlImage;
    
    await this._databaseService.setDocument(
      'usuarios',
      clienteData,
      clienteData.name + '@anonimo.com'
    );
  }

  protected async loadImage(
    fileBlob: Blob,
    collection: string,
    data: any
  ): Promise<string> {

    // DEVUELVE LA URL DE LA IMAGEN.
    return await this._storageService.uploadImage(
      fileBlob,
      collection,
      data.name!
    );
  }

  protected async takePicture(): Promise<void>
  {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    if (image.webPath)
    {
      this.imagePreviewUrl = image.webPath;
      const response = await fetch(image.webPath!); 
      const blob = await response.blob(); 
      // IMAGE SELECTED ES LA IMAGEN QUE SUBO A FIRESTORE PERO LA GUARDO ACA PARA SUBIRLA SOLO CUANDO LE DE A SUBMIT.
      this.imageSelected = blob;
      // ACÁ LO PONGO PARA QUE NO DE ERROR QUE NO SUBIÓ FOTO
      this.form.get('image')?.setValue(image.webPath);
    }

  }

}
