import { convertImageToBase64 } from '../../helpers/visualization-image-utils';

describe('VisualizationImageUtils', () => {
  describe('convertImageToBase64', () => {
    it('should convert image to base64', async () => {
      const mockImage = {
        ArrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8)))
      };
      const result = await convertImageToBase64(mockImage);
      expect(result).toEqual('AAAAAAAAAAA=');
    });
  });
});
