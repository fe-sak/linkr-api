import connection from '../database.js';

async function read() {
  const { rows: posts } = await connection.query(`
  SELECT
    posts.id,
    posts.comment,
    users.username,
    users.picture_url AS "userPic",
    links.title AS "linkTitle",
    links.image AS "linkImage",
    links.description AS "linkDescription",
    links.url AS url
  FROM
    posts
    JOIN users ON posts.user_id = users.id
    JOIN links ON posts.link_id = links.id
  ORDER BY
    timestamp DESC
  LIMIT
    20`);

  return posts;
}

async function findById({ postId }) {
  const post = await connection.query(`
      SELECT * FROM posts
      WHERE id = $1;
  `, [postId]);

  return post.rows[0];
}

export { read, findById, };
