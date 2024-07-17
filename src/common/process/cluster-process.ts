import { Cluster } from './cluster';

export class ClusterProcess {
  private cluster: Cluster;

  constructor(
    private backgroundTaskFile: string,
    private clusterSize: number,
    private onMessage: (message: any) => void,
    private onError: (message: any) => void,
  ) {
    this.cluster = new Cluster(
      this.backgroundTaskFile,
      this.clusterSize,
      this.onMessage,
      this.onError,
    );
  }

  public sendToChild(message: any): void {
    const child = this.cluster.getProcess();
    child.send(message);
  }

  public killAll(): void {
    this.cluster.killAll();
  }
}
