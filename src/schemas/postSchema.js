import joi from 'joi'

const schema = joi.object({
    link: joi.string().uri().required(),
    comment: joi.string().max(100)
})

export default schema