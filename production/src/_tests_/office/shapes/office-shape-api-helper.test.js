import { officeShapeApiHelper } from "../../../office/shapes/office-shape-api-helper";

describe("officeShapeApiHelper", () => {
  describe("getShape", () => {
    it("should return shape", async () => {
      const mockSync = jest.fn();
      const mockLoad = jest.fn();
      const mockSheet1 = {
        shapes: {
          getItemOrNullObject: jest.fn().mockImplementation((_id) => ({
            load: mockLoad,
            isNullObject: false,
            id: "1234-5678-9012-3456",
          })),
        },
      };
      const mockSheet2 = {
        shapes: {
          getItemOrNullObject: jest.fn().mockImplementation((_id) => ({
            load: mockLoad,
            isNullObject: true,
          })),
        },
      };
      const context = {
        workbook: {
          worksheets: {
            load: mockLoad,
            items: [mockSheet1, mockSheet2],
          },
        },
        sync: mockSync,
      };

      const shape = await officeShapeApiHelper.getShape(
        context,
        "1234-5678-9012-3456"
      );
      expect(mockLoad).toBeCalled();
      expect(mockSync).toBeCalled();
      expect(shape).toBeDefined();
      expect(shape.id).toEqual("1234-5678-9012-3456");
    });
    it("should not return shape", async () => {
      const mockSync = jest.fn();
      const mockLoad = jest.fn();
      const mockSheet = {
        shapes: {
          getItemOrNullObject: jest.fn().mockImplementation((_id) => ({
            load: mockLoad,
            isNullObject: true,
          })),
        },
      };
      const context = {
        workbook: {
          worksheets: {
            load: mockLoad,
            items: [mockSheet, mockSheet],
          },
        },
        sync: mockSync,
      };
      const shape = await officeShapeApiHelper.getShape(
        context,
        "1234-5678-9012-3456"
      );
      expect(mockLoad).toBeCalled();
      expect(mockSync).toBeCalled();
      expect(shape).toBeUndefined();
    });
  });

  describe("addImage", () => {
    it("should add image", async () => {
      const mockSync = jest.fn();
      const mockAddImage = jest.fn().mockImplementation((_image) => ({
        set: jest.fn(),
        id: "1234-5678-9012-3456",
      }));
      const mockSheet = {
        shapes: {
          addImage: mockAddImage,
        },
      };
      const context = {
        sync: mockSync,
      };
      const shapeId = await officeShapeApiHelper.addImage(
        context,
        "base64PngImage",
        "Visualization 1",
        { top: 100, left: 100 },
        { height: 343.5, width: 434.56 },
        mockSheet
      );
      expect(mockAddImage).toBeCalled();
      expect(mockSync).toBeCalled();
      expect(shapeId).toEqual("1234-5678-9012-3456");
    });
  });

  describe("deleteImage", () => {
    it("should delete image", async () => {
      const mockSync = jest.fn();
      const mockLoad = jest.fn();
      const mockDelete = jest.fn();
      const mockSheet = {
        shapes: {
          getItemOrNullObject: jest.fn().mockImplementation((_id) => ({
            load: mockLoad,
            delete: mockDelete,
            isNullObject: false,
            id: "1234-5678-9012-3456",
          })),
        },
      };
      const context = {
        workbook: {
          worksheets: {
            load: mockLoad,
            items: [mockSheet, mockSheet],
          },
        },
        sync: mockSync,
      };
      await officeShapeApiHelper.deleteImage(context, "1234-5678-9012-3456");
      expect(mockLoad).toBeCalled();
      expect(mockSync).toBeCalled();
      expect(mockDelete).toBeCalled();
    });
    it("should not delete image", async () => {
      const mockSync = jest.fn();
      const mockLoad = jest.fn();
      const mockDelete = jest.fn();
      const mockSheet = {
        shapes: {
          getItemOrNullObject: jest.fn().mockImplementation((_id) => ({
            load: mockLoad,
            delete: mockDelete,
            isNullObject: true,
          })),
        },
      };
      const context = {
        workbook: {
          worksheets: {
            load: mockLoad,
            items: [mockSheet, mockSheet],
          },
        },
        sync: mockSync,
      };
      await officeShapeApiHelper.deleteImage(context, "1234-5678-9012-3456");
      expect(mockLoad).toBeCalled();
      expect(mockSync).toBeCalled();
      expect(mockDelete).not.toBeCalled();
    });
  });
});
