import * as postsRepository from '../repositories/postsRepository.js';

export async function readPosts(req, res, next) {
  try {
    const posts = await postsRepository.read();
    return res.send(posts);
  } catch (error) {
    next(error);
  }
}
