import connection from '../database.js';

async function create(userId, postId, textValue) {
  return await connection.query(
    `
      INSERT INTO
        comments (user_id, post_id, text)
      VALUES
      ($1, $2, $3)
    `,
    [userId, postId, textValue]
  );
}

export { create };
