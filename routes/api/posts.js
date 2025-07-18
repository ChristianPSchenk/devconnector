const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/user')
const Profile = require('../../models/profile')
const Post = require('../../models/post')


// @route  GET api/posts
// @desc   Create a Post
// @access auth
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]
], async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const newPost = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        const post = new Post(newPost);


        await post.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');

    }

}
);

// @route  GET api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, async (req, res) => {

    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');

    }

});

// @route  GET api/posts/:id
// @desc Get  posts by id
// @access Private
router.get('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('Server Error');

    }

});

// @route  DELETE api/posts/:id
// @desc Delete  posts by id
// @access Private
router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.user != req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne();
        res.status(200).json({ msg: 'Post deleted' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('Server Error');

    }

});

// @route  PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        return res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('Server Error');
    }
})

// @route  PUT api/posts/unlike/:id
// @desc  UnLike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
            return res.status(400).json({ msg: 'Post not yet been liked' });
        }
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1)
        await post.save();
        return res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('Server Error');
    }
})

// @route  POST api/posts/comments
// @desc   Create a comment on a Post
// @access auth
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]
], async (req, res) => {
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }


        post.comments.unshift({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        await post.save();
        res.json(post.comments);



    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');

    }

}
);


// @route  DELETE api/posts/comments
// @desc   Create a comment on a Post
// @access auth
router.delete('/comment/:id/:comment_id', auth
    , async (req, res) => {


        try {

            const post = await Post.findById(req.params.id)
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const commentIndex = post.comments.findIndex(comment => comment.id.toString() == req.params.comment_id);

            const comment = post.comments[commentIndex];
            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            if (commentIndex < 0) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            post.comments.splice(commentIndex, 1);

            await post.save();
            res.json(post.comments);



        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Server Error');

        }

    }
);

module.exports = router