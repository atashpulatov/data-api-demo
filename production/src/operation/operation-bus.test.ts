import { reduxStore } from '../store';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData } from '../types/object-types';

import { operationBus } from './operation-bus';
import { OperationSteps } from './operation-steps';

describe('OperationBus', () => {
  beforeAll(() => {
    operationBus.init();
  });

  it('does not call subscriber when current step empty', () => {
    // given
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed' as OperationSteps;
    operationBus.subscribe(subscribedStep, subscriber);

    // when
    operationBus.listener();

    // then
    expect(subscriber).not.toHaveBeenCalled();
  });

  it('does not call subscriber when steps do not match', () => {
    operationBus.init();
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed' as OperationSteps;
    const operations = [
      { stepsQueue: ['subscribed2'], objectWorkingId: 2137 },
    ] as unknown as OperationData[];
    const objects = [{ objectWorkingId: 2137 }] as unknown as ObjectData[];

    jest
      .spyOn(reduxStore, 'getState')
      // @ts-expect-error
      .mockReturnValue({ operationReducer: { operations }, objectReducer: { objects } });

    operationBus.subscribe(subscribedStep, subscriber);

    // when
    operationBus.listener();

    // then
    expect(subscriber).not.toHaveBeenCalled();
  });

  it('calls subscriber when matching step is next', () => {
    // given
    operationBus.init();
    const subscriber = jest.fn();
    const subscribedStep = 'subscribed' as OperationSteps;
    const operations = [{ stepsQueue: [subscribedStep], objectWorkingId: 2137 }] as OperationData[];
    const objects = [{ objectWorkingId: 2137 }] as unknown as ObjectData[];

    jest
      .spyOn(reduxStore, 'getState')
      // @ts-expect-error
      .mockReturnValue({ operationReducer: { operations }, objectReducer: { objects } });

    operationBus.subscribe(subscribedStep, subscriber);

    // when
    operationBus.listener();

    // then
    expect(subscriber).toHaveBeenCalled();
  });
});
