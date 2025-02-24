import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { pathToFileURL } from 'url'; 
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js'; 

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

const initializeModels = async () => {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 && 
      file !== basename && 
      file.slice(-3) === '.js' && 
      file !== 'database.js' 
    );
  });

  await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(__dirname, file);
      const fileUrl = pathToFileURL(filePath); 
      const modelModule = await import(fileUrl); 
      const model = modelModule.default; 
      db[model.name] = model;
    })
  );

  defineAssociations();
};

const defineAssociations = () => {
  // User and Template
  db.User.hasMany(db.Template, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.Template.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and Form
  db.Template.hasMany(db.Form, { foreignKey: 'templateId', onDelete: 'CASCADE' });
  db.Form.belongsTo(db.Template, { foreignKey: 'templateId' });

  // Template and Question
  db.Template.hasMany(db.Question, { foreignKey: 'templateId', onDelete: 'CASCADE' });
  db.Question.belongsTo(db.Template, { foreignKey: 'templateId' });

  // User and Form
  db.User.hasMany(db.Form, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.Form.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and Comment
  db.Template.hasMany(db.Comment, { foreignKey: 'templateId', onDelete: 'CASCADE' });
  db.Comment.belongsTo(db.Template, { foreignKey: 'templateId' });

  // Template and Likes
  db.Template.hasMany(db.Likes, { foreignKey: 'templateId', onDelete: 'CASCADE' });
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

  // Form and Answer
  db.Form.hasMany(db.Answer, { foreignKey: 'formId', onDelete: 'CASCADE' });
  db.Answer.belongsTo(db.Form, { foreignKey: 'formId' });

  // Question and Answer
  db.Question.hasMany(db.Answer, { foreignKey: 'questionId', onDelete: 'CASCADE' });
  db.Answer.belongsTo(db.Question, { foreignKey: 'questionId' });
  
  // User and Answer
  db.User.hasMany(db.Answer, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.Answer.belongsTo(db.User, { foreignKey: 'userId' });

  // Form and FormAccess
  db.Form.hasMany(db.FormAccess, { foreignKey: 'formId', onDelete: 'CASCADE' });
  db.FormAccess.belongsTo(db.Form, { foreignKey: 'formId' });

  // User and FormAccess
  db.User.hasMany(db.FormAccess, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.FormAccess.belongsTo(db.User, { foreignKey: 'userId' });

  // Template and Tag (Many-to-Many)
  db.Template.belongsToMany(db.Tag, {
    through: db.TemplateTag,
    foreignKey: 'templateId', 
    otherKey: 'tagId',
    as: 'tags', 
  });
  
  // Template and Tag (Many-to-Many)
  db.Tag.belongsToMany(db.Template, {
    through: db.TemplateTag,
    foreignKey: 'tagId', 
    otherKey: 'templateId',
    as: 'templates',
  });  
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

await initializeModels();

export default db;
