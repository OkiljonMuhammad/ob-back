import { Server } from "socket.io";

const users = {}; // Track users in rooms

const setupPresentationSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("join_presentation", ({ presentationId, nickname }) => {
      socket.join(presentationId);

      // Add user to room
      if (!users[presentationId]) users[presentationId] = [];
      users[presentationId].push({ id: socket.id, nickname });

      // Send updated user list
      io.to(presentationId).emit("user_list", users[presentationId]);

      // Notify others
      socket.to(presentationId).emit("user_joined", { id: socket.id, nickname });
    });

    socket.on("update_slide", ({ presentationId, slideData }) => {
      io.to(presentationId).emit("slide_updated", slideData);
    });

    // Handle user role changes
    socket.on("change_role", ({ presentationId, userId, role }) => {
      io.to(presentationId).emit("role_updated", { userId, role });
    });

    socket.on("disconnect", () => {
      for (const room in users) {
        users[room] = users[room].filter((user) => user.id !== socket.id);
        io.to(room).emit("user_list", users[room]); // Update user list
      }
    });
  });
};

export default setupPresentationSocket;
