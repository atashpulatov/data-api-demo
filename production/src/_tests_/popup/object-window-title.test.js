import React from 'react';
import { render } from '@testing-library/react';
import { ObjectWindowTitle } from '../../popup/object-window-title/object-window-title';

describe('PromptsWindowTitleNotConnected', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Report | Should render import title with props given', () => {
    // given showLoading, showTitle, index, total, objectName,
    const props = { objectType: 'report', isReprompt: true, isEdit: false, objectName: 'reportName', index: 0, total: 0, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Import Report > reportName')).toBeDefined();
  });

  it('Report | Should render edit title with props given', () => {
    // given showLoading, showTitle, index, total, objectName,
    const props = { objectType: 'report', isReprompt: false, isEdit: true, objectName: 'reportName', index: 0, total: 0, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Edit Report > reportName')).toBeDefined();
  });

  it('Dossier | Should render import title with props given', () => {
    // given
    const props = { objectType: 'dossier', isReprompt: false, isEdit: false, objectName: 'dossierName', index: 0, total: 0, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Import Dossier > dossierName')).toBeDefined();
  });

  it('Dossier | Should render edit title with props given', () => {
    // given
    const props = { objectType: 'dossier', isReprompt: false, isEdit: true, objectName: 'dossierName', index: 0, total: 0, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Edit Dossier > dossierName')).toBeDefined();
  });

  it('Dossier | Should render simple reprompt title with props given', () => {
    // given
    const props = { objectType: 'dossier', isReprompt: true, isEdit: false, objectName: 'dossierName', index: 0, total: 1, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Reprompt > dossierName')).toBeDefined();
  });

  it('Dossier | Should render multiple reprompt title with props given', () => {
    // given
    const props = { objectType: 'dossier', isReprompt: true, isEdit: false, objectName: 'dossierName', index: 1, total: 2, };
    // when
    const { getByText } = render(<ObjectWindowTitle {...props} />);
    // then
    expect(getByText('Reprompt 1 of 2 > dossierName')).toBeDefined();
  });
});
