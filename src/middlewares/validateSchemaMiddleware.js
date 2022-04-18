export function validateSchemaMiddleware(schema) {
    // eslint-disable-next-line consistent-return
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });

        if (validation.error) {
            return res
                .status(422)
                .send(
                    validation.error.details.map((detail) => detail.message.replace(/"/g, '')),
                );
        }

        next();
    };
}
