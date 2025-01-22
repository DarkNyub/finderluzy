import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Time } from '@angular/common';

@Component({
  selector: 'app-new-tema',
  templateUrl: './new-tema.component.html',
  styleUrls: ['./new-tema.component.css']
})
export class NewTemaComponent implements OnInit {
  currentDate = new Date();
  formattedDate = `${this.currentDate.getDate().toString().padStart(2, '0')}/${(this.currentDate.getMonth() + 1).toString().padStart(2, '0')}/${this.currentDate.getFullYear()}`;
  nuevoValor: any = {
    id: '',
    nombreEquipo: '',
    depto: 'audiovisuales',
    fechaRegistro: this.formattedDate,
    horaRegistro: new Date().toLocaleTimeString(),
    estado: '',
    recibidoPor: '', // Puedes asignar un valor predeterminado o vacío
    entregadoPor: '', // Lo mismo para entregadoPor
    firmaRecibidoPor: '', // Firma en formato string (base64 o vacío si no está disponible)
    firmaEntregadoPor: '', // Firma en formato string (base64 o vacío si no está disponible)
    observaciones: '' // Puedes asignar un valor por defecto si es necesario
  };
  faus :string = "";
  datGuada : String = "";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  globalValues: { id: string,
                  nombreEquipo: string,
                  depto: string,
                  fechaRegistro: Date,
                  horaRegistro: String,
                  estado: string,
                  recibidoPor :string,
                  entregadoPor: string,
                  firmaRecibidoPor: string,
                  firmaEntregadoPor:string,
                  observaciones:string
                }[] = [];
  firebaseService = inject(FirebaseService);

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
        nombreEquipo: doc.data()["nombreEquipo"],
        depto: doc.data()["depto"],
        fechaRegistro: doc.data()["fechaRegistro"],
        horaRegistro: doc.data()["horaRegistro"],
        estado: doc.data()["estado"],
        recibidoPor: "", // Puedes asignar un valor predeterminado o vacío
        entregadoPor: "", // Lo mismo para entregadoPor
        firmaRecibidoPor: "", // Firma en formato string (base64 o vacío si no está disponible)
        firmaEntregadoPor: "", // Firma en formato string (base64 o vacío si no está disponible)
        observaciones: "" // Puedes asignar un valor por defecto si es necesario
      });
    });

    this.dtTrigger.next(null);
  }

  // Método para inicializar la capacidad de dibujar
  ngAfterViewInit(): void {
    this.configurarCanvas('firmaRecibidoPor');
    this.configurarCanvas('firmaEntregadoPor');
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
  guardarFirma(idCanvas: string): void {
    const canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
    const dataURL = canvas.toDataURL(); // Captura la imagen en base64
    if (idCanvas === 'firmaRecibidoPor') {
      this.nuevoValor.firmaRecibidoPor = dataURL; // Almacena la firma en el modelo
    } else if (idCanvas === 'firmaEntregadoPor') {
      this.nuevoValor.firmaEntregadoPor = dataURL;
    }
  }

  limpiarFirma(idCanvas: string): void {
    const canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el área del canvas
    }
  }

  private configurarCanvas(idCanvas: string): void {
    const canvas = document.getElementById(idCanvas) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    let dibujando = false;

    // Detectar eventos tanto para desktop como para móvil
    canvas.addEventListener('mousedown', iniciarDibujo);
    canvas.addEventListener('mouseup', detenerDibujo);
    canvas.addEventListener('mouseout', detenerDibujo);
    canvas.addEventListener('mousemove', dibujar);

    // Agregar eventos táctiles para móviles
    canvas.addEventListener('touchstart', iniciarDibujo, { passive: false });
    canvas.addEventListener('touchend', detenerDibujo, { passive: false });
    canvas.addEventListener('touchmove', dibujar, { passive: false });

    function iniciarDibujo(e: MouseEvent | TouchEvent): void {
      e.preventDefault();
      dibujando = true;
    }

    function detenerDibujo(): void {
      dibujando = false;
      ctx?.beginPath(); // Restablecer la ruta del dibujo
    }

    function dibujar(e: MouseEvent | TouchEvent): void {
      if (dibujando && ctx) {
        let x: number = 0, y: number = 0;
        if (e instanceof MouseEvent) {
          const rect = canvas.getBoundingClientRect();
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        } else if (e instanceof TouchEvent) {
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          x = touch.clientX - rect.left;
          y = touch.clientY - rect.top;
        }
         // Asegurarse de que x y y estén definidos antes de usarlos
         if (x !== undefined && y !== undefined) {
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#000';
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      }
    }
  }
}
