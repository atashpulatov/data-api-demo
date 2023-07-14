import scriptInjectionHelper from '../../../embedded/utils/script-injection-helper';

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

  it('should check if isLoginPage returns true for loginPage', () => {
    // given
    const contentDocument = {
      URL: 'https://MicroStrategyLibrary/embeddedTest/embeddedLogin.jsp'
    };
    // when
    const isLoginPage = scriptInjectionHelper.isLoginPage(contentDocument);
    // then
    expect(isLoginPage).toBe(true);
  });

  it('should check if isLoginPage returns false for dossierPage', () => {
    // given
    const contentDocument = {
      URL: 'https://MicroStrategyLibrary/embeddedTest/dossierPage.jsp'
    };
    // when
    const isLoginPage = scriptInjectionHelper.isLoginPage(contentDocument);
    // then
    expect(isLoginPage).toBe(false);
  });

  it('should focus on Table Data element when overlay is present', () => {
    // given
    const promptEditorContainerElement = document.createElement('div');
    const tableDataElement = document.createElement('td');
    const focusEvent = {
      target: {
        contentDocument: {
          getElementsByClassName: jest.fn(() => [promptEditorContainerElement]),
          getElementsByTagName: jest.fn(() => [tableDataElement])
        }
      }
    };
    const focusSpy = jest.spyOn(tableDataElement, 'focus');
    // when
    scriptInjectionHelper.switchFocusToElementOnWindowFocus(focusEvent);
    // then
    expect(focusSpy).toBeCalledTimes(1);
  });

  it('should focus on Table of Contents element when overlay is absent', () => {
    // given
    const tableOfContentsElement = document.createElement('div');
    const focusEvent = {
      target: {
        contentDocument: {
          getElementsByClassName: jest.fn((className) => (
            className === 'mstrd-PromptEditorContainer-overlay' ? [] : [tableOfContentsElement]
          ))
        }
      }
    };
    const focusSpy = jest.spyOn(tableOfContentsElement, 'focus');
    // when
    scriptInjectionHelper.switchFocusToElementOnWindowFocus(focusEvent);
    // then
    expect(focusSpy).toBeCalledTimes(1);
  });
});
