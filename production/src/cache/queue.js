/**
 * Helper class to add mstr-objects to cache sequentially
 * @export
 * @class AsyncQueue
 */

export default class AsyncQueue {
  /**
   * Creates an instance of AsyncQueue.
   * @param {Function} callback - Function called when dequeueing elements from the queue
   */
  constructor(callback) {
    this.queue = [];
    this.busy = false;
    this.callback = callback;
  }

  /**
   * Adds array of objects to the queue
   * @param {Array} object - array of mstr objects
   * @returns {Promise|undefined} Promise of dequeueing, if provided callback
   */
  enqueue(object) {
    this.queue.unshift(object);
    if (this.callback) { return this.dequeue(); }
  }

  /**
   * Removes the last element from the queue and runs the callback with it as an argument
   * If the removed element has length < 7000 and is not the last in the queue - will append it
   * to the next element in the queue and skip running the callback
   */
  async dequeue() {
    if (!this.busy) {
      this.busy = true;
      while (this.queue.length && this.queue.length > 0) {
        const object = this.queue.pop();
        if (this.queue.length > 0 && object.length < 7000) {
          this.queue[this.queue.length - 1] = this.queue[this.queue.length - 1].concat(object);
        } else {
          await this.callback(object);
        }
      }
      this.busy = false;
    }
  }
}
