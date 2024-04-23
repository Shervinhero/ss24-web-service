import Joi from 'joi';

// Define the Joi validation schema
export default Joi.object({

    // Unique identifier for the object
    id: Joi.string().alphanum().length(24).required(),

    // Timestamp when the object was created
    createdAt: Joi.date().required(),

    // Name of the avatar
    avatarName: Joi.string()
        .max(20)
        .required(),

    // Age of the child, ranging from 0 to 100
    childAge: Joi.number()
        .integer()
        .min(0)
        .max(100),

    // Hexadecimal color code for skin color (e.g., #RRGGBB)
    skinColor: Joi.string()
        .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),

    // Hairstyle options with a default value
    hairstyle: Joi.string()
        .valid(
            'short',
            'bald',
            'short-curly',
            'short-straight',
            'medium-curly',
            'medium-straight',
            'long-curly',
            'long-straight',
            'dread-locks'
        )
        .default('medium-straight'),

    // Head shape options with a default value
    headShape: Joi.string()
        .valid(
            'oval',
            'round',
            'heart',
            'rectangular'
        )
        .default('oval'),

    // Upper clothing options with a default value
    upperClothing: Joi.string()
        .valid(
            'jacket',
            'shirt',
            'hoodie',
            'dress'
        )
        .default('shirt'),

    // Lower clothing options based on the value of upperClothing
    lowerClothing: Joi.alternatives()
        .conditional('upperClothing', {
            is: 'dress',
            then: Joi.forbidden(),
            otherwise: Joi.string()
                .valid('shorts', 'pants', 'skirt')
                .default('pants')
        }),
});
