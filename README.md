# motleycoder.dev

Personal site: a plain static site (HTML, one stylesheet, a little JavaScript) with no build step, self hosted on a Raspberry Pi. The second half of this file covers the server setup.

## About this site

### Pages

| File | What it is |
|---|---|
| `index.html` | Home page: 3D logo, short intro, featured projects, recent writing |
| `projects.html` | Project write-ups (older, plain layout on purpose) |
| `writing.html` | Full list of articles |
| `coaching.html`, `about.html` | Text pages |
| `404.html` | Not-found page (see "Deploying" below) |

### Code

| File | What it does |
|---|---|
| `style/styles.css` | The only stylesheet. Colours live in `:root` variables at the top, and the sections are numbered in the header comment. |
| `js/blogs.js` | The list of articles. To add one, put a new entry at the top of `blogPosts`; the home page and writing page both render from it. |
| `js/mc-dot-hero.js` | `<mc-dot-hero>`: the 3D logo on the home page. Loads three.js from unpkg, assembles the dots on first view, scatters them on scroll, and falls back to `images/mcdotlogo.png` without WebGL or when reduced motion is on. |
| `js/term-bar.js` | The "menu" dropdown in the header on phones. |

### How the pages share a look

There is no templating, so the header bar (dots, path, `[1] projects ...` menu) is copied into every page. If you change the menu, change it in all six HTML files. Each page picks its layout with a class on `<body>`:

- `home`: home page (800px column, dark projects band)
- `page`: writing, coaching, about, 404 (cream background, `$ command` headings)
- `projects-page`: projects (cream background only; the rest is the original plain style)

### Preview locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Hard refresh after changing the stylesheet; browsers hold on to it.

### Deploying

- Every page sets a Content-Security-Policy in a `<meta>` tag. The home page allows `https://unpkg.com` in `script-src` because of three.js. If Nginx adds its own security headers, they must allow that too, or the 3D logo falls back to the static image.
- `404.html` uses root-absolute paths (`/style/styles.css`) because Nginx serves it for any missing URL, including nested ones like `/a/b`. Make sure the server config points at it: `error_page 404 /404.html;`
- The assets are not fingerprinted. After a deploy that changes the stylesheet, visitors with a cached copy may need a refresh, so consider short cache lifetimes for `style/` and `js/`.

## Self hosting on a Raspberry PI

Documentation regarding how to build a secure, self hosted, homepage using a Raspberry PI

### Setup a secure Nginx server on a Raspberry PI

#### Before you start
`sudo apt-get update`

`sudo apt-get upgrade`

#### Install Nginx:
1. Install
   
`sudo apt-get install nginx`

2. Start and Enable Nginx:

`sudo systemctl start nginx`

`sudo systemctl enable nginx`

3. Configure Nginx for Your Domain:

    Edit the default Nginx server block configuration:

`sudo nano /etc/nginx/sites-available/default`

4. Test Nginx

`sudo nginx -t`

5. Reload Nginx:

`sudo systemctl reload nginx`

#### Install Certbot and Let’s Encrypt Plugin for Nginx

1. Install Certbot and Let’s Encrypt Plugin for Nginx:
   
`sudo apt-get install certbot python3-certbot-nginx`

2. Obtain SSL Certificate:
   
`sudo certbot --nginx -d your_domain.com -d www.your_domain.com`

3. Test Automatic Renewal:

`sudo certbot renew --dry-run`

#### Install Firewall

1. Install Firewall:
`sudo apt-get install ufw`

2. Open required ports:

`sudo ufw allow 80 (for HTTP)`

`sudo ufw allow 443 (for HTTPS)`

3. Enable firewall:

`sudo ufw enable`
