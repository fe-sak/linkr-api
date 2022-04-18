export default function isGoodId(id) {
    if (!Number.isInteger(parseInt(id)) || id < 0) {
        return false;
    }
    return true;
}
