export class RequestBuffer {
  private chunks: Buffer[] = [];

  append(chunk: Buffer) {
    this.chunks.push(chunk);
  }

  toBuffer(): Buffer {
    return Buffer.concat(this.chunks);
  }

  clear() {
    this.chunks = [];
  }
}
