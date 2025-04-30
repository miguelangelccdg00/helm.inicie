import { TestBed } from '@angular/core/testing';

import { AmbitosService } from './ambitos.service';

describe('AmbitosService', () => {
  let service: AmbitosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbitosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
