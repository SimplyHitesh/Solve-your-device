const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import cors
const Post = require('./models/post'); // Import your Post model

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware to allow requests from different origins
app.use(cors());  // Enable all CORS requests

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const DB_URL = 'mongodb+srv://hiteshs3456:chinnu21@hitesh.59ptx.mongodb.net/?retryWrites=true&w=majority&appName=Hitesh';
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Route to create a new post
app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    try {
        const newPost = new Post({ title, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Route to fetch all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Route to add a comment to a post
app.post('/posts/:id/comments', async (req, res) => {
    const { user, comment } = req.body;
    const postId = req.params.id;

    if (!user || !comment) {
        return res.status(400).json({ error: 'User and comment are required' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({ user, comment });
        await post.save(); // Save the post with the new comment

        res.status(201).json(post); // Return the updated post with the new comment
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment', message: error.message });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


