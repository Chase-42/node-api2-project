const express = require("express");

const router = express.Router();
router.use(express.json());
const db = require("../data/db");

// GET requests --- tested via insomnia and working
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log("Error with GET/api/posts", error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved. " });
    });
});

// Tested via insomnia and working
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(posts => {
      if (posts.length === 0) {
        res
          .status(400)
          .json({ message: "The post with the specified ID does not exist. " });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(error => {
      console.log("Error with GET/:id", error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved. " });
    });
});
// Tested via insomnia and working
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  db.findPostComments(id)
    .then(comment => {
      if (comment.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist. "
        });
      } else {
        res.status(200).json(comment);
      }
    })
    .catch(error => {
      console.log("Error with GET/:id/comments", error);
      res.status(500).json({
        error: "There was an error while saving the comment to database. "
      });
    });
});

// POST requests --- tested via insomnia and working

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  db.insert(req.body)
    .then(post => {
      if (!title || !contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post. "
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(error => {
      console.log("Error with POST/api/posts", error);
      res.status(500).json({
        error: "There was an error while saving the post to the database."
      });
    });
});

// Tested via insomnia and working
router.post("/:id/comments", (req, res) => {
  const { text, post_id } = req.body;

  db.insertComment(req.body)
    .then(newComment => {
      if (!post_id) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist. " });
      } else if (!text) {
        return res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        res.status(201).json(newComment);
      }
    })
    .catch(error => {
      console.log("Error with POST/api/posts/:id/comments");
      res.status(500).json({
        error: "There was an error while saving the comment to the database."
      });
    });
});

// DELETE request --- tested via insomnia and working

router.delete("/:id", (req, res) => {
  const deletedId = req.params.id;
  db.remove(deletedId)
    .then(deleted => {
      if (deleted > 0) {
        res.status(200).json({
          message: "Post has been deleted."
        });
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      console.log("Error with DELETE/api/posts/:id");
      res.status(500).json({
        error: "The post could not be removed."
      });
    });
});

// PUT request --- tested via insomnia and working

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post. "
    });
  }

  db.update(req.params.id, req.body)
    .then(updated => {
      if (updated) {
        console.log(updated);
        res.status(200).json(updated);
      } else {
        res.status(400).json({
          message: "The post with the specified ID does not exist. "
        });
      }
    })
    .catch(error => {
      console.log("Error with PUT/api/posts/:id", error);
      res
        .status(500)
        .json({ error: "The post information could not be modified. " });
    });
});

module.exports = router;
