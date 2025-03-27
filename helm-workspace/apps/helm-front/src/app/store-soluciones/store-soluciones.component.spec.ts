import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreSolucionesComponent } from './store-soluciones.component';

describe('StoreSolucionesComponent', () => {
  let component: StoreSolucionesComponent;
  let fixture: ComponentFixture<StoreSolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSolucionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreSolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
