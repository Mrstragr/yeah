# Technical Deployment Guide - Perfect91Club Gaming Platform

## Overview
This guide covers the complete technical deployment process for launching Perfect91Club as a production-ready real money gaming platform in India.

## 1. Production Environment Setup

### Cloud Infrastructure Requirements
```bash
# Recommended specifications for Indian market:
- Server: 8GB RAM, 4 CPU cores, 100GB SSD
- Database: PostgreSQL (managed service recommended)
- CDN: CloudFlare for global performance
- Load Balancer: For scaling during peak gaming hours
- Backup: Automated daily backups with 30-day retention
```

### Hosting Options for India
1. **AWS Mumbai (ap-south-1)** - Primary choice
   - EC2 instances with Auto Scaling Groups
   - RDS PostgreSQL with Multi-AZ deployment
   - CloudFront CDN for static assets
   - S3 for file storage (KYC documents)

2. **Google Cloud Platform Mumbai**
   - Compute Engine with managed instance groups
   - Cloud SQL for PostgreSQL
   - Cloud CDN for performance

3. **Microsoft Azure India**
   - Virtual Machine Scale Sets
   - Azure Database for PostgreSQL
   - Azure CDN

## 2. Environment Configuration

### Production Environment Variables
```bash
# Create .env.production file
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/perfect91club_prod

# JWT Security
JWT_SECRET=your-super-secure-256-bit-secret-key

# Payment Gateways
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_secret_key
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX
PAYPAL_CLIENT_ID=your_paypal_live_client_id
PAYPAL_CLIENT_SECRET=your_paypal_live_secret

# SMS/Email Services
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
SENDGRID_API_KEY=SG.XXXXXXXXXX

# Security & Monitoring
ALLOWED_ORIGINS=https://perfect91club.com,https://www.perfect91club.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SESSION_SECRET=your-session-secret-key

# Indian Compliance
GST_NUMBER=your_gst_number
COMPANY_PAN=your_company_pan
```

## 3. Database Production Setup

### PostgreSQL Configuration
```sql
-- Create production database
CREATE DATABASE perfect91club_prod;
CREATE USER perfect91club_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE perfect91club_prod TO perfect91club_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Database Migration
```bash
# Run database migrations
npm run db:push

# Verify all tables are created
npm run db:studio
```

### Database Optimization for Production
```sql
-- Indexing for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_game_results_user_id ON game_results(user_id);
CREATE INDEX idx_game_results_game_type ON game_results(game_type);

-- Connection pooling settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

## 4. Security Configuration

### SSL/TLS Setup
```bash
# Install SSL certificate (Let's Encrypt recommended)
sudo apt install certbot
sudo certbot --nginx -d perfect91club.com -d www.perfect91club.com

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Firewall Configuration
```bash
# UFW firewall setup
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw deny 5000/tcp  # Block direct API access
```

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/perfect91club
server {
    listen 443 ssl http2;
    server_name perfect91club.com www.perfect91club.com;
    
    ssl_certificate /etc/letsencrypt/live/perfect91club.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/perfect91club.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name perfect91club.com www.perfect91club.com;
    return 301 https://$server_name$request_uri;
}
```

## 5. Application Deployment

### Build Process
```bash
# Production build
npm run build

# Optimize images and assets
npm run optimize

# Test production build locally
npm run preview
```

### PM2 Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'perfect91club',
    script: 'server/index.ts',
    interpreter: 'tsx',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs']
  }]
};
```

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

## 6. Monitoring & Logging

### Application Monitoring
```bash
# Install monitoring tools
npm install --save winston helmet express-rate-limit

# Setup log rotation
sudo apt install logrotate
```

```bash
# /etc/logrotate.d/perfect91club
/home/ubuntu/perfect91club/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 ubuntu ubuntu
    postrotate
        pm2 reload perfect91club
    endscript
}
```

### Health Checks
```javascript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});
```

## 7. Payment Gateway Production Setup

### Razorpay Live Configuration
```javascript
// server/payment-service.ts
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Webhook verification
app.post('/api/payments/razorpay/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  try {
    Razorpay.validateWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET);
    // Process payment update
    res.status(200).send('OK');
  } catch (error) {
    res.status(400).send('Invalid signature');
  }
});
```

## 8. CDN & Asset Optimization

### CloudFlare Setup
1. Add domain to CloudFlare
2. Configure DNS records:
   ```
   A    @              Your_Server_IP
   A    www            Your_Server_IP
   CNAME api          perfect91club.com
   ```
3. Enable security features:
   - DDoS protection
   - WAF rules for India
   - Bot management
   - Rate limiting

### Asset Optimization
```bash
# Install optimization tools
npm install --save-dev vite-plugin-compression

# Configure in vite.config.ts
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip'
    })
  ],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

## 9. Backup & Disaster Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="perfect91club_prod"
BACKUP_DIR="/home/ubuntu/backups"

pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://perfect91club-backups/

# Cleanup local backups older than 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

```bash
# Schedule daily backups
echo "0 2 * * * /home/ubuntu/scripts/backup.sh" | crontab -
```

## 10. Performance Optimization

### Caching Strategy
```bash
# Install Redis for caching
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru
```

```javascript
// Implement caching in application
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

// Cache game results
const cacheGameResult = async (gameId, result) => {
  await redis.setex(`game:${gameId}`, 300, JSON.stringify(result));
};
```

## 11. Go-Live Checklist

### Pre-Launch Testing
- [ ] Load testing with 1000+ concurrent users
- [ ] Payment gateway testing with real transactions
- [ ] Security penetration testing
- [ ] Mobile responsiveness testing
- [ ] KYC document upload testing
- [ ] Email/SMS delivery testing

### Launch Day Preparation
- [ ] DNS propagation completed
- [ ] SSL certificates installed and tested
- [ ] Monitoring alerts configured
- [ ] Customer support team briefed
- [ ] Payment gateway live mode activated
- [ ] Legal compliance documentation ready

### Post-Launch Monitoring
- [ ] Server performance monitoring
- [ ] Payment success rates tracking
- [ ] User registration conversion rates
- [ ] Game performance metrics
- [ ] Security incident monitoring

## 12. Scaling Strategy

### Traffic Growth Planning
```bash
# Auto-scaling configuration
# Create launch template with current server config
# Set up Auto Scaling Group with:
# - Min: 2 instances
# - Max: 10 instances
# - Target CPU utilization: 70%
```

### Database Scaling
- Read replicas for user queries
- Connection pooling optimization
- Query optimization and indexing
- Partitioning for large tables

This technical deployment guide provides everything needed to launch Perfect91Club as a production-ready platform. Follow each section carefully and test thoroughly before going live.