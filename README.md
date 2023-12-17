# Self hosted homepage using a Raspberry PI

Documentation regarding how to build a secure, self hosted, homepage using a Raspberry PI

## Setup a secure Nginx server on a Raspberry PI

### Before you start
`sudo apt-get update`

`sudo apt-get upgrade`

### Install Nginx:
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

### Install Certbot and Let’s Encrypt Plugin for Nginx

1. Install Certbot and Let’s Encrypt Plugin for Nginx:
   
`sudo apt-get install certbot python3-certbot-nginx`

2. Obtain SSL Certificate:
   
`sudo certbot --nginx -d your_domain.com -d www.your_domain.com`

3. Test Automatic Renewal:

`sudo certbot renew --dry-run`

### Install Firewall

1. Install Firewall:
`sudo apt-get install ufw`

2. Open required ports:

`sudo ufw allow 80 (for HTTP)`

`sudo ufw allow 443 (for HTTPS)`

3. Enable firewall:

`sudo ufw enable`
