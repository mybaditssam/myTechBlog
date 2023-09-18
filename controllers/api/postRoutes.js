const router = require('express').Router();
const { Post } = require('../../models');

//{
 // model: Comment,
//  attributes: ["id", "c_description", "post_id", "user_id", "date_created"],
//  include: {
//    model: User,
//    attributes: ["username"],
//  },
// },

router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ["id", "description", "title", "date_created"],
      order: [
        ["date_created", "description"]
      ],
      include: [
        {
          model: User,
          attributes: ["email"],
        },
      ],
    });
    res.json(dbPostData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (!updatedPost[0]) {
      res.status(404).json({ message: 'No post was found with this id!' });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    console.log('New Post:', newPost);

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post was found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;