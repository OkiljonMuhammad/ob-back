import User from "../models/User.js";

const getProfile = async (req, res) => {
    try {
      const user = req.user;
      const userProfile = await User.findByPk(user.id, {
        attributes: ["id", "username", "email", "role", "isBlocked", "password"],
      });
  
      if (!userProfile) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile retrieved successfully",
        profile: {
          ...userProfile.toJSON(),
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export default getProfile;