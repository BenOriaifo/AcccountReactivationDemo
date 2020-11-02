import { TestBed } from '@angular/core/testing';

import { AccountReactivationService } from './account-reactivation.service';
import { HttpClientModule } from '@angular/common/http';



describe('AccountReactivationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule ],
  }));

  it('should be created', () => {
    const service: AccountReactivationService = TestBed.get(AccountReactivationService);
    expect(service).toBeTruthy();
  });
});
