import connection from '../database.js';

async function create({
    userId,
    postId,
}) {
    await connection.query(`
        INSERT INTO likes
            (user_id, post_id)
        VALUES
            ($1, $2);
    `, [userId, postId]);

    return true;
}

async function dislike({
    userId,
    postId,
}) {
    await connection.query(`
        DELETE FROM likes
        WHERE user_id = $1 AND post_id = $2;
    `, [userId, postId]);

    return true;
}

export {
    create,
    dislike,
};
