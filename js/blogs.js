// blogs.js - Auto-generated on 2025-02-25 16:10:48
// Do not edit directly - use generate_blog.py script instead

const blogPosts = [
  {
    "title": "Ai Tools And Developer Growth In Modern Software Engineering",
    "date": "February 25, 2025",
    "slug": "ai-tools-and-developer-growth-in-modern-software-engineering",
    "excerpt": "Finding Balance: AI Tools and Developer Growth in Modern Software Engineering\nThe rise of Artificial Intelligence (AI) in software development has..."
  }
];

function loadBlogPosts() {
  const blogPostsContainer = document.querySelector('.blog-posts');

  // Exit early if blog posts container doesn't exist on this page
  if (!blogPostsContainer) {
    return;
  }

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
