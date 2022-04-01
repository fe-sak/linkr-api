import * as postsRepository from '../repositories/postsRepository.js';

export async function validatePostId(req, res, next) {
  const { postId } = req.params;

  try {
    const postExists = await postsRepository.findById({ postId });

    if (!postExists) {
      return res.sendStatus(404);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
  next();
}
