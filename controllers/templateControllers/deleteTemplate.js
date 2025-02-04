import Template from "../../models/Template.js";

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!req.user.canDelete(req.user.id)) {
      return res.status(403).json({ message: "You are not authorized to delete this template" });
    }

    await template.destroy();

    res.status(200).json({
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default deleteTemplate;