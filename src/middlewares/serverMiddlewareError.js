export default async function serverMiddlewareError(err, req, res, next) {
    console.log(err);
    res.sendStatus(500);
    next();
}
