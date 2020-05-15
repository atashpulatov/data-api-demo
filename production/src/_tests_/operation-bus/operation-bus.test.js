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
    fakeStore.addStep('justSomeStep');
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
    fakeStore.addStep(postedStep);

    // then
    expect(subscriber).not.toBeCalled();
  });

  it('calls subscriber when matching step added', () => {
    // given
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed';
    operationBus.subscribe(subscribedStep, subscriber);

    // when
    fakeStore.addStep(subscribedStep);

    // then
    expect(subscriber).toBeCalled();
  });

  it('calls subscriber when matching step is next', () => {
    // given
    fakeStore.addStep('justSomeStep');
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed';
    operationBus.subscribe(subscribedStep, subscriber);
    fakeStore.addStep(subscribedStep);

    // when
    fakeStore.removeFirstStep();

    // then
    expect(subscriber).toBeCalled();
  });
});
