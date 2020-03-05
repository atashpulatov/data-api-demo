import { operationBus } from '../../operation/operation-bus';
import { fakeStore } from './fake-store';

describe('OperationBus', () => {
  beforeAll(() => {
    operationBus.init(fakeStore);
  });

  beforeEach(() => {
    fakeStore.simulateStepChange('justSomeStep');
  });

  it('does not call subscriber when steps do not match', () => {
    // given
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed';
    const postedStep = 'posted';
    operationBus.subscribe(subscribedStep, subscriber);
    // when
    fakeStore.simulateStepChange(postedStep);
    // then
    expect(subscriber).not.toBeCalled();
  });

  it('not call subscriber when steps do not match', () => {
    // given
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed';
    operationBus.subscribe(subscribedStep, subscriber);
    // when
    fakeStore.simulateStepChange(subscribedStep);
    // then
    expect(subscriber).toBeCalled();
  });
});
