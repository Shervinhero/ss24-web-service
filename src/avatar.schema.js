// avatar.schema.js

import Joi from 'joi';

// Define the Avatar schema using Joi
const avatarSchema = Joi.object({
    avatarName: Joi.string()
        .required()
        .trim()
        .label('Avatar Name'),
    childAge: Joi.number()
        .required()
        .integer()
        .min(0)
        .max(18)
        .label('Child Age'),
    skinColor: Joi.string()
        .required()
        .hex()
        .length(7)
        .label('Skin Color'),
    hairstyle: Joi.string()
        .required()
        .valid('short', 'long', 'curly')
        .label('Hairstyle'),
    headShape: Joi.string()
        .required()
        .valid('round', 'oval', 'square')
        .label('Head Shape'),
    upperClothing: Joi.string()
        .required()
        .valid('shirt', 'jacket', 'sweater')
        .label('Upper Clothing'),
    lowerClothing: Joi.string()
        .required()
        .valid('pants', 'shorts', 'skirt')
        .label('Lower Clothing')
});

// Export the avatar schema
export default avatarSchema;
