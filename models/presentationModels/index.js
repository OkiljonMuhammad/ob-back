import sequelizeForSlide from '../../config/presentationConfig/presentationDatabase.js';
import User from './User.js';
import Participant from './Participant.js';
import Slide from './Slide.js';
import TextBlock from './TextBlock.js';
import Presentation from './Presentation.js';

User.belongsToMany(Presentation, { through: Participant, foreignKey: "userId",  otherKey: "presentationId", });
Presentation.belongsToMany(User, { through: Participant,  foreignKey: "presentationId", otherKey: "userId", });

User.hasMany(Participant, { foreignKey: "userId" });
Participant.belongsTo(User, { foreignKey: "userId" });

Presentation.hasMany(Participant, { foreignKey: "presentationId" });
Participant.belongsTo(Presentation, { foreignKey: "presentationId" });


Presentation.hasMany(Slide, { foreignKey: "presentationId", onDelete: "CASCADE" });
Slide.belongsTo(Presentation, { foreignKey: "presentationId" });

Slide.hasMany(TextBlock, { foreignKey: "slideId", onDelete: "CASCADE" });
TextBlock.belongsTo(Slide, { foreignKey: "slideId" });


export { sequelizeForSlide, User, Participant, Slide, TextBlock, Presentation };
