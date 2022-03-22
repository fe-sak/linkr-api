export function validateSchemaMiddleware(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false })
        if (validation.error) {
            const errors = validation.error.details.map(v => v.message)
            return res.status(422).send(errors)
        }
        next()
    }
}