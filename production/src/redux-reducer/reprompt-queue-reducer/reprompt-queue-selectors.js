export const selectRepromptTaskQueue = (state) => state.repromptsQueue;
export const isRepromptTaskQueueEmpty = (state) => state.repromptsQueue.length === 0;