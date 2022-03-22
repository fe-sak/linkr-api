import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

async function signUp(req, res, next) {
    const {
        email,
        password,
        username,
        pictureUrl,
    } = req.body;

    try {
        const searchEmail = await userRepository.findEmail({ email });

        if (searchEmail) {
            return res.status(409).send('This email is already in use!');
        }

        const searchUsername = await userRepository.findUsername({ username });

        if (searchUsername) {
            return res.status(409).send('This username is already in use!');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await userRepository.create({
            email,
            password: hashedPassword,
            username,
            pictureUrl,
        })

        return res.send(user);
    } catch (error) {
        return next(error);
    }
}

function generateToken({ userId }) {
    const key = process.env.JWT_SECRET;
    const config = { expiresIn: 60 * 60 * 24 * 2 }; // 2 dias em segundos

    const token = jwt.sign({ userId }, key, config);
    return token;
}

async function login(req, res, next) {
    const {
        email,
        password,
    } = req.body;

    try {
        const user = await userRepository.findEmail({ email });

        if (!user) {
            return res.status(401).send('Incorrect email or password');
        }

        const isAuthorized = bcrypt.compareSync(password, user.password);

        if (!isAuthorized) {
            return res.status(401).send('Incorrect email or password');
        }

        const token = generateToken({ userId: user.id });

        await userRepository.deleteSession({ userId: user.id })

        await userRepository.loginUser({
            token,
            userId: user.id
        })

        return res.send(token);
    } catch (error) {
        return next(error);
    }
}

export {
    signUp,
    login,
}
