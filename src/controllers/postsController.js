import connection from "../database.js";
import printError from "../utils/printError.js";
import * as postsRepository from '../repositories/postsRepository.js';

export async function postPosts(req, res) {
    try {
        //req.locals.userToken = id
        const id = 1
        const comment =  req.body.comment || null
        const postId = await connection.query(`
        INSERT INTO posts (comment, user_id, link)
        VALUES ($1, ${id}, $2)
        RETURNING id`, [comment, req.body.link])

        if (comment){
            const arr = comment.split(' ')
            const tags = arr.filter(v => v[0]==='#')
            tags.map(async v => {
                const {rowCount, rows} = await connection.query(`
                SELECT id FROM hashtags
                WHERE name=$1`,[v])

                if(rowCount > 0){
                    await connection.query(`
                    INSERT INTO hashtags_posts (hashtag_id, post_id)
                    VALUES ($1, $2)`, [rows[0].id, postId.rows[0].id])
                }else{
                    const hashId = await connection.query(`
                    INSERT INTO hashtags (name)
                    VALUES ($1)
                    RETURNING id`, [v])

                    await connection.query(`
                    INSERT INTO hashtags_posts (hashtag_id, post_id)
                    VALUES ($1, $2)`, [hashId.rows[0].id, postId.rows[0].id])
                }
            })
        }
        res.sendStatus(200);
    } catch (error) {
        printError(res, error)
    }
}

export async function readPosts(req, res, next) {
  try {
    const posts = await postsRepository.read();
    return res.send(posts);
  } catch (error) {
    next(error);
  }
}

export async function getHashtag(req,res){
    try {
        const { rows: hashtags } = await connection.query(`SELECT * FROM hashtags;`);
        res.status(200).send(hashtags);
    } catch (err) {
        res.status(500).send(err); 
    }
}
