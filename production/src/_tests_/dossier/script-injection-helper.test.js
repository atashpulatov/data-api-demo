import scriptInjectionHelper from '../../dossier/script-injection-helper';

describe('ScriptInjectionHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call all expected methods on applyFile invocation if contentDocument is a truthy', () => {
    // given
    const contentDocument = {
      createElement: jest.fn().mockReturnValue({ src: 'http://localhost/' }),
      head: {
        insertBefore: jest.fn(),
        getElementsByTagName: jest.fn().mockReturnValue(['title']),
      }
    };
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');

    // when
    scriptInjectionHelper.applyFile(contentDocument, 'relativePath');

    // then
    expect(scriptInjectionHelper.createFileLocation).toBeCalledWith('relativePath');
    expect(scriptInjectionHelper.createFileLocation).toBeCalledTimes(1);

    expect(contentDocument.createElement).toBeCalledWith('script');
    expect(contentDocument.createElement).toBeCalledTimes(1);

    expect(contentDocument.head.getElementsByTagName).toBeCalledWith('title');
    expect(contentDocument.head.getElementsByTagName).toBeCalledTimes(1);

    expect(contentDocument.head.insertBefore).toBeCalledWith(
      contentDocument.createElement('script'),
      contentDocument.head.getElementsByTagName('title')[0]
    );
    expect(contentDocument.head.insertBefore).toBeCalledTimes(1);
  });

  it('should not call createFileLocation method on applyFile invocation if contentDocument is a falsy', () => {
    // given
    const contentDocument = null;
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');

    // when
    scriptInjectionHelper.applyFile(contentDocument, 'relativePath');

    // then
    expect(scriptInjectionHelper.createFileLocation).not.toBeCalled();
  });

  it('should call all methods on applyStyle invocation if contentDocument is a truthy', () => {
    // given
    const contentDocument = {
      head: {
        appendChild: jest.fn(),
      }
    };
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');
    jest.spyOn(document, 'createElement').mockReturnValue({});

    // when
    scriptInjectionHelper.applyStyle(contentDocument, 'relativePath');

    // then
    expect(scriptInjectionHelper.createFileLocation).toBeCalledWith('relativePath');
    expect(scriptInjectionHelper.createFileLocation).toBeCalledTimes(1);

    expect(document.createElement).toBeCalledWith('link');
    expect(document.createElement).toBeCalledTimes(1);

    expect(contentDocument.head.appendChild).toBeCalledWith(
      document.createElement()
    );
    expect(contentDocument.head.appendChild).toBeCalledTimes(1);
  });

  it('should not call createFileLocation method on applyStyle invocation if contentDocument is a falsy', () => {
    // given
    const contentDocument = null;
    jest.spyOn(scriptInjectionHelper, 'createFileLocation');

    // when
    scriptInjectionHelper.applyStyle(contentDocument, 'relativePath');

    // then
    expect(scriptInjectionHelper.createFileLocation).not.toBeCalled();
  });
});
