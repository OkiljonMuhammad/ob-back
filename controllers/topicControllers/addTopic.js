import Topic from '../../models/Topic.js';

const addTopic = async (req, res) => {
  try {
    const { topicName } = req.body;

    if (!topicName || topicName.trim() === '') {
      return res.status(400).json({ message: 'Topic name is required.' });
    }

    const existingTopic = await Topic.findOne({ where: { topicName } });
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists.' });
    }

    const newTopic = await Topic.create({ topicName });

    res.status(201).json({
      message: 'Topic added successfully.',
      topic: newTopic,
    });
  } catch (error) {
    console.error('Error adding topic:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default addTopic;
