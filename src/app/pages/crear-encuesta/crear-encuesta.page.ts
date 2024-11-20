import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HeaderComponent } from "../../shared/header/header.component";
import { StorageService } from 'src/app/core/services/storage.service';
import { IonicModule } from '@ionic/angular';
import { Encuesta } from 'src/app/core/models/encuesta.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Unsubscribe, User } from '@angular/fire/auth';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-crear-encuesta',
  templateUrl: './crear-encuesta.page.html',
  styleUrls: ['./crear-encuesta.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FormsModule,
    CommonModule,
    IonicModule
  ],
})
export class CrearEncuestaPage {
  
  private authSubscription?: Unsubscribe;
  private authService = inject(AuthService);
  private _notificationService = inject(NotificationService);
  private _databaseService = inject(DatabaseService);
  private _storageService = inject(StorageService);
  private _router = inject(Router);

  protected imagesSelected: Array<Blob> = [];
  protected imagePreviewUrls: Array<string> = [];
  user: any;
  userDoc: any;

  ngOnInit() {
    this.authSubscription = this.authService.auth.onAuthStateChanged((user: User | null) => {
      this.user = user;
      // if (this.user) {
      //   this._databaseService.getDocumentById('usuarios', this.user.email!).subscribe(res => {
      //     this.userDoc = res;
      //   });
      // }
    })
  }
  protected form = new FormGroup({
    calificacionGeneral: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    calidadComida: new FormControl<string | null>(null, [Validators.required]),
    tiempoEspera: new FormControl<string | null>(null, [Validators.required]),
    amabilidadPersonal: new FormControl<string | null>(null, [Validators.required]),
    limpieza: new FormArray([
      new FormControl(false), // Mesas
      new FormControl(false), // Pisos
      new FormControl(false), // Baños
    ]),
    fotos: new FormArray([], [Validators.required])
  });

  toggleCheckbox(event: any, value: string): void {
    const limpiezaArray = this.form.get('limpieza') as FormArray;
  
    const index = ['Mesas', 'Pisos', 'Baños'].indexOf(value);
    if (index >= 0) {
      limpiezaArray.at(index).setValue(event.detail.checked);
    }
  }
  
  constructor() {}

  async submit(): Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Guardando encuesta...', 1500);
      try {
        await this.saveFormData();
        await this._databaseService.updateDocumentField('usuarios', this.user.email, 'realizoEncuesta', true)
        await this._notificationService.presentToast(
          '¡Encuesta registrada exitosamente!',
          2000,
          'success',
          'top'
        );
        this.form.reset();
        this.imagePreviewUrls = [];
        this._router.navigateByUrl('encuesta', { replaceUrl: true });
      } catch (error) {
        this._notificationService.presentToast(
          'Error al guardar la encuesta. Intente nuevamente.',
          2000,
          'danger',
          'middle'
        );
      } finally {
        this._notificationService.dismissLoading();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected async saveFormData(): Promise<void> {
    const formData = this.form.value;

    const encuestaData: Encuesta = {
      fecha: new Date(),
      clienteEmail: this.user.email, 
      calificacionGeneral: formData.calificacionGeneral!,
      calidadComida: formData.calidadComida!,
      tiempoEspera: formData.tiempoEspera!,
      amabilidadPersonal: formData.amabilidadPersonal!,
      limpieza: formData.limpieza as boolean[],
      fotos: this.imagePreviewUrls,
    };

    const urlImages = await this.loadImages(
      this.imagesSelected,
      'encuestas',
      encuestaData
    );

    encuestaData.fotos = urlImages;

    await this._databaseService.setDocument(
      'encuestas',
      encuestaData
    );
  }

  protected async loadImages(
    filesBlob: Blob[],
    collection: string,
    data: Encuesta
  ): Promise<string[]> {

    return await this._storageService.uploadImages(
      filesBlob,
      collection,
      data.clienteEmail! + data.fecha.toISOString()
    );
  }

  async openGallery() {  
    const result = await Camera.pickImages({
      quality: 100,
      limit: 3
    });
  
    for (const image of result.photos) {
      const imageUrl = image.webPath;
      this.imagePreviewUrls.push(imageUrl);

      const response = await fetch(imageUrl!);
      const blob = await response.blob();
  
      this.imagesSelected.push(blob);
      const fotosArray = this.form.get('fotos') as FormArray;
      fotosArray.push(new FormControl(imageUrl));
    }
  }
}
