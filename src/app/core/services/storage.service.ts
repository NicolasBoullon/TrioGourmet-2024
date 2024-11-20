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

  async uploadImages(
    images: Blob[],
    collection: string,
    id: string
  ): Promise<string[]> {
    const imageUrls: string[] = [];
  
    for (const [index, image] of images.entries()) {
      const uniqueId = `${id}_${index}`;
      const storageRef = ref(this.storage, `${collection}/${uniqueId}`);
      
      await uploadBytes(storageRef, image);
  
      const imageUrl: string = await getDownloadURL(storageRef);
      imageUrls.push(imageUrl);
    }
  
    return imageUrls;
  }
  
}
