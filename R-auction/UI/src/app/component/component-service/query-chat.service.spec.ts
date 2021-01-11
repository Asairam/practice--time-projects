import { TestBed } from '@angular/core/testing';

import { QueryChatService } from './query-chat.service';

describe('QueryChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryChatService = TestBed.get(QueryChatService);
    expect(service).toBeTruthy();
  });
});
