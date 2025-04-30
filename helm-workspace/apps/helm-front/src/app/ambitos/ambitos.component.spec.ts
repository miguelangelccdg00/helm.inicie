import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmbitosComponent } from './ambitos.component';

describe('AmbitosComponent', () => {
  let component: AmbitosComponent;
  let fixture: ComponentFixture<AmbitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbitosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AmbitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
