# API Credentials Setup Guide

## 1. Razorpay (Primary Payment Gateway for India)

### Registration & Setup
- **Website**: https://razorpay.com/
- **Dashboard**: https://dashboard.razorpay.com/
- **Business Account Required**: Yes

### Steps to Get Credentials:
1. Visit https://razorpay.com/
2. Click "Sign Up" and create business account
3. Complete KYC verification (Requires: PAN, GST, Bank account)
4. Go to Settings → API Keys
5. Generate Live API Keys (after activation)

### Required Documents:
- Company PAN Card
- GST Registration Certificate
- Bank Account Proof
- Business License

### API Keys You'll Get:
```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXX
```

### Approval Time: 2-7 business days

---

## 2. Stripe (Backup Payment Gateway)

### Registration & Setup
- **Website**: https://stripe.com/
- **Dashboard**: https://dashboard.stripe.com/
- **India Support**: Yes (for international cards)

### Steps to Get Credentials:
1. Visit https://stripe.com/
2. Create account and verify business
3. Complete India onboarding
4. Go to Developers → API Keys
5. Get Live publishable and secret keys

### API Keys You'll Get:
```
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX
```

### Approval Time: 1-3 business days

---

## 3. SendGrid (Email Service)

### Registration & Setup
- **Website**: https://sendgrid.com/
- **Dashboard**: https://app.sendgrid.com/
- **Free Tier**: 100 emails/day

### Steps to Get Credentials:
1. Visit https://sendgrid.com/
2. Sign up for free account
3. Verify email address
4. Go to Settings → API Keys
5. Create new API key with Full Access

### API Key You'll Get:
```
SENDGRID_API_KEY=SG.XXXXXXXXXX
```

### Setup Time: Immediate

---

## 4. Google Analytics (Optional)

### Registration & Setup
- **Website**: https://analytics.google.com/
- **Dashboard**: https://analytics.google.com/analytics/web/

### Steps to Get Credentials:
1. Visit https://analytics.google.com/
2. Create new property for your website
3. Get Measurement ID from Admin → Data Streams

### Measurement ID You'll Get:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Quick Start Links

### Razorpay
- Sign Up: https://easy.razorpay.com/onboarding?utm_source=website
- Documentation: https://razorpay.com/docs/
- API Reference: https://razorpay.com/docs/api/

### Stripe
- Sign Up: https://dashboard.stripe.com/register
- Documentation: https://stripe.com/docs
- India Guide: https://stripe.com/docs/india

### SendGrid
- Sign Up: https://signup.sendgrid.com/
- Documentation: https://docs.sendgrid.com/
- API Reference: https://docs.sendgrid.com/api-reference

---

## Required Business Documents

### For Indian Payment Gateways (Razorpay):
1. **Company Registration Certificate**
2. **PAN Card** (Company/Individual)
3. **GST Registration Certificate**
4. **Current Account Bank Statement**
5. **Address Proof**
6. **Director KYC Documents**

### For International Payments (Stripe):
1. **Business Registration**
2. **Tax ID/PAN**
3. **Bank Account Details**
4. **Business Address Proof**

---

## Estimated Costs

### Razorpay Transaction Fees:
- Domestic Cards: 2% + GST
- International Cards: 3% + GST
- Net Banking: 0.9% + GST
- UPI: 0.4% + GST

### Stripe Transaction Fees:
- Domestic Cards: 2.9% + ₹3
- International Cards: 3.4% + ₹3

### SendGrid Pricing:
- Free: 100 emails/day
- Essentials: $14.95/month (50K emails)

---

## Priority Setup Order

1. **Razorpay** (Essential for Indian market)
2. **SendGrid** (Required for KYC verification)
3. **Stripe** (Backup payment option)
4. **Google Analytics** (Optional tracking)

---

## Test Mode vs Live Mode

### Development Phase:
- Use test API keys for development
- All payment gateways provide sandbox environment
- No real money transactions

### Production Phase:
- Switch to live API keys after business verification
- Real money transactions enabled
- Compliance requirements active

---

## Support Contacts

### Razorpay Support:
- Email: support@razorpay.com
- Phone: +91-80-61799777
- Chat: Available in dashboard

### Stripe Support:
- Email: support@stripe.com
- Chat: Available in dashboard
- Documentation: Comprehensive online help

### SendGrid Support:
- Email: support@sendgrid.com
- Chat: Available for paid plans
- Community: Active developer forum

---

*Start with SendGrid (immediate setup) while completing business verification for payment gateways.*