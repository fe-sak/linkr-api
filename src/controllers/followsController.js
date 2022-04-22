import printError from '../utils/printError.js';
import { getFollowsRepo } from '../repositories/followsRepository.js';

export async function getFollows(req, res) {
    try {
        const { userId } = res.locals.user;
        const { rows } = await getFollowsRepo(userId);
        res.send(rows);
    } catch (error) {
        printError(res, error);
    }
}
