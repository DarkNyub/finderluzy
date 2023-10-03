import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDocs, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {}
  firestore: Firestore = inject(Firestore)

  // Método para guardar datos en Firebase Firestore
  async guardarDatosEnFirebase(data: any) {
    return await addDoc(collection(this.firestore,'entradas'), {
      title : data.title,
      content : data.content
    });
  }

  async getData(){
    const ref = collection(this.firestore,'entradas');
    return await getDocs(ref);
  }

  getDatos(){
    const referencia = collection(this.firestore, "entradas");
    let q = query(referencia);
    return collectionData(q) as unknown as Observable<any>;
  }
}