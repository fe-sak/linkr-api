import printError from '../utils/printError.js';
import * as postsRepository from '../repositories/postsRepository.js';
import createLinkSnippet from '../utils/createLinkSnippet.js';
import isGoodId from '../utils/checkId.js';

export async function postPosts(req, res) {
    try {
        const id = res.locals.user.userId;
        const comment = req.body.comment || null;
        const url = req.body.link;

        const { rows: urlRows } = await postsRepository.searchUrl(url);

        let postId;

        if (urlRows.length > 0) {
            postId = await postsRepository.insertPost(comment, id, urlRows[0].id);
        } else {
            const snippet = await createLinkSnippet(url);
            if (snippet === null) {
                return res.status(422).send('invalid link');
            }
            const { title, image, description } = snippet;
            const urlId = await postsRepository.insertLink(
                title,
                image,
                description,
                url,
            );

            postId = await postsRepository.insertPost(comment, id, urlId.rows[0].id);
        }

        if (comment) {
            const arr = comment.split(' ');
            const tags = arr.filter((v) => v[0] === '#').map((v) => v.substr(1).trim());

            tags.map(async (v) => {
                if (v.length > 0) {
                    const { rowCount, rows } = await postsRepository.searchHashtag(v);

                    if (rowCount > 0) {
                        await postsRepository.insertHashtagPosts(
                            rows[0].id,
                            postId.rows[0].id,
                        );
                    } else {
                        const hashId = await postsRepository.insertHashtag(v);
                        await postsRepository.insertHashtagPosts(
                            hashId.rows[0].id,
                            postId.rows[0].id,
                        );
                    }
                }
            });
        }
        return res.sendStatus(200);
    } catch (error) {
        return printError(res, error);
    }
}

export async function readPosts(req, res, next) {
    const { userId } = res.locals.user;
    const { olderThan } = req.query;

    try {
        const posts = await postsRepository.read({ olderThan, userId });
        return res.send(posts);
    } catch (error) {
        return next(error);
    }
}

export async function getHashtag(req, res) {
    try {
        const hashtags = await postsRepository.hashtagTrending();
        return res.status(200).send(hashtags);
    } catch (err) {
        return res.status(500).send(err);
    }
}

export async function postByHashtag(req, res) {
    const { hashtag } = req.params;
    const { olderThan } = req.query;
    try {
        const posts = await postsRepository.getPostByHashtag({ name: hashtag, olderThan });
        return res.status(200).send(posts);
    } catch (err) {
        return res.status(500).send(err);
    }
}
export async function deletePost(req, res, next) {
    const { postId } = req.params;
    try {
        await postsRepository.deleteById(postId);
        return res.sendStatus(200);
    } catch (error) {
        return next(error);
    }
}

export async function getById(req, res) {
    const { id } = req.params;
    const { olderThan } = req.query;
    try {
        if (!isGoodId(id)) {
            return res.status(404).send('invalid id');
        }

        const result = await postsRepository.getPostByUser({ id, olderThan });

        return res.send(result);
    } catch (error) {
        return printError(res, error);
    }
}

export async function updatePost(req, res) {
    const { comment, id: postId } = req.body;
    try {
        await postsRepository.updateComment(
            comment,
            postId,
            res.locals.user.userId,
        );
        await postsRepository.deleteHashtagPostItem(postId);

        if (comment) {
            const arr = comment.split(' ');
            const tags = arr.filter((v) => v[0] === '#').map((v) => v.substr(1).trim());
            tags.map(async (v) => {
                if (v.length > 0) {
                    const { rowCount, rows } = await postsRepository.searchHashtag(v);

                    if (rowCount > 0) {
                        await postsRepository.insertHashtagPosts(rows[0].id, postId);
                    } else {
                        const hashId = await postsRepository.insertHashtag(v);
                        await postsRepository.insertHashtagPosts(hashId.rows[0].id, postId);
                    }
                }
            });
        }

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}

export async function checkPostsQuantity(req, res, next) {
    const id = res.locals.user.userId;
    try {
        const count = await postsRepository.readCurrentPostsQuantity({ userId: id });

        return res.status(200).send({ count });
    } catch (error) {
        return next(error);
    }
}

export async function readExplorePosts(req, res, next) {
    const { olderThan } = req.query;

    try {
        const posts = await postsRepository.readAllPosts({ olderThan });
        return res.send(posts);
    } catch (error) {
        return next(error);
    }
}
