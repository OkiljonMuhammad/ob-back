import User from './User.js';
import Template from './Template.js';
import Question from './Question.js';
import Form from './Form.js';
import TemplateAccess from './TemplateAccess.js';
import Comment from './Comment.js';
import Likes from './Likes.js';
import Tag from './Tag.js';
import Topic from './Topic.js';

// User and Template
User.hasMany(Template, { foreignKey: 'userId' });
Template.belongsTo(User, { foreignKey: 'userId' });

// Template and Form
Template.hasMany(Form, { foreignKey: 'templateId' });
Form.belongsTo(Template, { foreignKey: 'templateId' });

// Template and Question
Template.hasMany(Question, { foreignKey: 'templateId' });
Question.belongsTo(Template, { foreignKey: 'templateId' });

// User and Form
User.hasMany(Form, { foreignKey: 'userId' });
Form.belongsTo(User, { foreignKey: 'userId' });

// Template and TemplateAccess
Template.hasMany(TemplateAccess, { foreignKey: 'templateId' });
TemplateAccess.belongsTo(Template, { foreignKey: 'templateId' });

// Template and Comment
Template.hasMany(Comment, { foreignKey: 'templateId' });
Comment.belongsTo(Template, { foreignKey: 'templateId' });

// Template and Likes
Template.hasMany(Likes, { foreignKey: 'templateId' });
Likes.belongsTo(Template, { foreignKey: 'templateId' });

// User and Comment
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// User and Likes
User.hasMany(Likes, { foreignKey: 'userId' });
Likes.belongsTo(User, { foreignKey: 'userId' });

// Template and Topic
Topic.hasMany(Template, { foreignKey: 'topicId' });
Template.belongsTo(Topic, { foreignKey: 'topicId' });

// Template and Tag
Tag.hasMany(Template, { foreignKey: 'id', constraints: false});
Template.belongsTo(Tag, { foreignKey: 'id', constraints: false });

export default {
  User,
  Template,
  Form,
  Question,
  TemplateAccess,
  Comment,
  Likes,
  Tag,
  Topic,
};