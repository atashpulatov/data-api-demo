import { convertImageToBase64, convertPointsToPixels } from '../../helpers/visualization-image-utils';

describe('VisualizationImageUtils', () => {
  describe('convertImageToBase64', () => {
    it('should convert image to base64', async () => {
      const mockImage = {
        arrayBuffer: jest.fn().mockImplementation(() => Promise.resolve(new ArrayBuffer(8)))
      };
      const result = await convertImageToBase64(mockImage);
      expect(result).toEqual('AAAAAAAAAAA=');
    });
  });

  describe('convertPointsToPixels', () => {
    it('should convert points to pixels', () => {
      const result1 = convertPointsToPixels(123);
      expect(result1).toEqual(163.959);

      const result2 = convertPointsToPixels();
      expect(result2).toEqual(undefined);
    });
  });
});
