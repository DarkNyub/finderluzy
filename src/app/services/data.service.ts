import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Variable para almacenar valores globales como un array de objetos
  public globalValues: { title: string, content: string }[] = [];

  constructor() { }
}
