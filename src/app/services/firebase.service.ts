import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {}
  firestore: Firestore = inject(Firestore)

  // Método para guardar datos en Firebase Firestore
  async guardarDatosEnFirebase(data: any) {
    if(data.id == ''){
      return await addDoc(collection(this.firestore,'equiposvp'), {
        ccolor : (data.ccolor == '' ? '#FFFFFFF' : data.ccolor),
        title : data.title,
        citas : data.citas,
        content : data.content
      });
    }
    else{
      return await updateDoc(doc(this.firestore,'equiposvp', data.id), {
        ccolor : (data.ccolor == '' ? '#FFFFFFF' : data.ccolor),
        title : data.title,
        citas : data.citas,
        content : data.content
      });
    }
  }

  async getData(){
    const ref = collection(this.firestore,'equiposvp');
    return await getDocs(ref);
  }

  async deleteItem(item: string){
    await deleteDoc(doc(this.firestore, "equiposvp", item));
  }
}
