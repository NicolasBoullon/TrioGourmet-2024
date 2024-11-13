import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore = inject(AngularFirestore);
  
  constructor() { }

  public setDocument(path: string, data: any, documentId?: string) : Promise<void>
  {
    const document = documentId 
      ? this.firestore.collection(path).doc(documentId)
      : this.firestore.collection(path).doc();

    return document.set({ ...data });
  }

  public getDocument(path: string) : Observable<any>
  {
    const observable: Observable<any> = this.firestore.collection(path).valueChanges();
    return observable;
  }

  public getDocumentById(collection: string, documentId: string) : Observable<any>{
    const observable: Observable<any> = this.firestore.collection(collection).doc(documentId).valueChanges();
    return observable;
  }

  public updateDocument(collection: string, documentId: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(documentId).update({...data});
  }

  public updateDocumentField(path: string, documentId: string, field: string, value: any): Promise<void> {
    const document = this.firestore.collection(path).doc(documentId);
    return document.update({ [field]: value });
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }
}
