import connection from '../database.js';

async function read() {
  const { rows: posts } = await connection.query(`
  SELECT
    posts.id,
    posts.comment,
    posts.user_id AS "user_id",
    users.username,
    users.picture_url AS "userPic",
    links.title AS "linkTitle",
    links.image AS "linkImage",
    links.description AS "linkDescription",
    links.url AS url,
    likeS.id AS like_id,
    likes.user_id AS like_user_id,
    likes.post_id AS like_post_id
  FROM
    posts
    JOIN users ON posts.user_id = users.id
    JOIN links ON posts.link_id = links.id
    JOIN likes ON posts.id = likes.post_id
  ORDER BY
    timestamp DESC
  LIMIT
    20`);

  return posts;
}
export { read };
