import db from '../models/index.js';

const createTopic = async () => {
  try {
    const newTopic = await db.Topic.create({
      topicName: 'Vacancy',
    });

    console.log('New topic created:', newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
  } finally {
    process.exit();
  }
};

createTopic();
