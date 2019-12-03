export default class Queue {
  constructor(callback) {
    this.queue = [];
    this.isCaching = false;
    this.cacheFunction = callback;
  }

  enqueue(objectArray) {
    this.queue.push(objectArray);
    return this.dequeue();
  }

  async dequeue() {
    if (this.isCaching || !this.queue.length) return false;
    this.isCaching = true;
    while (this.queue.length && this.queue.length > 0) {
      await this.cacheFunction(this.queue.shift());
    }
    this.isCaching = false;
  }
}
