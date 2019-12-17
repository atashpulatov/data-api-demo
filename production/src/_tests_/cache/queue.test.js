import AsyncQueue from '../../cache/queue';

describe('Logic for putting objects into cache using queue', () => {
  it('should create a new queue object', () => {
    // given
    const callbackMock = jest.fn();
    // when
    const queueObject = new AsyncQueue(callbackMock);
    // then
    expect(queueObject).toEqual({
      queue: [],
      busy: false,
      callback: callbackMock,
    });
  });
  it('should add an array to queue and call dequeue', () => {
    // given
    const callbackMock = jest.fn();
    const arrayToEnqueue = ['test', 'test2', 'test3'];
    const queueObject = new AsyncQueue(callbackMock);
    const dequeueSpy = jest.spyOn(queueObject, 'dequeue').mockImplementation(() => {});
    // when
    queueObject.enqueue(arrayToEnqueue);
    // then
    expect(queueObject.queue).toEqual([arrayToEnqueue]);
    expect(dequeueSpy).toHaveBeenCalledTimes(1);
  });
  it('should remove the array from queue and run callback function with it as an argument', () => {
    // given
    const callbackMock = jest.fn();
    const arrayToDequeue = ['test', 'test2', 'test3'];
    const queueObject = new AsyncQueue(callbackMock);
    // when
    queueObject.enqueue(arrayToDequeue);
    // then
    expect(queueObject.queue).toEqual([]);
    expect(callbackMock).toHaveBeenCalledWith(arrayToDequeue);
  });
  it('should not trigger dequeueing if no callback has been passed', () => {
    // given
    const arrayToDequeue = ['test', 'test2', 'test3'];
    const queueObject = new AsyncQueue();
    const dequeueSpy = jest.spyOn(queueObject, 'dequeue').mockImplementation(() => {});
    queueObject.isCaching = true;
    // when
    queueObject.enqueue(arrayToDequeue);
    // then
    expect(queueObject.queue).toEqual([arrayToDequeue]);
    expect(dequeueSpy).not.toHaveBeenCalled();
  });
  it('should not run callback when the queue is empty', () => {
    // given
    const callbackMock = jest.fn();
    const queueObject = new AsyncQueue(callbackMock);
    // when
    queueObject.dequeue();
    // then
    expect(callbackMock).not.toHaveBeenCalled();
  });
  it('should merge arrays to dequeue when their length is < 8000', () => {
    // given
    const callbackMock = jest.fn();
    const initialArray = ['test', 'test2', 'test3'];
    const expectedArray = initialArray.concat(initialArray);
    const queueObject = new AsyncQueue(callbackMock);
    queueObject.queue.unshift(initialArray);
    // when
    queueObject.enqueue(initialArray);
    // then
    expect(callbackMock).toHaveBeenCalledWith(expectedArray);
  });
});
