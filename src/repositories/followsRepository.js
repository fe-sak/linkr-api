import connection from '../database.js';

export async function getFollowsRepo(userId) {
    const result = await connection.query(`
        SELECT followed_id FROM follows f
        WHERE follower_id=$1
    `, [userId]);
    return result;
}
