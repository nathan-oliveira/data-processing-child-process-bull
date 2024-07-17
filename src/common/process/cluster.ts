import { fork, ChildProcess } from 'child_process';

import { RoundRobin } from './round-robin';

export class Cluster {
  private processes: Map<number, ChildProcess>;
  private roundRobin: RoundRobin;

  constructor(
    private backgroundTaskFile: string,
    private clusterSize: number,
    private onMessage: (message: any) => void,
    private onError: (message: any) => void,
  ) {
    this.processes = new Map();
    this.initializeCluster();
    this.roundRobin = new RoundRobin([...this.processes.values()]);
  }

  private initializeCluster(): void {
    for (let index = 0; index < this.clusterSize; index++) {
      const child = fork(this.backgroundTaskFile);

      child.on('exit', () => {
        this.processes.delete(child.pid);
      });

      child.on('error', (error) => {
        console.error(`process ${child.pid} has an error`);
        this.onError(error);
        process.exit(1);
      });

      child.on('message', (message) => {
        if (message !== 'item-done') return;
        this.onMessage(message);
      });

      this.processes.set(child.pid, child);
    }
  }

  public getProcess(): ChildProcess {
    return this.roundRobin.getNextProcess();
  }

  public killAll(): void {
    this.processes.forEach((child) => child.kill());
  }
}
