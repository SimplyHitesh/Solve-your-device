const postForm = document.getElementById('postForm');
const postsDiv = document.getElementById('posts');

// Fetch and display posts with comments
async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:5000/posts');
        const posts = await response.json();
        postsDiv.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.id = `post-${post._id}`; // Set an id for each post
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <h4>Comments</h4>
                <div class="comments">
                    ${post.comments.map(comment => `
                        <p><strong>${comment.user}</strong>: ${comment.comment}</p>
                    `).join('')}
                </div>
                <input type="text" class="commentUser" placeholder="Your Name" />
                <textarea class="commentText" placeholder="Your Comment"></textarea>
                <button class="commentButton" onclick="addComment('${post._id}')">Add Comment</button>
            `;
            postsDiv.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Add a new post
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    const postData = { title, content };

    try {
        const response = await fetch('http://localhost:5000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        const newPost = await response.json();
        fetchPosts(); // Refresh posts list after creating a new one
    } catch (error) {
        console.error('Error creating post:', error);
    }
});

// Add a comment to a post
async function addComment(postId) {
    const user = document.querySelector(`#post-${postId} .commentUser`).value;
    const comment = document.querySelector(`#post-${postId} .commentText`).value;

    if (!user || !comment) {
        alert('Please enter both a name and a comment.');
        return;
    }

    const commentData = { user, comment };

    try {
        const response = await fetch(`http://localhost:5000/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });
        const updatedPost = await response.json();
        fetchPosts(); // Refresh posts list after adding a comment
    } catch (error) {
        console.error('Error adding comment:', error);
    }
}

// Initial fetch to load posts
fetchPosts();

  