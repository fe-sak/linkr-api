import printError from '../utils/printError.js';
import * as postsRepository from '../repositories/postsRepository.js';
import * as repostsRepository from '../repositories/repostsRepository.js';
import isGoodId from '../utils/checkId.js';

export async function respost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = res.locals.user.userId
        if (!isGoodId(postId)) {
            return res.status(404).send('invalid id');
        }

        const searchPost = await postsRepository.findById({postId})
 
        if (!searchPost) {
            return res.status(404).send('not found');
        }

        await repostsRepository.insertRespost(userId, postId)
        res.sendStatus(200);

    } catch (error) {
        printError(res, error)
    }
}

export async function deleteRepost(req, res) {
    try {
        const { postId } = req.params
        const userId = res.locals.user.userId

        if (!isGoodId(postId)) {
            return res.status(404).send('invalid id');
        }

        await repostsRepository.deleteRepost(userId, postId)
        res.sendStatus(200)
    } catch (error) {
        printError(res, error)
    }
}

export async function getReposts(req, res) {
    try {
        const postId = req.params.postId;

        if (!isGoodId(postId)) {
            return res.status(404).send('invalid id');
        }

        const {rows} = await repostsRepository.getReposts(postId)
        res.send(rows)

    } catch (error) {
        printError(res, error)
    }
}
