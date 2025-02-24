// blogs.js - Auto-generated on 2025-02-24 21:24:16
// Do not edit directly - use generate_blog.py script instead

const blogPosts = [
  {
    "title": "First Post",
    "date": "February 24, 2025",
    "slug": "first-post",
    "excerpt": "The Double-Edged Sword of AI in Software Development: Enhanced Productivity vs. Diminished Knowledge\nThe rise of Artificial Intelligence (AI) in..."
  }
];

function loadBlogPosts() {
  const blogPostsContainer = document.querySelector('.blog-posts');
  
  // Clear any existing content
  blogPostsContainer.innerHTML = '';
  
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Generate HTML for each post
  sortedPosts.forEach(post => {
    const postHTML = `
      <article class="blog-preview">
        <div class="post-meta">${post.date}</div>
        <p><a href="blog/${post.slug}.html">${post.excerpt}</a></p>
      </article>
    `;
    
    blogPostsContainer.innerHTML += postHTML;
  });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBlogPosts);
