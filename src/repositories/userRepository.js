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

export {
    create,
    findEmail,
    findUsername,
}
