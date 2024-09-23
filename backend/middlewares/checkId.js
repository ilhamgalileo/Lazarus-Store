const { isValidObjectId } = require("mongoose");
function checkId(req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        res.status(404)
        throw new Error("Invalid objectId")
    }
    next()
}
module.exports = checkId
