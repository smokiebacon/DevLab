const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route POST api/posts
// @description Create a post
// @access Private
router.post('/', [
    auth, [
        check('text', 'Text is required').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error in Posts POST Route')
        }
    })



// @route GET api/posts
// @description GET ALL posts
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ date: -1 });
        res.json(allPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error in Posts GET Route')
    }
})
// @route GET api/posts/:id
// @description GET a post by ID
// @access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const onePost = await Post.findById(req.params.id);
        if (!onePost) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(onePost);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            //so if the :id is not equal to ID of post, give an error
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Error in Posts GET Route')
    }
})

// @route DELETE api/posts/:id
// @description Delete a post by ID
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedPost = await Post.findById(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //check user
        if (deletedPost.user.toString() !== req.user.id) {
            return res.status(401).send({ msg: 'User not authorized' });
        }

        await deletedPost.remove()
        res.json({ msg: 'Post deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            //so if the :id is not equal to ID of post, give an error
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Error in Posts GET Route')
    }
})

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if the post has already been liked
        if (
            post.likes.filter(like => like.user.toString() === req.user.id).length > 0
            //checks if the user of the post LIKED is equal to the user login
        ) {
            const removeIndex = post.likes
                .map(like => like.user.toString())
                .indexOf(req.user.id);
            post.likes.splice(removeIndex, 1);
            await post.save();
            // res.json(post.likes);
            return res.status(400).json({ msg: 'Post unliked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error in PUT Likes route');
    }
});


module.exports = router;