import Template from "../../models/Template.js";

const createTemplate = async (req, res) => {
    try {
        const { title, description, topic, image, isPublic, tags } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required." });
        }

        const newTemplate = Template.create({
            title, 
            description, 
            topic, 
            image, 
            isPublic: isPublic !== undefined ? isPublic : true, 
            tags,
            userId: req.user.id,
        });

        res.status(201).json({
            message: "Template created successfully.",
            template: newTemplate,
        });
    } catch (error) {
        console.error("Error creating template:", error);
        res.status(500).json({ message: "Internal server error."});
    }
};

export default createTemplate;