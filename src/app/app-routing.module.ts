import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NewTemaComponent } from './new-tema/new-tema.component';
import { ResultadosTemaComponent } from './resultados-tema/resultados-tema.component';

// Define las rutas de la aplicación
const routes: Routes = [
  { path: 'new-tema', component: NewTemaComponent },
  { path: 'resultados-tema', component: ResultadosTemaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
