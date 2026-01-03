import * as net from "net";
import { RequestBuffer } from "./utils/buffer";
import { HttpRequest } from "./http/request";
import { ResponseBuilder } from "./http/response";
import { HttpStatusCode } from "./http/types";
import { KeepAliveManager } from "./http/keepAlive";

const server = net.createServer((socket) => {
  const buffer = new RequestBuffer();
  const keepAlive = new KeepAliveManager();

  socket.on("data", (chunk:Buffer) => {
    buffer.append(chunk);

    const request = HttpRequest.parse(buffer.toBuffer());
    buffer.clear();

    console.log(request.method, request.path);

    const response = new ResponseBuilder()
      .setStatus(HttpStatusCode.OK)
      .setHeader("Content-Type", "text/plain")
      .setHeader("Connection", "keep-alive")
      .setBody("Hello from HTTP over TCP!\n")
      .build();

    socket.write(response);

    keepAlive.registerRequest();
    if (!keepAlive.shouldKeepAlive()) {
      socket.end();
    }
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
