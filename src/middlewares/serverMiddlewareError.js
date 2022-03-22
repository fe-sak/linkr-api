export default async function serverMiddlewareError(err, req, res, next) {
  console.log(err);
  return res.sendStatus(500);
}
