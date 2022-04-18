import jwt from 'jsonwebtoken';

function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    let userId = null;

    if (!token) {
        return res.sendStatus(401);
    }

    const key = process.env.JWT_SECRET;
    try {
        const validateToken = jwt.verify(token, key);
        userId = validateToken;
    } catch (error) {
        res.sendStatus(401);
    }
    res.locals.user = userId;
    return next();
}

export {
    auth,
};
