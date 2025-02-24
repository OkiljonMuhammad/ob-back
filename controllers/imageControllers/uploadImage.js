import axios from "axios";
import "dotenv/config";

const uploadImageToImgur = async (req, res) => {
  const { image } = req.body;
    try {
        const response = await axios.post("https://api.imgur.com/3/image",
            { image, type: "base64" },
            {
                headers: { Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}` },
            }
        );
        return res.status(201).json({  
          message: "Image successfully uploaded",
          imageUrl: response.data?.data?.link});
    } catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
        return null;
    }
}

export default uploadImageToImgur;