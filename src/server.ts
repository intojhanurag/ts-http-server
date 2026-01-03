import * as net from "net";
import { RequestBuffer } from "./utils/buffer.js";
import { HttpRequest } from "./http/request.js";
import { ResponseBuilder } from "./http/response.js";
import { HttpStatusCode } from "./http/types.js";
import { KeepAliveManager } from "./http/keepAlive.js";

const server = net.createServer((socket) => {
  // TCP connection is established here (3-way handshake has completed)
  const buffer = new RequestBuffer();
  const keepAlive = new KeepAliveManager();

  socket.on("data", (chunk: Buffer) => {
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
    // socket.write writes bytes back over the TCP connection
    // TCP guarantees it arrives at the client reliably

    keepAlive.registerRequest();
    if (!keepAlive.shouldKeepAlive()) {
      socket.end();
    }
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
