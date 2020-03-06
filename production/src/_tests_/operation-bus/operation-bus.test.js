import { operationBus } from '../../operation/operation-bus';
import { fakeStore } from './fake-store';

describe('OperationBus', () => {
  beforeAll(() => {
    operationBus.init(fakeStore);
  });

  afterEach(() => {
    fakeStore.resetState();
  });

  it('does not call subscriber when current step empty', () => {
    // given
    fakeStore.simulateStepChange('justSomeStep');
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed';
    operationBus.subscribe(subscribedStep, subscriber);

    // when
    fakeStore.resetState();

    // then
    expect(subscriber).not.toBeCalled();
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

  it('not call subscriber when steps do not match [previous step empty]', () => {
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

  it('not call subscriber when steps do not match [previous step present]', () => {
    // given
    fakeStore.simulateStepChange('justSomeStep');
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
