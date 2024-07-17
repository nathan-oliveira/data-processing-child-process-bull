import { ChildProcess } from 'child_process';

export class RoundRobin {
  private array: ChildProcess[];
  private index: number;

  constructor(array: ChildProcess[]) {
    this.array = array;
    this.index = 0;
  }

  getNextProcess(): ChildProcess {
    if (this.index >= this.array.length) {
      this.index = 0;
    }

    return this.array[this.index++];
  }
}
