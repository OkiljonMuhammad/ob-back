import Token from '../models/Token.js';

const createToken = async () => {
  try {
    const newToken = await Token.create({
      refreshToken: '5Aep861Jfo34KnkW6LSh2NBOVbmPT.BXiZyVfDL8Rq9b5cVbGmGCL_le22E8FWHl_QA7z84nHzkVshoPcP_Sr7K',
    });

    console.log('New token created:', newToken);
  } catch (error) {
    console.error('Error creating token:', error);
  } finally {
    process.exit();
  }
};

createToken();
