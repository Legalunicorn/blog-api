//import the controllres

const express = require("express")
const router = express.Router();

const article_controller = require("../controllers/articleController")
// const comment_controller = require("../controllers/commentController")


//base route will be "/articles"

//all articles
router.get("/",article_controller.all_articles_get)

//single article
router.post("/",article_controller.artcles_post)
router.get("/:id",article_controller.article_get)
router.delete("/:id",article_controller.article_delete)
router.patch("/:id",article_controller.article_patch)

//new comment under aticle
// router.post("/:id/comments",comment_post)


module.exports = router