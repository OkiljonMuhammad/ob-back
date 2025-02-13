import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import utility for ES modules
import { pathToFileURL } from 'url'; // Convert file paths to file:// URLs
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js'; // Import your Sequelize instance

// Use fileURLToPath to get __filename equivalent
const __filename = fileURLToPath(import.meta.url);

// Use path.dirname to get __dirname equivalent
const __dirname = path.dirname(__filename);

// Dynamically load all models
const basename = path.basename(__filename);
const db = {};

// Load all model files in the current directory
const initializeModels = async () => {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 && // Ignore hidden files
      file !== basename && // Ignore this file (index.js)
      file.slice(-3) === '.js' && // Only include .js files
      file !== 'database.js' // Exclude the database configuration file
    );
  });

  // Dynamically import each model and add it to the `db` object
  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(filePath); // Convert to file:// URL
      const modelModule = await import(fileUrl); // Dynamically import the model
      const model = modelModule.default; // Get the model class
      db[model.name] = model; // Add the model to the `db` object
    })
  );

  // Define associations between models after all models are loaded
  defineAssociations();
};

// Define associations between models
const defineAssociations = () => {
  // User and Template
  db.User.hasMany(db.Template, { foreignKey: 'userId' });
  db.Template.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and Form
  db.Template.hasMany(db.Form, { foreignKey: 'templateId' });
  db.Form.belongsTo(db.Template, { foreignKey: 'templateId' });

  // Template and Question
  db.Template.hasMany(db.Question, { foreignKey: 'templateId' });
  db.Question.belongsTo(db.Template, { foreignKey: 'templateId' });

  // User and Form
  db.User.hasMany(db.Form, { foreignKey: 'userId' });
  db.Form.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and TemplateAccess
  db.Template.hasMany(db.TemplateAccess, { foreignKey: 'templateId' });
  db.TemplateAccess.belongsTo(db.Template, { foreignKey: 'templateId' });

  // Template and Comment
  db.Template.hasMany(db.Comment, { foreignKey: 'templateId' });
  db.Comment.belongsTo(db.Template, { foreignKey: 'templateId' });

  // Template and Likes
  db.Template.hasMany(db.Likes, { foreignKey: 'templateId' });
  db.Likes.belongsTo(db.Template, { foreignKey: 'templateId' });

  // User and Comment
  db.User.hasMany(db.Comment, { foreignKey: 'userId' });
  db.Comment.belongsTo(db.User, { foreignKey: 'userId' });

  // User and Likes
  db.User.hasMany(db.Likes, { foreignKey: 'userId' });
  db.Likes.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and Topic
  db.Topic.hasMany(db.Template, { foreignKey: 'topicId' });
  db.Template.belongsTo(db.Topic, { foreignKey: 'topicId' });

  // Template and Tag (Many-to-Many)
  db.Template.belongsToMany(db.Tag, {
    through: db.TemplateTag,
    foreignKey: 'tagId',
  });
  db.Tag.belongsToMany(db.Template, {
    through: db.TemplateTag,
    foreignKey: 'tagId',
  });
};

// Export the Sequelize instance and all models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize models and associations
await initializeModels();

export default db;
