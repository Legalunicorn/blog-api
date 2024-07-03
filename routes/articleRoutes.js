//import the controllres

const express = require("express")
const router = express.Router();

const article_controller = require("../controllers/articleController")
const comment_controller = require("../controllers/commentController")

//custom middleware
const requireAuth = require("../middleware/requireAuth")
const requireArticleAuth = require("../middleware/requireArticleAuth")
const requireWriter = require("../middleware/requireWriter")


//base route will be "/articles"

//Viewer / CMS
//TODO THIS should be changed because its also accessing all the tags list lmao
// maybe shift this function to to the articles route
router.get("/",article_controller.all_articles_get)

router.get("/:article_id",article_controller.article_get)

//TODO test this, new route 
router.get("/tags/:tag_id/",article_controller.articles_by_tag_get)

router.get("/users/posts",
    requireAuth,
    article_controller.articles_written_by_user)
    
router.get('/protected/:article_id',
    requireArticleAuth,
    article_controller.article_get //users the same end point as above
)
              
//CMS
router.post("/",
    requireWriter,
    article_controller.artcles_post
) //needs to be a user


//CMS
router.delete("/:article_id",
    requireArticleAuth,
    article_controller.article_delete
)

//CMS 
router.patch("/:article_id", 
    requireArticleAuth,
    article_controller.article_patch
)

//new comment under aticle
router.post("/:article_id/comments",
    requireAuth,
    comment_controller.comment_post
)




module.exports = router;