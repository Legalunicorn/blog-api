const router = require("express").Router();
// const Comment = require("../models/comment")
const commentController = require("../controllers/commentController")
const requireCommentAuth = require("../middleware/requireCommentAuth")


router.patch("/:comment_id",
    requireCommentAuth,
    commentController.comment_patch
)

router.delete("/:comment_id",
    requireCommentAuth,
    commentController.comment_delete
)

module.exports = router;