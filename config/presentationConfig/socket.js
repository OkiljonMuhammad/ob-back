import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_presentation", (presentationId) => {
      socket.join(presentationId);
      console.log(`User joined presentation: ${presentationId}`);
    });

    socket.on("update_slide", (data) => {
      io.to(data.presentationId).emit("slide_updated", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
