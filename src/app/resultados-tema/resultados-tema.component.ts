import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-resultados-tema',
  templateUrl: './resultados-tema.component.html',
  styleUrls: ['./resultados-tema.component.css']
})

export class ResultadosTemaComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  globalValues$!: Observable<{ title: string, content: string }[]>;
  firebaseService = inject(FirebaseService);

  ngOnInit(){
    //this.globalValues$ = this.firebaseService.getDatos();
    // let data = await this.firebaseService.getData();
    // data.forEach((doc) => {
    //   this.globalValues.push({title: doc.data()["title"], content: doc.data()["content"] });
    // });
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
