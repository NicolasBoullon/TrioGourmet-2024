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
  });

  showOrHidePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
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
      image: formData.image ?? '',
    };

    const urlImage = await this.loadImage(
      this.imageSelected!,
      'clientes',
      clienteData
    );
    clienteData.image = urlImage;

    console.log('clienteData:', clienteData);
    
    await this._databaseService.setDocument(
      'clientes',
      clienteData,
      clienteData.name!
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
