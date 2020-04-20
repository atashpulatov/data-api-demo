import scriptInjectionHelper from '../../dossier/script-injection-helper';

describe('ScriptInjectionHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call expected all methods on applyFile invocation', () => {
    // given
    const mockContentDocument = {
      createElement: jest.fn().mockReturnValue({ src: null }),
      head: {
        insertBefore: jest.fn(),
        getElementsByTagName: jest.fn().mockReturnValue(['title']),
      }
    };
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');

    // when
    scriptInjectionHelper.applyFile(mockContentDocument, 'relativePath');

    // then
    const { createElement, head } = mockContentDocument;
    const { getElementsByTagName, insertBefore } = head;
    expect(scriptInjectionHelper.createFileLocation).toBeCalled();
    expect(createElement).toBeCalled();
    expect(getElementsByTagName).toBeCalled();
    expect(insertBefore).toBeCalled();
  });

  it('should call all methods on applyStyle invocation', () => {
    // given
    const mockContentDocument = {
      createElement: jest.fn().mockReturnValue({ src: null }),
      head: {
        appendChild: jest.fn(),
      }
    };
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');
    jest.spyOn(document, 'createElement');
    // when
    scriptInjectionHelper.applyStyle(mockContentDocument, 'relativePath');

    // then
    const { appendChild } = mockContentDocument.head;
    expect(scriptInjectionHelper.createFileLocation).toBeCalled();
    expect(document.createElement).toBeCalled();
    expect(appendChild).toBeCalled();
  });
});
