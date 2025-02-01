import User from "../models/User.js";

const seedUsers = async () => {
  try {
    const newUser = await User.create({
      username: "john_doe",
      email: "john@example.com",
      password: "mySecurePassword123",
      role: "user",
    });

    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    process.exit();
  }
};

seedUsers();