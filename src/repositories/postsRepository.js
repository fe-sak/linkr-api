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

async function searchUrl(url) {
  const result = await connection.query(`
  SELECT id FROM links
  WHERE url=$1`, [url])

  return result
}

async function insertPost(comment, id, linkId) {
  const result = await connection.query(`
  INSERT INTO posts (comment, user_id, link_id)
  VALUES ($1, $2, $3)
  RETURNING id`, [comment, id, linkId])

  return result
}

async function insertLink(title, image, description, url) {
  const result = await connection.query(`
  INSERT INTO links (title, image, description, url)
  VALUES ($1, $2, $3, $4)
  RETURNING id`, [title, image, description, url])

  return result
}

async function searchHashtag(name) {
  const result = await connection.query(`
  SELECT id FROM hashtags
  WHERE name=$1`, [name])

  return result
}

async function insertHashtagPosts(hashtag_id, post_id) {
  const result = await connection.query(`
  INSERT INTO hashtags_posts (hashtag_id, post_id)
  VALUES ($1, $2)`, [hashtag_id, post_id])

  return result
}

async function insertHashtag(name) {
  const result = await connection.query(`
  INSERT INTO hashtags (name)
  VALUES ($1)
  RETURNING id`, [name])

  return result
}

export {
  read,
  searchUrl,
  insertPost,
  insertLink,
  searchHashtag,
  insertHashtagPosts,
  insertHashtag
};
