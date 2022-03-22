import joi from 'joi';

const signUpSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: joi.string().min(6),
    username: joi.string().min(3).max(30).required(),
    pictureUrl: joi.string().pattern(/https?:\/\/.*.(?:png|jpg)/),
});

export {
    signUpSchema,
};
