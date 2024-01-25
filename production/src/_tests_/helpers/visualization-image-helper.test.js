import { convertImageToBase64, convertPointsToPixels, convertPixelsToPoints } from '../../helpers/visualization-image-utils';

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
      expect(result2).toEqual(0);
    });
  });
});

describe('convertPixelsToPoints', () => {
  it('should convert pixels to points', () => {
    const result1 = convertPixelsToPoints(123);
    expect(result1).toEqual(92.25);

    const result2 = convertPixelsToPoints();
    expect(result2).toEqual(0);
  });
});
