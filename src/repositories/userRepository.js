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

async function deleteSession({ userId }) {
    await connection.query(`
        DELETE FROM sessions
        WHERE user_id = $1
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

export {
    create,
    findEmail,
    findUsername,
    deleteSession,
    loginUser,
}
