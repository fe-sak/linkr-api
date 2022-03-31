import * as userRepository from '../repositories/userRepository.js';
import * as postsRepository from '../repositories/postsRepository.js';
import * as likeRepository from '../repositories/likeRepository.js';

async function likeThePost(req, res, next) {
  const { userId } = res.locals.user;

  const { id } = req.params;

  try {
    const user = await userRepository.findById({ userId });

    if (!user) {
      return res.sendStatus(401);
    }

    const post = await postsRepository.findById({ postId: id });

    if (!post) {
      return res.sendStatus(404);
    }

    await likeRepository.create({
      userId,
      postId: id,
    });

    const findLikes = await postsRepository.findPostLikes({ postId: id });

    return res.status(201).send(findLikes);
  } catch (error) {
    return next(error);
  }
}

async function dislikeThePost(req, res, next) {
  const { userId } = res.locals.user;

  const { id } = req.params;

  try {
    const user = await userRepository.findById({ userId });

    if (!user) {
      return res.sendStatus(401);
    }

    const post = await postsRepository.findById({ postId: id });

    if (!post) {
      return res.sendStatus(404);
    }

    await likeRepository.dislike({
      userId,
      postId: id,
    });

    const findLikes = await postsRepository.findPostLikes({ postId: id });

    return res.status(200).send(findLikes);
  } catch (error) {
    return next(error);
  }
}

export { likeThePost, dislikeThePost };
