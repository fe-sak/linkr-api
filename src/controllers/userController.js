import bcrypt from 'bcrypt'
import * as userRepository from '../repositories/userRepository.js';
import { generateToken } from '../utils/generateToken.js';
import printError from '../utils/printError.js';

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

        const id = await userRepository.loginUser({
            token,
            userId: user.id
        });

        return res.send({
            token,
            userId: user.id,
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

async function getById(req, res) {
    const { id } = req.params;
    const { userId } = res.locals.user;
    try {
        if (!Number.isInteger(parseInt(id)) || id < 0) {
            return res.status(404).send('invalid id');
        }

        const result = await userRepository.getUser(id);
        const followed = await userRepository.findFollowedById(userId, id);
        let isFollowed = false;
        if(followed > 0){
            isFollowed = true;
        } 
        res.send({
            ...result.rows[0],
            isFollowed
        });

    } catch (error) {
        printError(res, error)
    }
}

async function getUsers(req, res){
    const { text } = req.query;
    try{
        if(text.length>=3){
            const list = await userRepository.searchUser(text);
            res.status(200).send(list);
            return;
        }
        res.status(200).send([]);        
    } catch (err) {
        res.status(500).send(err);
    }
}

async function followUser(req,res){
    const { userId } = res.locals.user;
    const { followedId } = req.body;
    try {
        await userRepository.insertFollower(userId, followedId);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
}
async function unfollowUser(req,res){
    const { userId } = res.locals.user;
    const { followedId } = req.body;
    try {
        await userRepository.removeFollower(userId, followedId);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
}


export {
    signUp,
    login,
    logout,
    getUsers,
    getById,
    followUser,
    unfollowUser
}
