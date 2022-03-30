import * as commentsRepository from '../repositories/commentsRepository.js';

export async function createComment(req, res, next) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { textValue } = req.body;

  if (!textValue) return res.sendStatus(422);

  try {
    await commentsRepository.create(userId, postId, textValue);
    return res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}
