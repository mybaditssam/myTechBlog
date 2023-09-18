const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    User,
    Post,
    Comment
} = require('../models');


router.get('/', (req, res) => {
    Post.findAll({
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
            const posts = dbPostData.map(post => post.get({
                plain: true
            }));

            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/post/:id', async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
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
        });

        if (!dbPostData) {
            return res.status(404).json({
                message: 'No post found with this id'
            });
        }

        const post = dbPostData.get({
            plain: true
        });

        res.render('post', {
            post,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


router.get('*', (req, res) => {
    res.status(404).send("Can't go there!");
    // res.redirect('/');
})


module.exports = router;