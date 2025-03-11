import { Presentation } from "../../models/presentationModels/index.js";
import { User, Slide, TextBlock, Participant } from "../../models/presentationModels/index.js";

import db from '../../models/index.js';

const createPresentation = async (req, res) => {
  try {
    const { title, slides } = req.body;

    const user = await db.User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

    const userForPresentation = await User.findByPk(req.user.id);
    if (!userForPresentation) {
        await User.create({
        id: user.id,
        username: user.username,
      });
      return res.status(404).json({ message: 'User not found' });
    }

    
    const presentation = await Presentation.create({
      title,
      creatorId: user.id,
    });
    
    await Participant.create({
      role: 'Creator',
      userId: user.id,
      presentationId: presentation.id,
    });

    const createdSlides = [];

    if (slides && Array.isArray(slides)) {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];

        const newSlide = await Slide.create({
          order: i + 1,
          presentationId: presentation.id,
        });

        const createdTextBlocks = await Promise.all(
          (slide.textBlocks || []).map((block) =>
            TextBlock.create({
              content: block.content || "New Text Block",
              x: block.x || 50,
              y: block.y || 50,
              width: block.width || 300,
              height: block.height || 100,
              slideId: newSlide.id,
            })
          )
        );

        createdSlides.push({
          slide: newSlide,
          textBlocks: createdTextBlocks,
        });
      }
    }

    return res.status(201).json({
      message: 'Presentation created successfully',
      presentation,
      slides: createdSlides,
    });
  } catch (error) {
    console.error('Error creating presentation:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export default createPresentation;