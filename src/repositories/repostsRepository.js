import connection from '../database.js';

export async function insertRespost(userId, postId) {
    const result = await connection.query(`
    INSERT INTO reposts (post_id, user_id)
    VALUES($1, $2)
  `, [postId, userId]);

    return result;
}

export async function deleteRepost(userId, postId) {
    const result = await connection.query(`
        DELETE FROM reposts
        WHERE post_id=$1 AND user_id=$2
    `, [postId, userId]);
    return result;
}

export async function getReposts(postId) {
    const result = await connection.query(`
        SELECT r.*, u.username FROM reposts r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE post_id=$1
    `, [postId]);
    return result;
}
