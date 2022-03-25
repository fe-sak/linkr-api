import printError from "../utils/printError.js";
import * as postsRepository from '../repositories/postsRepository.js';
import createLinkSnippet from "../utils/createLinkSnippet.js";
import connection from "../database.js";


export async function postPosts(req, res) {
    try {
        const id = res.locals.user.userId
        const comment =  req.body.comment || null
        const url = req.body.link

        const {rows: urlRows } = await postsRepository.searchUrl(url)

        let postId

        if(urlRows.length > 0){
            postId = await postsRepository.insertPost(comment, id, urlRows[0].id)
        }else{
            const snippet = await createLinkSnippet(url)
            if(snippet === null){
                return res.status(422).send('invalid link')
            }
            const {title, image, description} = snippet
            const urlId = await postsRepository.insertLink(title, image, description, url)

            postId = await postsRepository.insertPost(comment, id, urlId.rows[0].id)
        }

        if (comment){
            const arr = comment.split(' ')
            const tags = arr.filter(v => v[0] === '#').map(v => v.substr(1))
            tags.map(async v => {
                const {rowCount, rows} = await postsRepository.searchHashtag(v)

                if(rowCount > 0){
                    await postsRepository.insertHashtagPosts(rows[0].id, postId.rows[0].id)
                }else{
                    const hashId = await postsRepository.insertHashtag(v)
                    await postsRepository.insertHashtagPosts(hashId.rows[0].id, postId.rows[0].id)
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
        console.log(err);
    }
}
