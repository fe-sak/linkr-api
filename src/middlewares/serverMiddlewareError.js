export default async function serverMiddlewareError(err, req, res, next) {
    return res.sendStatus(500);
}
