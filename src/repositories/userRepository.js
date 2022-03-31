import connection from '../database.js'

async function create({
    email,
    password,
    username,
    pictureUrl,
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
        SELECT username, picture_url
        FROM users
        WHERE id=$1`,[id]);

    return result
}
async function searchUser(text){
    const { rows: users } = await connection.query(`
        SELECT id, username, picture_url FROM users
        WHERE UPPER(username) LIKE UPPER($1);
    `, [`${text}%`]);

    return users;
}
async function insertFollower(follower_id, followed_id){
    await connection.query(
        `INSERT INTO follows (follower_id, followed_id) VALUES ($1,$2)`, 
    [follower_id, followed_id]);
}
async function removeFollower(follower_id, followed_id){
    await connection.query(
        `DELETE FROM follows WHERE follower_id=$1 AND followed_id=$2`, 
    [follower_id, followed_id]);
}
async function findFollowedById(follower_id, followed_id){
    const {rowCount: userFollowed } = await connection.query(
        `SELECT * FROM follows WHERE follower_id=$1 AND followed_id=$2`, 
    [follower_id, followed_id]);

    return userFollowed;
}

export {
    create,
    findEmail,
    findUsername,
    findById,
    deleteSession,
    loginUser,
    searchUser,
    getUser,
    insertFollower,
    removeFollower,
    findFollowedById,
}
