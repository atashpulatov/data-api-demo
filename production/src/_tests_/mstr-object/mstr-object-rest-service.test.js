import request, { Request } from 'superagent';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { reduxStore } from '../../store';

jest.mock('superagent');

describe('MstrObjectRestService', () => {
  beforeAll(() => {
    mstrObjectRestService.init(reduxStore);
  });

  it('Initialization of MstrObjectRestService should be successful', () => {
    expect(mstrObjectRestService).toBeDefined();
  });
});
