import joi from 'joi'

const schema = joi.object({
    link: joi.string().uri().required(),
    comment: joi.string()
})

export default schema