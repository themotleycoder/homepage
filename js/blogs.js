// blogs.js - Curated writing from Substack
// Update this manually to feature your best articles

const blogPosts = [
  {
    "title": "Finding Balance: AI Tools and Developer Growth in Modern Software Engineering",
    "date": "February 25, 2025",
    "url": "https://substack.com/@motleycoder",
    "excerpt": "The rise of AI in software development brings productivity gains, but at what cost? This article explores the potential downsides of AI tools for developers, particularly the risk of decreased knowledge retention and deskilling effects."
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

  // Generate HTML for each post using safe DOM methods
  sortedPosts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'blog-preview';

    const h3 = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = post.url;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.textContent = post.title;
    h3.appendChild(titleLink);

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.textContent = `Published on Substack • ${post.date}`;

    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;

    const readMore = document.createElement('p');
    const readLink = document.createElement('a');
    readLink.href = post.url;
    readLink.target = '_blank';
    readLink.rel = 'noopener noreferrer';
    readLink.textContent = 'Read on Substack →';
    readMore.appendChild(readLink);

    article.appendChild(h3);
    article.appendChild(meta);
    article.appendChild(excerpt);
    article.appendChild(readMore);

    blogPostsContainer.appendChild(article);
  });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBlogPosts);
