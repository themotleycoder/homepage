#!/usr/bin/env python3
"""
Blog Post Generator

This script generates HTML blog posts from Markdown files.
Usage: python generate_blog.py path/to/markdown/files
"""

import os
import sys
import json
import re
from datetime import datetime
from pathlib import Path

try:
    import markdown
    import frontmatter
except ImportError:
    print("Please install required packages: pip install python-markdown python-frontmatter")
    sys.exit(1)

BLOG_METADATA_FILE = "blog_metadata.json"
TEMPLATE_PATH = "blog/template.html"
OUTPUT_DIR = "blog"


def create_slug(title):
    """Create a URL-friendly slug from a title."""
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')


def extract_excerpt(content, max_length=150):
    """Extract an excerpt from the content."""
    # Strip HTML tags if present
    plain_text = re.sub(r'<[^>]+>', '', content)
    if len(plain_text) <= max_length:
        return plain_text
    return plain_text[:max_length].rsplit(' ', 1)[0] + '...'


def generate_blog_posts(markdown_dir):
    """Generate HTML blog posts from Markdown files."""
    md_files = list(Path(markdown_dir).glob('*.md'))
    
    if not md_files:
        print(f"No Markdown files found in {markdown_dir}")
        return
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load blog post template
    try:
        with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
            template = f.read()
    except FileNotFoundError:
        print(f"Template file not found: {TEMPLATE_PATH}")
        print("Creating a basic template...")
        template = """<!DOCTYPE html>
<html>
<head>
    <title>${title} - motleycoder.dev</title>
    <link rel="stylesheet" href="../style/styles.css">
    <!-- Preload critical resources -->
    <link rel="preload" href="https://code.getmdl.io/1.3.0/material.min.js" as="script">
    <!-- Improve font loading with display=swap -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <!-- Fallback for font loading -->
    <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet">
    </noscript>
    <!-- Load MDL script with defer -->
    <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
</head>
<body class="roboto-serif-hompeage">
    <div class="blog-post">
        <div class="post-meta">${date}</div>
        <div class="post-content">
            ${content}
        </div>
        <a href="../index.html" class="back-link">← Back to Home</a>
    </div>
</body>
</html>"""
        os.makedirs(os.path.dirname(TEMPLATE_PATH), exist_ok=True)
        with open(TEMPLATE_PATH, 'w', encoding='utf-8') as f:
            f.write(template)
    
    # Process each Markdown file
    blog_metadata = []
    
    for md_file in md_files:
        print(f"Processing {md_file}...")
        
        # Parse frontmatter and content
        with open(md_file, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
        
        # Extract metadata from frontmatter
        metadata = post.metadata
        content = post.content
        
        # Set default values if not provided
        title = metadata.get('title', md_file.stem.replace('-', ' ').title())
        date = metadata.get('date', datetime.now().strftime('%B %d, %Y'))
        slug = metadata.get('slug', create_slug(title))
        
        # Convert Markdown to HTML
        html_content = markdown.markdown(content, extensions=['fenced_code', 'tables'])
        
        # Create excerpt if not provided
        excerpt = metadata.get('excerpt', extract_excerpt(html_content))
        
        # Fill in the template
        post_html = template.replace('${title}', title)
        post_html = post_html.replace('${date}', date)
        post_html = post_html.replace('${content}', html_content)
        
        # Write the HTML file
        output_file = os.path.join(OUTPUT_DIR, f"{slug}.html")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(post_html)
        
        # Add to metadata for blogs.js
        blog_metadata.append({
            'title': title,
            'date': date,
            'slug': slug,
            'excerpt': excerpt
        })
    
    # Write metadata to JSON for blogs.js
    with open(BLOG_METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(blog_metadata, f, indent=2)
    
    # Generate blogs.js
    blogs_js = f"""// blogs.js - Auto-generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
// Do not edit directly - use generate_blog.py script instead

const blogPosts = {json.dumps(blog_metadata, indent=2)};

function loadBlogPosts() {{
  const blogPostsContainer = document.querySelector('.blog-posts');
  
  // Clear any existing content
  blogPostsContainer.innerHTML = '';
  
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => {{
    return new Date(b.date) - new Date(a.date);
  }});
  
  // Generate HTML for each post
  sortedPosts.forEach(post => {{
    const postHTML = `
      <article class="blog-preview">
        <div class="post-meta">${{post.date}}</div>
        <p><a href="blog/${{post.slug}}.html">${{post.excerpt}}</a></p>
      </article>
    `;
    
    blogPostsContainer.innerHTML += postHTML;
  }});
}}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadBlogPosts);
"""
    
    # Ensure js directory exists
    os.makedirs('js', exist_ok=True)
    
    # Write blogs.js
    with open('js/blogs.js', 'w', encoding='utf-8') as f:
        f.write(blogs_js)
    
    print(f"Generated {len(blog_metadata)} blog posts")
    print(f"Generated js/blogs.js with metadata for all posts")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        markdown_dir = sys.argv[1]
    else:
        markdown_dir = 'markdown'
        print(f"No directory specified, using default: {markdown_dir}")
    
    generate_blog_posts(markdown_dir)
    print("Done!")
