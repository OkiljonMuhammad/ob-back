import { Presentation, Slide, TextBlock } from "../../models/presentationModels/index.js";

const updatePresentation = async (req, res) => {
  try {
    const { title, slides } = req.body;
    const { presentationId } = req.params;

    const presentation = await Presentation.findByPk(presentationId);
    if (!presentation) {
      return res.status(404).json({ message: "Presentation not found" });
    }

    if (title) {
      presentation.title = title;
      await presentation.save();
    }

    if (!slides || slides.length === 0) {
      return res.status(201).json({ message: "No slides provided" });
    }

    const existingSlides = await Slide.findAll({ where: { presentationId } });
    const existingSlideMap = new Map(existingSlides.map(slide => [slide.id, slide]));

    const receivedSlideIds = slides.map(slide => slide.id).filter(Boolean);
    const slidesToRemove = existingSlides.filter(slide => !receivedSlideIds.includes(slide.id));

    if (slidesToRemove.length > 0) {
      const slideIdsToRemove = slidesToRemove.map(slide => slide.id);
      await TextBlock.destroy({ where: { slideId: slideIdsToRemove } }); 
      await Slide.destroy({ where: { id: slideIdsToRemove } }); 
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      let updatedSlide;

      if (slide.id && existingSlideMap.has(slide.id)) {
        updatedSlide = existingSlideMap.get(slide.id);
        updatedSlide.order = i + 1;
        await updatedSlide.save();
      } else {
        updatedSlide = await Slide.create({ order: i + 1, presentationId });
        slide.id = updatedSlide.id;
      }

      if (!updatedSlide) continue;

      const existingTextBlocks = await TextBlock.findAll({ where: { slideId: updatedSlide.id } });
      const existingTextBlockMap = new Map(existingTextBlocks.map(block => [block.id, block]));

      const receivedTextBlockIds = slide.TextBlocks?.map(block => block.id).filter(Boolean) || [];
      const textBlocksToRemove = existingTextBlocks.filter(block => !receivedTextBlockIds.includes(block.id));

      if (textBlocksToRemove.length > 0) {
        await TextBlock.destroy({ where: { id: textBlocksToRemove.map(block => block.id) } });
      }

      for (const block of slide.TextBlocks || []) {
        if (block.id && existingTextBlockMap.has(block.id)) {
          const existingBlock = existingTextBlockMap.get(block.id);
          existingBlock.content = block.content;
          existingBlock.x = block.x;
          existingBlock.y = block.y;
          existingBlock.width = block.width;
          existingBlock.height = block.height;
          await existingBlock.save();
        } else {
          await TextBlock.create({
            content: block.content || "New Text Block",
            x: block.x || 50,
            y: block.y || 50,
            width: block.width || 300,
            height: block.height || 100,
            slideId: updatedSlide.id, 
          });
        }
      }
    }

    return res.status(200).json({ message: "Presentation updated successfully" });
  } catch (error) {
    console.error("Error updating presentation:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export default updatePresentation;
