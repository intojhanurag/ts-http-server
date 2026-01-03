import { HttpMethod } from "./types";

export class HttpRequest {
  method!: HttpMethod;
  path!: string;
  version!: string;
  headers: Record<string, string> = {};
  body: string = "";

  static parse(buffer: Buffer): HttpRequest {
    const req = new HttpRequest();
    const raw = buffer.toString("utf-8");

    const parts = raw.split("\r\n\r\n");
    if (parts.length < 1) {
      throw new Error("Invalid HTTP request");
    }

    const head = parts[0];
    if (!head) {
        throw new Error("invalid http request")
    }
    const body = parts[1] ?? "";

    const lines = head.split("\r\n");
    if (lines.length === 0) {
      throw new Error("Invalid HTTP request");
    }

    const requestLineRaw = lines[0];
    if (!requestLineRaw) {
    throw new Error("Invalid HTTP request line");
    }

    const requestLine = requestLineRaw.split(" ");

    const [method, path, version] = requestLine;

    req.method = method as HttpMethod;
    req.path = path;
    req.version = version;

    for (let i = 1; i < lines.length; i++) {
      const [key, value] = lines[i].split(": ");
      if (key && value) {
        req.headers[key] = value;
      }
    }

    req.body = body;
    return req;
  }
}
