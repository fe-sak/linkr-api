import connection from "../database.js";
import printError from "../utils/printError.js";

export async function postPosts(req, res, next) {
    try {
        console.log(req.body);
        res.sendStatus(200);
    } catch (error) {
        printError(res, error)
    }
}