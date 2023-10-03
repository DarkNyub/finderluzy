import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosTemaComponent } from './resultados-tema.component';

describe('ResultadosTemaComponent', () => {
  let component: ResultadosTemaComponent;
  let fixture: ComponentFixture<ResultadosTemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultadosTemaComponent]
    });
    fixture = TestBed.createComponent(ResultadosTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
