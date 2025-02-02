import User from "./User.js";
import Template from "./Template.js";
import Question from "./Question.js";
import Form from "./Form.js";
import TemplateAccess from "./TemplateAccess.js";
import Comment from "./Comment.js";
import Likes from "./Likes.js";

User.hasMany(Template, { foreignKey: "userId"});
Template.belongsTo(User, { foreignKey: "userId"});

Template.hasMany(Form, { foreignKey: "templateId"});
Form.belongsTo(Template, { foreignKey: "templateId"});

Template.hasMany(Question, { foreignKey: "templateId"});
Question.belongsTo(Template, { foreignKey: "templateId"});

User.hasMany(Form, { foreignKey: "userId"});
Form.belongsTo(User, { foreignKey: "userId"});

Template.hasMany(TemplateAccess, { foreignKey: "templateId"});
TemplateAccess.belongsTo(Template, { foreignKey: "templateId"});

Template.hasMany(Comment, { foreignKey: "templateId"});
Comment.belongsTo(Template, { foreignKey: "templateId"});

Template.hasMany(Likes, { foreignKey: "templateId"});
Likes.belongsTo(Template, { foreignKey: "templateId"});

User.hasMany(Comment, { foreignKey: "userId"});
Comment.belongsTo(User, { foreignKey: "userId"});

User.hasMany(Likes, { foreignKey: "userId"});
Likes.belongsTo(User, { foreignKey: "userId"});

export default { User, Template, Form, Question, TemplateAccess, Comment, Likes };