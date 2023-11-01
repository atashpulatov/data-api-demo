import React from 'react';
import { render } from '@testing-library/react';
import { DossierWindowTitle } from '../../../embedded/dossier/dossier-window-title';

describe('DossierWindowTitle', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with import message', () => {
    // given
    const props = { isReprompt: false, isEdit: false, index: 0, total: 0, dossierName: 'dossierName', };
    // when
    const componentWrapper = render(<DossierWindowTitle {...props} />);
    // then
    const paragraph = componentWrapper.getAllByText(`Import Dossier > ${props.dossierName}`);
    expect(paragraph).toBeDefined();
  });

  it('should render with edit message', () => {
    // given
    const props = { isReprompt: false, isEdit: true, index: 0, total: 0, dossierName: 'dossierName', };
    // when
    const componentWrapper = render(<DossierWindowTitle {...props} />);
    // then
    const paragraph = componentWrapper.getAllByText(`Edit Dossier > ${props.dossierName}`);
    expect(paragraph).toBeDefined();
  });

  it('should render single reprompt message', () => {
    // given
    const props = { isReprompt: true, isEdit: false, index: 0, total: 1, dossierName: 'dossierName', };
    // when
    const componentWrapper = render(<DossierWindowTitle {...props} />);
    // then
    const paragraph = componentWrapper.getAllByText(`Reprompt > ${props.dossierName}`);
    expect(paragraph).toBeDefined();
  });

  it('should render multiple reprompt message', () => {
    // given
    const props = { isReprompt: true, isEdit: false, index: 1, total: 2, dossierName: 'dossierName', };
    // when
    const componentWrapper = render(<DossierWindowTitle {...props} />);
    // then
    const paragraph = componentWrapper.getAllByText(`Reprompt ${props.index} of ${props.total} > ${props.dossierName}`);
    expect(paragraph).toBeDefined();
  });
});
