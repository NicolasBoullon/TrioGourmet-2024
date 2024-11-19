import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonButton,
  IonText,
  IonItem,
  IonRadio,

} from '@ionic/angular/standalone';
import { NotificationService } from 'src/app/core/services/notification.service';
import { DatabaseService } from 'src/app/core/services/database.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HeaderComponent } from "../../shared/header/header.component";
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-crear-encuesta',
  templateUrl: './crear-encuesta.page.html',
  styleUrls: ['./crear-encuesta.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    ReactiveFormsModule,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonButton,
    IonItem,
    IonRadio,
    CommonModule,
    HeaderComponent,
],
})
export class CrearEncuestaPage {

  private _notificationService = inject(NotificationService);
  private _databaseService = inject(DatabaseService);
  private _storageService = inject(StorageService);
  
  protected imageSelected: Blob[] = [];
  protected imagePreviewUrls: string[] = [];

  protected form = new FormGroup({
    calificacionGeneral: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    calidadComida: new FormControl<string | null>(null, [Validators.required]),
    tiempoEspera: new FormControl<string | null>(null, [Validators.required]),
    amabilidadPersonal: new FormControl<string | null>(null, [Validators.required]),
    limpieza: new FormArray<FormControl<string>>([], [Validators.required]),
  });

  toggleCheckbox(event: any, value: string): void {
    const limpiezaArray = this.form.get('limpieza') as FormArray;
  
    if (event.detail.checked) {
      limpiezaArray.push(new FormControl(value));
    } else {
      const index = limpiezaArray.controls.findIndex(
        (control) => control.value === value
      );
      if (index >= 0) {
        limpiezaArray.removeAt(index);
      }
    }
  
    this.form.controls.limpieza.setValue(limpiezaArray.value);
  }
  
  constructor() {}

  async submit(): Promise<void> {
    if (this.form.valid) {
      await this._notificationService.presentLoading('Guardando encuesta...', 1500);
      try {
        const encuestaData = await this.saveFormData();
        await this._notificationService.presentToast(
          '¡Encuesta registrada exitosamente!',
          2000,
          'success',
          'top'
        );
        this.form.reset();
        this.imagePreviewUrls = [];
        console.log('Encuesta registrada:', encuestaData);
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

  protected async saveFormData(): Promise<any> {
    const formData = this.form.value;

    const imageUrls = await Promise.all(
      this.imageSelected.map((imageBlob, index) =>
        this.uploadImage(imageBlob, 'encuestas', `foto-${Date.now()}-${index}`)
      )
    );

    const encuestaData = {
      fecha: new Date().toISOString(),
      calificacionGeneral: formData.calificacionGeneral,
      calidadComida: formData.calidadComida,
      tiempoEspera: formData.tiempoEspera,
      amabilidadPersonal: formData.amabilidadPersonal,
      limpieza: formData.limpieza,
      fotos: imageUrls,
    };

    await this._databaseService.setDocument(
      'encuestas',
      encuestaData,
      `encuesta-${Date.now()}`
    );

    return encuestaData;
  }

  protected async uploadImage(fileBlob: Blob, collection: string, id: string): Promise<string> {
    return await this._storageService.uploadImage(fileBlob, collection, id);
  }

  protected async addPicture(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    if (image.webPath) {
      this.imagePreviewUrls.push(image.webPath);
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      this.imageSelected.push(blob);
    }
  }

}
