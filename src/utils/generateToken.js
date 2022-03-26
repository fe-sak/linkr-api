import jwt from 'jsonwebtoken';

function generateToken({ userId }) {
    const key = process.env.JWT_SECRET;
    const config = { expiresIn: 60 * 60 * 24 * 2 }; // 2 dias em segundos

    const token = jwt.sign({ userId }, key, config);
    return token;
}

export {
    generateToken,
};
