import connection from '../database.js'

async function create({
    email,
    password,
    username,
    pictureUrl
}) {
    const user = await connection.query(`
        INSERT INTO users
            (email, password, username, picture_url)
        VALUES
            ($1, $2, $3, $4)
        RETURNING *;
    `, [email, password, username, pictureUrl]);

    return user.rows[0];
}

async function findEmail({ email }) {
    const user = await connection.query(`
        SELECT * FROM users
        WHERE email = $1;
    `, [email]);

    return user.rows[0];
}

async function findUsername({ username }) {
    const user = await connection.query(`
        SELECT * FROM users
        WHERE username = $1;
    `, [username]);

    return user.rows[0];
}

async function findById({ userId }) {
    const user = await connection.query(`
        SELECT * FROM users
        WHERE id = $1;
    `, [userId]);

    return user.rows[0];
}

async function deleteSession({ userId }) {
    await connection.query(`
        DELETE FROM sessions
        WHERE user_id = $1;
    `, [userId]);

    return true;
}

async function loginUser({
    token,
    userId,
}) {
    const session = await connection.query(`
        INSERT INTO sessions
            (token, user_id)
        VALUES
            ($1, $2)
        RETURNING *;
    `, [token, userId]);

    return session.rows[0];
}

async function getUser(id) {
    const result = await connection.query(`
   SELECT
    posts.id,
    posts.comment,
    posts.user_id AS "userId",
    usersP.username,
    usersP.picture_url AS "userPic",
    links.title AS "linkTitle",
    links.image AS "linkImage",
    links.description AS "linkDescription",
    links.url AS url,
    likeS.id AS "likeId",
    likes.user_id AS "likeUserId",
    usersL.username AS "likeUsername"
  FROM
    posts
    JOIN users usersP ON posts.user_id = usersP.id
    JOIN links ON posts.link_id = links.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN users usersL ON likes.user_id=usersL.id
  WHERE
    usersP.id=$1
  ORDER BY
    posts.id DESC
  LIMIT
    20`,[id]);

    return result
}

export {
    create,
    findEmail,
    findUsername,
    findById,
    deleteSession,
    loginUser,
    getUser,
}
