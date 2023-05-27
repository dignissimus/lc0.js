class Queue {
  constructor() {
    this.items = [];
    this.getter = null;
  }

  async get() {
    if (this.items.length > 0) return this.items.shift();
    return await new Promise((resolve) => { this.getter = resolve })
  }

  push(message) {
    if (this.getter) {
      this.getter(message);
      this.getter = null;
      return null;
    }
    this.items.push(message);
  }
}

Module["queue"] = new Queue();
Module["output"] = new Queue();
Module["print"] = (message) => { Module["output"].push(message); }
