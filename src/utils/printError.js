export default function printError(res, error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).send(error);
}
