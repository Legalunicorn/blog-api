const router = require("express").Router();
const likeController = require("../controllers/likeController")
const requireAuth = require("../middleware/requireAuth")
/**
 * Base route : "/likes"
 * 
 * likes should not return an error for unauthenticated users,
 * if the req.user is empty, 
 */

//actually this should be an update route 
// update the like count -> 
router.put("/articles/:article_id/",
    requireAuth,
    likeController.like_put)


//TODO all_user_likes



//TODO user like status on a specific article id 
router.get("/articles/:article_id",
    requireAuth,
    likeController.like_article_one_get
)

    
module.exports = router