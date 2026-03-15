import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GenericService } from './generic.service';

class TestGenericService extends GenericService<unknown> {
  constructor(http: HttpClient) {
    super(http, 'test-endpoint');
  }
}

describe('GenericService', () => {
  let service: TestGenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    const http = TestBed.inject(HttpClient);
    service = new TestGenericService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});