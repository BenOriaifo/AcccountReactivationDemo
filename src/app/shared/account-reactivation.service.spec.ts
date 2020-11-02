import { TestBed } from '@angular/core/testing';

import { AccountReactivationService } from './account-reactivation.service';

describe('AccountReactivationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountReactivationService = TestBed.get(AccountReactivationService);
    expect(service).toBeTruthy();
  });
});
