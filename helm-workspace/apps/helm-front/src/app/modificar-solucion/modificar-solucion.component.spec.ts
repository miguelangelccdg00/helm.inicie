import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarSolucionComponent } from './modificar-solucion.component';

describe('ModificarSolucionComponent', () => {
  let component: ModificarSolucionComponent;
  let fixture: ComponentFixture<ModificarSolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarSolucionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarSolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
