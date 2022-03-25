import * as userRepository from '../repositories/userRepository.js';
import * as postsRepository from '../repositories/postsRepository.js';
import * as likeRepository from '../repositories/likeRepository.js';

async function likeThePost(req, res, next) {
    const { userId } = res.locals.user;

    const { id } = req.params;

    try {
        const user = await userRepository.findById({ userId });

        if (!user) {
            return res.sendStatus(401);
        }
        console.log({user})


        const post = await postsRepository.findById({ postId: id });
        console.log({post})
        if (!post) {
            return res.sendStatus(404);
        }

        await likeRepository.create({
            userId,
            postId: id,
        })

        return res.sendStatus(201);
    } catch (error) {
        return next(error);
    }
}

export {
    likeThePost,
};
