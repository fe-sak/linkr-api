import connection from '../database.js';

async function read() {
  const { rows: posts } = await connection.query(`
  SELECT
    posts.id,
    comment,
    link,
    username,
    picture_url
  FROM
    posts
    JOIN users ON posts.user_id  = users.id
  ORDER BY
    timestamp DESC
  LIMIT 20`);

  return posts;
}
export { read };
