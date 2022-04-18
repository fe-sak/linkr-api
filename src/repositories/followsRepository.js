import connection from '../database.js';

export async function getFollowsRepo(userId) {
    const result = await connection.query(`
        SELECT followed_id FROM follows f
        WHERE follower_id=$1
    `, [userId]);
    return result;
}

export async function readReposts(array) { // query teste
    let query1 = '';
    let query2 = '';

    array.forEach((id, index) => {
        if (index === 0) {
            query1 += `r.user_id = $${index + 1}`;
        } else {
            query1 += `OR $${index + 1} = r.user_id`;
        }
    });

    array.forEach((id, index) => {
        if (index === 0) {
            query2 += `posts.user_id = $${index + 1}`;
        } else {
            query2 += `OR $${index + 1} = posts.user_id`;
        }
    });

    const { rows: posts } = await connection.query(`
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
            "usersL".username AS "likeUsername",
            posts.timestamp,
            r.timestamp as time_repost
        FROM
            posts
            JOIN users "usersP" ON posts.user_id = "usersP".id
            JOIN links ON posts.link_id = links.id
            LEFT JOIN likes ON posts.id = likes.post_id
            LEFT JOIN users "usersL" ON likes.user_id="usersL".id
            LEFT JOIN reposts r ON ${query1}
            WHERE ${query2} OR posts.id = r.post_id
        LIMIT
            20`, [...array]);

    return posts;
}
