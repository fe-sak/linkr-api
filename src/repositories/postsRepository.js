import connection from '../database.js';

async function read({ olderThan, userId }) {
  const dependencies = [userId];
  let query = `
  SELECT
    posts.id,
    posts.comment,
    posts.user_id AS "userId",
    posts.timestamp,
    "usersP".username,
    "usersP".picture_url AS "userPic",
    links.title AS "linkTitle",
    links.image AS "linkImage",
    links.description AS "linkDescription",
    links.url AS url,
    likeS.id AS "likeId",
    likes.user_id AS "likeUserId",
    "usersL".username AS "likeUsername"
  FROM
    posts
    JOIN users "usersP" ON posts.user_id = "usersP".id
    JOIN links ON posts.link_id = links.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN users "usersL" ON likes.user_id="usersL".id
    LEFT JOIN reposts r ON r.user_id in (select followed_id from follows where follower_id = $1)
    WHERE posts.user_id in (select followed_id from follows where follower_id = $1) OR posts.id = r.post_id
    ORDER BY posts.id DESC
  `
  
  if (olderThan) {
    query += ` OFFSET $2`;
    dependencies.push(olderThan);
  }


  const { rows: posts } = await connection.query(`${ query }`, dependencies);
  return posts;
}

async function findById({ postId }) {
  const post = await connection.query(
    `
      SELECT * FROM posts
      WHERE id = $1;
  `,
    [postId]
  );

  return post.rows[0];
}

async function findPostLikes({ postId }) {
  const { rows: posts } = await connection.query(
    `
  SELECT
    posts.id,
    posts.comment,
    posts.user_id AS "userId",
    "usersP".username,
    "usersP".picture_url AS "userPic",
    links.title AS "linkTitle",
    links.image AS "linkImage",
    links.description AS "linkDescription",
    links.url AS url,
    likeS.id AS "likeId",
    likes.user_id AS "likeUserId",
    "usersL".username AS "likeUsername"
  FROM
    posts
    JOIN users "usersP" ON posts.user_id = "usersP".id
    JOIN links ON posts.link_id = links.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN users "usersL" ON likes.user_id="usersL".id
  WHERE posts.id = $1
  ORDER BY
    posts.id DESC
  LIMIT
    20;`,
    [postId]
  );

  return posts;
}

async function searchUrl(url) {
  const result = await connection.query(
    `
  SELECT id FROM links
  WHERE url=$1`,
    [url]
  );

  return result;
}

async function insertPost(comment, id, linkId) {
  const result = await connection.query(
    `
  INSERT INTO posts (comment, user_id, link_id)
  VALUES ($1, $2, $3)
  RETURNING id`,
    [comment, id, linkId]
  );

  return result;
}

async function insertLink(title, image, description, url) {
  const result = await connection.query(
    `
  INSERT INTO links (title, image, description, url)
  VALUES ($1, $2, $3, $4)
  RETURNING id`,
    [title, image, description, url]
  );

  return result;
}

async function searchHashtag(name) {
  const result = await connection.query(
    `
  SELECT id FROM hashtags
  WHERE name=$1`,
    [name]
  );

  return result;
}

async function insertHashtagPosts(hashtag_id, post_id) {
  const result = await connection.query(
    `
  INSERT INTO hashtags_posts (hashtag_id, post_id)
  VALUES ($1, $2)`,
    [hashtag_id, post_id]
  );

  return result;
}

async function insertHashtag(name) {
  const result = await connection.query(
    `
  INSERT INTO hashtags (name)
  VALUES ($1)
  RETURNING id`,
    [name]
  );

  return result;
}
async function hashtagTrending() {
  const { rows: hashtags } = await connection.query(`
    SELECT
      name,
      COUNT(name) as count
    FROM
      hashtags_posts
      JOIN hashtags ON hashtags.id = hashtags_posts.hashtag_id
    GROUP BY
      hashtags.id
    ORDER BY 
      count DESC`);
  return hashtags;
}

async function deleteById(id) {
  try {
    await connection.query('DELETE FROM likes WHERE post_id=$1', [id]);
    await connection.query('DELETE FROM hashtags_posts WHERE post_id=$1', [id]);
    await connection.query(`DELETE FROM posts WHERE id=$1`, [id]);
  } catch (error) {
    return error;
  }
}

async function getPostByUser({ id, olderThan }) {
  const dependencies = [id];

  let query = `
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
      
    LEFT JOIN reposts r ON r.user_id = $1
    WHERE posts.user_id = $1 OR posts.id = r.post_id
    ORDER BY
      posts.id DESC`

  if (olderThan) {
    query += ` OFFSET $2`;
    dependencies.push(olderThan);
  }

  const result = await connection.query(`${ query } `, dependencies);

  return result.rows;
}

async function getPostByHashtag({ name, olderThan }) {
  const dependencies = [name];
  let query = `
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
      JOIN hashtags_posts hp ON posts.id=hp.post_id
      JOIN hashtags h ON hp.hashtag_id=h.id
    WHERE h.name=$1
    ORDER BY
      posts.id DESC`;

  if (olderThan) {
    query += ` OFFSET $2`;
    dependencies.push(olderThan);
  }

  const { rows: posts } = await connection.query(`${ query } LIMIT 10;`, dependencies);
  return posts;
}

async function updateComment(comment, postId, userId) {
  await connection.query(
    `UPDATE posts SET comment=$1 WHERE id=$2 AND user_id=$3`,
    [comment, postId, userId]
  );
}

async function deleteHashtagPostItem(id) {
  await connection.query(`DELETE FROM hashtags_posts WHERE post_id=$1`, [id]);
}

async function readCurrentPostsQuantity({ userId }) {
  const posts = await connection.query(`
    SELECT 
      posts.id
    FROM posts
    JOIN reposts r
      ON r.user_id in (select followed_id
    from follows where follower_id = $1)
    WHERE 
      posts.user_id in (select followed_id from follows where follower_id = $1)
      OR posts.id = r.post_id
      group by posts.id
      
    `, [userId]);
  return posts.rows.length;
}

export {
  read,
  searchUrl,
  insertPost,
  insertLink,
  searchHashtag,
  insertHashtagPosts,
  insertHashtag,
  findById,
  hashtagTrending,
  getPostByHashtag,
  updateComment,
  deleteHashtagPostItem,
  deleteById,
  getPostByUser,
  findPostLikes,
  readCurrentPostsQuantity,
};

