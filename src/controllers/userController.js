import bcrypt from 'bcrypt'
import * as userRepository from '../repositories/userRepository.js';
import { generateToken } from '../utils/generateToken.js';

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
        });

        return res.send({
            token,
            username: user.username,
            pictureUrl: user.picture_url,
        });
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next) {
    const { userId } = res.locals.user;

    try {
        const user = await userRepository.findById({ userId });

        if (!user) {
            return res.status(404).send('User not found');
        }

        await userRepository.deleteSession({ userId })

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
}


export {
    signUp,
    login,
    logout,
}
