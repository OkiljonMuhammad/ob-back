import  { Server } from "socket.io";
import 'dotenv/config';

const users = new Map();

const setupPresentationSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.CORS_ORIGIN, process.env.LOCAL_HOST],
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`);

    socket.on("join_presentation", ({ presentationId, username }) => {
      try {
        socket.join(presentationId);

        users.set(socket.id, { id: socket.id, username });

        io.to(presentationId).emit("participant_update", Array.from(users.values()));

        console.log(`[${new Date().toISOString()}] ${username} joined presentation ${presentationId}`);

        socket.on("presentation_updated", (updatedSlides) => {
          io.to(presentationId).emit("presentation_updated", updatedSlides);
        });

        socket.on("slide_updated", (updatedSlides) => {
          io.to(presentationId).emit("slide_updated", updatedSlides);
        });

        socket.on("title_updated", (newTitle) => {
          io.to(presentationId).emit("title_updated", newTitle);
        });

      } catch (error) {
        console.error(`Error in join_presentation: ${error.message}`);
      }
    });


    socket.on("disconnect", () => {
      try {
        users.delete(socket.id); 

        io.emit("participant_update", Array.from(users.values()));

        console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id}`);
      } catch (error) {
        console.error(`Error in disconnect: ${error.message}`);
      }
    });
  });
};

export default setupPresentationSocket;
