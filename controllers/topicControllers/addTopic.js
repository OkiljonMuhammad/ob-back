import Topic from '../../models/Topic.js';

const addTopic = async (req, res) => {
  try {
    const { topicName } = req.body;

    // Validate input
    if (!topicName || topicName.trim() === '') {
      return res.status(400).json({ message: 'Topic name is required.' });
    }

    // Check if the topic already exists
    const existingTopic = await Topic.findOne({ where: { topicName } });
    if (existingTopic) {
      return res.status(400).json({ message: 'Topic already exists.' });
    }

    // Create the new topic
    const newTopic = await Topic.create({ topicName });

    // Respond with success message and the created topic
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
