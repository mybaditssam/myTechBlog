const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    Post,
    User,
    Comment
} = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'description',
                'date_created'
            ],
            include: [{
                model: Comment,
                attributes: ['id', 'c_description', 'post_id', 'user_id', 'date_created'],

            },
            {
                model: User,
                attributes: ['email']
            }]
        });

        const posts = dbPostData.map(post => post.get({ plain: true }));

        res.render('dashboard', {
            posts,
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'description',
                'date_created'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'c_description', 'post_id', 'user_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['email']
                    }
                },
                {
                    model: User,
                    attributes: ['email']
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id'
                });
                return;
            }

            const post = dbPostData.get({
                plain: true
            });

            res.render('editPost', {
                post,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/new', (req, res) => {
    res.render('addPost', {
        loggedIn: true
    })
})

module.exports = router;