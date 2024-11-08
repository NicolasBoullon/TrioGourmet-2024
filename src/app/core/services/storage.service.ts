import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);

  constructor() {}

  async uploadImage(
    image: Blob,
    collection: string,
    id: string,
  ): Promise<string> {
    const storageRef = ref(
      this.storage,
      `${collection}/${id}`
    );

    await uploadBytes(storageRef, image);

    const imageUrl: string = await getDownloadURL(storageRef);

    return imageUrl;
  }
}
