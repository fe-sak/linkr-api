export default function printError(res, error) {
    console.log(error)
    return res.status(500).send(error)
}