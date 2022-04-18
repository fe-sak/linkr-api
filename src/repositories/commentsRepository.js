import connection from '../database.js';

async function read(postId) {
    return connection.query(
        `
        SELECT
        comments.id AS "commentId",
        comments.text,
        users.id AS "userId",
        users.username,
        users.picture_url AS "userPic"
        FROM
        comments
        JOIN users ON comments.user_id = users.id
        WHERE
        post_id = $1
    `,
        [postId],
    );
}

async function create(userId, postId, textValue) {
    return connection.query(
        `
        INSERT INTO
            comments (user_id, post_id, text)
        VALUES
        ($1, $2, $3)
        `,
        [userId, postId, textValue],
    );
}

export { read, create };
