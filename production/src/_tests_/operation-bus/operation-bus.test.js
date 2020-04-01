import { operationBus } from '../../operation-bus';
import { fakeStore } from './fake-store';

describe('OperationBus', () => {
  beforeAll(() => {
    operationBus.init(fakeStore);
  });

  beforeEach(() => {
    fakeStore.simulateActionChange('justSomeAction');
  });

  it('does not call subscriber when actions do not match', () => {
    // given
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedAction = 'subscribed';
    const postedAction = 'posted';
    operationBus.subscribe(subscribedAction, subscriber);
    // when
    fakeStore.simulateActionChange(postedAction);
    // then
    expect(subscriber).not.toBeCalled();
  });

  it('not call subscriber when actions do not match', () => {
    // given
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedAction = 'subscribed';
    operationBus.subscribe(subscribedAction, subscriber);
    // when
    fakeStore.simulateActionChange(subscribedAction);
    // then
    expect(subscriber).toBeCalled();
  });
});
