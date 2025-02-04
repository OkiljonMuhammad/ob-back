import Template from "../../models/Template.js";

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, topic, image, isPublic, tags } = req.body;

    const template = await Template.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!req.user.canEdit(req.user.id)) {
      return res.status(403).json({ message: "You are not authorized to update this template" });
    }

    await template.update({
      title: title || template.title,
      description: description !== undefined ? description : template.description,
      topic: topic || template.topic,
      image: image || template.image,
      isPublic: isPublic !== undefined ? isPublic : template.isPublic,
      tags: tags || template.tags,
    });

    res.status(200).json({
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default updateTemplate;