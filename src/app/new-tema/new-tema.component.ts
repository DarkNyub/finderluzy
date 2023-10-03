import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-new-tema',
  templateUrl: './new-tema.component.html',
  styleUrls: ['./new-tema.component.css']
})
export class NewTemaComponent implements OnInit {
  nuevoValor: any = {
    title: '',
    content: ''
  };
  datGuada : String = "";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  globalValues: { title: string, content: string }[] = [];
  firebaseService = inject(FirebaseService);

  async ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    let data = await this.firebaseService.getData();
    data.forEach((doc) => {
      this.globalValues.push({title: doc.data()["title"], content: doc.data()["content"] });
    });
    this.dtTrigger.next(null);
  }

  guardarValorGlobal() {
    this.datGuada = "";
    this.firebaseService.guardarDatosEnFirebase(this.nuevoValor)
      .then((response: any) => {
        console.log('Datos guardados con éxito en Firebase:', response);
        this.datGuada = "Datos guardados con éxito en Firebase";
        this.nuevoValor = {
          title: '',
          content: ''
        };
        window.location.reload();
      })
      .catch((error: any) => {
        console.error('Error al guardar los datos en Firebase:', error);
        this.datGuada = "";
      });
  }
}
