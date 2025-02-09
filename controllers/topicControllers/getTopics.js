import Topic from '../../models/Topic.js';

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      attributes: ['id', 'topicName'],
    });

    res.status(200).json({
      message: 'Topics retrieved successfully.',
      topics,
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export default getTopics;