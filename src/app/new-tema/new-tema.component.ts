import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-new-tema',
  templateUrl: './new-tema.component.html',
  styleUrls: ['./new-tema.component.css']
})
export class NewTemaComponent implements OnInit {
  nuevoValor: any = {
    id: '',
    ccolor: '',
    title: '',
    citas: '',
    content: ''
  };
  faus :string = "";
  datGuada : String = "";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  globalValues: { id: string, ccolor:string, title: string, citas: string, content: string }[] = [];
  firebaseService = inject(FirebaseService);
  colorsa:string[] = [];
  stringcolorsa:string[] = [];


  constructor(private sanitizer: DomSanitizer) { }

  async ngOnInit(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      order:[[1, 'desc']],
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };
    let data = await this.firebaseService.getData();
    data.forEach((doc) => {
      this.globalValues.push({
        id: doc.id,
        ccolor: doc.data()["ccolor"],
        title: doc.data()["title"],
        citas: doc.data()["citas"],
        content: doc.data()["content"]
      });
      if(doc.data()["ccolor"] != undefined)
        this.colorsa.push(doc.data()["ccolor"]);
    });
    this.stringcolorsa = this.colorsa.filter((string, i, arr) => arr.findIndex(t => t === string) === i);

    this.dtTrigger.next(null);
  }

  guardarValorGlobal() {
    this.datGuada = "";
    this.firebaseService.guardarDatosEnFirebase(this.nuevoValor)
      .then((response: any) => {
        let vlasi ="guardados";
        if(this.nuevoValor.id != '')
          vlasi ="modificados"
        this.datGuada = "Datos " + vlasi + " con éxito en Firebase";
        this.nuevoValor = {
          id: '',
          ccolor: '',
          title: '',
          citas: '',
          content: ''
        };
        window.location.reload();
      })
      .catch((error: any) => {
        console.error('Error al guardar los datos en Firebase:', error);
        this.datGuada = "";
      });
  }

  editarItem(item:any){
    this.nuevoValor = {
      id: item.id,
      ccolor: item.ccolor,
      title: item.title,
      citas: item.citas,
      content: item.content
    };
  }
  asinColor(){
    this.nuevoValor = {
      id: this.nuevoValor.id,
      ccolor: this.faus,
      title: this.nuevoValor.title,
      citas: this.nuevoValor.citas,
      content: this.nuevoValor.content
    };
  }

  deleteItem(item:any){
    console.log(item);
    this.firebaseService.deleteItem(item);
    window.location.reload();
  }
}
