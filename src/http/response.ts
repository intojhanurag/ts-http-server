import { HttpStatusCode } from "./types.js";

class StatusLine {
  private code!: HttpStatusCode;
  private message!: string;

  set(code: HttpStatusCode, message?: string) {
    this.code = code;
    this.message = message ?? "OK";
  }

  toString() {
    // \r = Carriage return
    // \n = Line Feed
    // \r\n means: start a new line in HTTP protocol.
    return `HTTP/1.1 ${this.code} ${this.message}\r\n`;
  }
}

class HeaderBuilder {
  private headers: Record<string, string> = {};

  set(name: string, value: string) {
    this.headers[name] = value;
  }

  get(name: string) {
    return this.headers[name];
  }

  toString() {
    return Object.entries(this.headers)
      .map(([k, v]) => `${k}: ${v}\r\n`)
      .join("");
  }
}

export class ResponseBuilder {
  private statusLine = new StatusLine();
  private headers = new HeaderBuilder();
  private body = "";

  setStatus(code: HttpStatusCode, message?: string) {
    this.statusLine.set(code, message);
    return this;
  }

  setHeader(name: string, value: string) {
    this.headers.set(name, value);
    return this;
  }

  setBody(body: string) {
    this.body = body;
    return this;
  }

  build(): string {
    if (!this.headers.get("Content-Length")) {
      this.setHeader(
        "Content-Length",
        Buffer.byteLength(this.body).toString()
      );
    }

    return (
      this.statusLine.toString() +
      this.headers.toString() +
      "\r\n" +
      this.body
    );
  }
}
