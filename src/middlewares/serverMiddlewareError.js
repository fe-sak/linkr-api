export default async function serverMiddlewareError(err, req, res, next) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.sendStatus(500);
    next();
}
