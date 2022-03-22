import bcrypt from 'bcrypt'
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

export {
    signUp,
}
