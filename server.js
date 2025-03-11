import app from './app.js';
import { createServer } from "http";
import setupPresentationSocket from "./sockets/presentationSocket.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);
setupPresentationSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
