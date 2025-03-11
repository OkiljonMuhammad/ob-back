import { Presentation } from "../../models/presentationModels/index.js";
import { Slide } from "../../models/presentationModels/index.js";
import { TextBlock } from "../../models/presentationModels/index.js";

const getSinglePresentation = async (req, res) => {
  try {
    const { presentationId } = req.params;

    const presentation = await Presentation.findByPk(presentationId, {
      include: [
        {
          model: Slide,
          include: [{ model: TextBlock }],
          order: [["order", "ASC"]],
        },
      ],
    });

    if (!presentation) {
      return res.status(404).json({ message: "Presentation not found" });
    }

    return res.status(200).json({ presentation });
  } catch (error) {
    console.error("Error fetching presentation:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default getSinglePresentation;
