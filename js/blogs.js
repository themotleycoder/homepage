// blogs.js - Auto-generated on 2025-02-22 21:37:53
// Do not edit directly - use generate_blog.py script instead

const blogPosts = [
  {
    "title": "The Double Edged Sword Of Ai In Software Development",
    "date": "February 22, 2025",
    "slug": "the-double-edged-sword-of-ai-in-software-development",
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
