/* eslint-disable jest/no-disabled-tests */
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

  describe('getVisualizationImage', () => {
    it.skip('should return visualization image', async () => {
      global.fetch = jest.fn(() => Promise.resolve(new Response(new ArrayBuffer(100), { status: 200, statusText: 'OK' })));
      mstrObjectRestService.reduxStore.getState = jest.fn().mockImplementation(() => ({ sessionReducer: { envUrl: 'envUrl', authToken: 'sg8lqk4gndagkv5uvcpq2k46i0' } }));
      const image = await mstrObjectRestService.getVisualizationImage('465CE4954E8676EE3CFBDEA1A1FD15D1', '29002278268140DB84A3F8630F03B497', '1185C52648C388A9D80CC2AD8D039E40', 'W56', { width: 100, height: 100 });
      expect(image).toBeDefined();
    });
    it.skip('visualization image is not found', async () => {
      global.fetch = jest.fn(() => Promise.resolve(new Response(JSON.stringify({ message: 'visualization does not exist for key W56' }), { status: 404, statusText: 'Not Found', 'Content-Type': 'application/json' })));
      mstrObjectRestService.reduxStore.getState = jest.fn().mockImplementation(() => ({ sessionReducer: { envUrl: 'envUrl', authToken: 'sg8lqk4gndagkv5uvcpq2k46i0' } }));
      await expect(mstrObjectRestService.getVisualizationImage('465CE4954E8676EE3CFBDEA1A1FD15D1', '29002278268140DB84A3F8630F03B497', '1185C52648C388A9D80CC2AD8D039E40', 'W56', { width: 100, height: 100 })).rejects.toThrow('visualization does not exist for key W56');
    });
  });
});
