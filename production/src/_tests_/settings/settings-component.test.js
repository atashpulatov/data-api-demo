import SettingsComponent from '../../settings/settings-component';

describe('settings-component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render simple SettingsComponent', () => {
    // given
    const onBack = jest.fn();
    const t = jest.fn();
    // when
    const componentWrapper = SettingsComponent({ onBack, t });
    // then
    expect(componentWrapper.props.children.props.className === 'settings-bar').toBe(true);
    expect(
      componentWrapper.props.children.props.children[0].props.className === 'back-wrapper'
    ).toBe(true);
  });
});
