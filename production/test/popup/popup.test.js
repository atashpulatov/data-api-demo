import React from 'react';
import {shallow} from 'enzyme';
import {Popup} from '../../src/popup/popup.jsx';

describe('Popup.js', () => {
  it('should set projectId, reportId and subtype on handlePrepare', () => {
    // given
    const location = {
      search: {},
    };
    const givenRecord = {
      reportId: 'reportId',
      projectId: 'projectId',
      subtype: 'subtype',
    };
    const popupWrapped = shallow(<Popup location={location} />);
    // when
    popupWrapped.instance().handlePrepare(
        givenRecord.projectId,
        givenRecord.reportId,
        givenRecord.subtype
    );
    // then
    const parsed =popupWrapped.state().parsed;
    expect(parsed.reportId).toEqual(givenRecord.reportId);
    expect(parsed.projectId).toEqual(givenRecord.projectId);
    expect(parsed.reportSubtype).toEqual(givenRecord.subtype);
  });
});
