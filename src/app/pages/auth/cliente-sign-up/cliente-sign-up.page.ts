import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonLabel,
  IonInput,
  IonIcon,
  IonItem,
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { addIcons } from 'ionicons';
import {
  camera,
  cameraOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  logInOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  qrCodeOutline,
} from 'ionicons/icons';
import { Usuario } from 'src/app/core/models/usuario.models';
import { StorageService } from 'src/app/core/services/storage.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { PersonaCredenciales } from 'src/app/core/models/personaCredenciales.models';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router, RouterLink } from '@angular/router';
import { ApiRequestService } from 'src/app/core/services/api-request.service';

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
    CommonModule,
    RouterLink
  ],
})
export class ClienteSignUpPage {
  private _authService = inject(AuthService);
  private _notificationService = inject(NotificationService);
  private _storageService = inject(StorageService);
  private _databaseService = inject(DatabaseService);
  private _apiRequestService = inject(ApiRequestService); 

  protected showPassword: boolean = false;
  protected imageSelected?: Blob;
  protected imagePreviewUrl: string | null = null;

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern('^[a-zA-Z ]+$'),
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z ]+$'),
    ]),
    dni: new FormControl('', [
      Validators.required,
      Validators.min(10000000),
      Validators.max(100000000),
      Validators.pattern('^[0-9]+$'),
    ]),
    image: new FormControl('', [Validators.required]),
    perfil: new FormControl('cliente')
  });

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

  showOrHidePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Creando cuenta...', 1500);
      try {
        const {name, apellido} = this.form.value
        await this._authService.signUp(this.form.value as PersonaCredenciales);
        await this.saveFormData();
        
        await this._notificationService.showConfirmAlert(
          '¡Registro exitoso!',
          'La cuenta se encuentra pendiente de aprobación. Por favor, espera a que un dueño o supervisor te apruebe.',
          'Aceptar',
          () => {
            this._apiRequestService.notifyRole(`Cliente en espera de aprobación`, `${name} ${apellido} se encuentra en estado de espera. Únase para gestionar la solicitud.`, 'propietario').subscribe();
            this._notificationService.routerLink('/login')
          }
        );

        this.form.reset();
      }
      catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.presentToast(
            '¡Error: El correo ya está registrado!',
            2000,
            'danger',
            'middle'
          );
        } 
        else {
          this._notificationService.presentToast(
            '¡Error: No se pudo crear la cuenta!',
            2000,
            'danger',
            'middle'
          );
        }
      }
      finally {
        this._notificationService.dismissLoading();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected async saveFormData(): Promise<void> {
    const formData = { ...this.form.value };

    const clienteData: Usuario = {
      email: formData.email ?? '',
      password: formData.password ?? '',
      name: formData.name ?? '',
      apellido: formData.apellido ?? '',
      dni: formData.dni ?? '',
      image: formData.image ?? '',
      perfil: formData.perfil ?? '',
      estadoAprobacionCuenta: 'pendiente'
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
      clienteData.email!
    );
  }

  protected async loadImage(
    fileBlob: Blob,
    collection: string,
    data: Usuario
  ): Promise<string> {

    // DEVUELVE LA URL DE LA IMAGEN.
    return await this._storageService.uploadImage(
      fileBlob,
      collection,
      data.email!
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

  protected async scanDNI(): Promise<void>
  {
    const { barcodes } = await BarcodeScanner.scan();
    const dniCliente = barcodes[0].rawValue;

    if (!dniCliente)
      return;
    
    const datosCliente : Array<string> = dniCliente.split('@');

    const fullName = this.capitalizeText(datosCliente[2]);
    const fullApellido = this.capitalizeText(datosCliente[1]);

    this.form.patchValue({
      apellido: fullApellido,
      name: fullName,
      dni: datosCliente[4]
    });

  }

  protected capitalizeText(text: string): string {
    const words = text.split(" ");
    const capitalizedWords = words.map((word) => this.capitalizeWord(word));
    return capitalizedWords.join(" ");
  }

  protected capitalizeWord(word: string) : string
  {
    const capitalizeWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return capitalizeWord;
  }
}
