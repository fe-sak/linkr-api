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

export {
    create,
};
