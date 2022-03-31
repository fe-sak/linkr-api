import printError from '../utils/printError.js';
import { getFollowsRepo, readReposts } from '../repositories/followsRepository.js';

export async function getFollows(req, res){
    try {
        const userId = res.locals.user.userId
        const {rows} = await getFollowsRepo(userId)
        res.send(rows)
        
    } catch (error) {
        printError(res, error)
    }
}

export async function teste(req, res){ //query teste
    try {
        const userId = res.locals.user.userId
        const { rows } = await getFollowsRepo(userId)
        
        const result = await readReposts(rows.map(v => v.followed_id))
        res.send(result)
        console.log(result);
    } catch (error) {
        printError(res, error)
    }
}