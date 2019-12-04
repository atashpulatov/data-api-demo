/**
 * Helper class to add mstr-objects to cache sequentially
 * @export
 * @class AsyncQueue
 */

export default class AsyncQueue {
  /**
   * Creates an instance of AsyncQueue.
   * @param {Function} callback - Function called when dequeueing elements from the queue
   * @memberof AsyncQueue
   */
  constructor(callback) {
    this.queue = [];
    this.busy = false;
    this.callback = callback;
  }

  /**
 * Adds array of objects to the queue
 * @param {Array} object - array of mstr objects
 * @returns
 * @memberof AsyncQueue
 */
  enqueue(object) {
    this.queue.unshift(object);
    if (this.callback) return this.dequeue();
  }

  /**
 * Removes the last element from the queue and runs the callback with it as an argument
 * @memberof AsyncQueue
 */
  async dequeue() {
    if (!this.busy) {
      this.busy = true;
      while (this.queue.length && this.queue.length > 0) {
        const object = this.queue.pop();
        await this.callback(object);
      }
      this.busy = false;
    }
  }
}
