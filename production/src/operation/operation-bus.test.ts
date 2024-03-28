import { fakeStore } from '../../__mocks__/fake-store';

import { operationBus } from './operation-bus';
import { OperationSteps } from './operation-steps';

describe('OperationBus', () => {
  beforeAll(() => {
    operationBus.init(fakeStore);
  });

  afterEach(() => {
    fakeStore.resetState();
  });

  it('does not call subscriber when current step empty', () => {
    // given
    fakeStore.addStep('justSomeStep' as OperationSteps);
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed' as OperationSteps;
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
    const subscribedStep = 'subscribed' as OperationSteps;
    const postedStep = 'posted' as OperationSteps;
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
    const subscribedStep = 'subscribed' as OperationSteps;
    operationBus.subscribe(subscribedStep, subscriber);

    // when
    fakeStore.addStep(subscribedStep);

    // then
    expect(subscriber).toBeCalled();
  });

  it('calls subscriber when matching step is next', () => {
    // given
    fakeStore.addStep('justSomeStep' as OperationSteps);
    operationBus.init(fakeStore);
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed' as OperationSteps;
    operationBus.subscribe(subscribedStep, subscriber);
    fakeStore.addStep(subscribedStep);

    // when
    fakeStore.removeFirstStep();

    // then
    expect(subscriber).toBeCalled();
  });
});
