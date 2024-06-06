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
router.post("/article/:article_id/",
    requireAuth,
    likeController.like_put)

    
module.exports = router