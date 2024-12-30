const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema],
}, {
    timestamps: true, // Automatically add createdAt and updatedAt
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
