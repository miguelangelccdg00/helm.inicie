import { TestBed } from '@angular/core/testing';

import { StoreSolucionesService } from './store-soluciones.service';

describe('StoreSolucionesService', () => {
  let service: StoreSolucionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreSolucionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
