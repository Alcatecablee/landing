# NeuroLint Payment System - Production Deployment Checklist

## 🚨 CRITICAL - Must Complete Before Launch

### 1. PayPal Configuration

- [ ] **Create PayPal production app** at developer.paypal.com
- [ ] **Run plan creation script**: `node scripts/create-paypal-plans.js`
- [ ] **Configure webhook endpoint** in PayPal dashboard:
  - URL: `https://your-domain.com/api/paypal-webhook`
  - Events to subscribe to:
    - `BILLING.SUBSCRIPTION.ACTIVATED`
    - `BILLING.SUBSCRIPTION.CANCELLED`
    - `BILLING.SUBSCRIPTION.SUSPENDED`
    - `PAYMENT.SALE.COMPLETED`
    - `PAYMENT.SALE.DENIED`
    - `PAYMENT.SALE.REFUNDED`

### 2. Environment Variables

- [ ] **Copy and configure** `.env.example` to `.env`
- [ ] **Set PayPal credentials**:
  ```
  PAYPAL_CLIENT_ID="your_production_client_id"
  PAYPAL_CLIENT_SECRET="your_production_client_secret"
  PAYPAL_ENVIRONMENT="production"
  ```
- [ ] **Generate secure secrets**:

  ```bash
  # Generate 64-character JWT secret
  openssl rand -hex 32

  # Generate 32-character encryption key
  openssl rand -hex 16
  ```

- [ ] **Set database URL** for production database

### 3. Database Setup

- [ ] **Run database migrations**:
  ```bash
  npm run db:sqlite:generate
  npm run db:push
  ```
- [ ] **Verify payments table exists**:
  ```sql
  SELECT * FROM payments LIMIT 1;
  ```

### 4. Testing Requirements

- [ ] **Test payment flow** end-to-end in sandbox
- [ ] **Verify webhook handling** with PayPal webhook simulator
- [ ] **Test subscription cancellation** flow
- [ ] **Verify plan upgrades** update user correctly

## ⚠️ Known Issues To Address

### High Priority

1. **Subscription ID Storage**: Currently using placeholder - need to store PayPal subscription ID when created
2. **Plan ID Mapping**: Need to update subscription creation to use actual PayPal plan IDs from script
3. **Invoice Generation**: Download invoice feature not implemented

### Medium Priority

1. **Error Recovery**: Need retry logic for failed webhook processing
2. **Audit Logging**: Add comprehensive payment audit trail
3. **Rate Limiting**: Add rate limits to payment endpoints

## 🔧 Quick Fixes Needed

### Fix Subscription ID Storage

1. Update PayPal subscription creation to store subscription ID in user metadata
2. Update cancellation flow to use real subscription ID

### Update Plan Creation

1. Run `node scripts/create-paypal-plans.js` to get real plan IDs
2. Update subscription creation to use actual plan IDs instead of constructed ones

## 🚀 Deployment Steps

1. **Pre-deployment**:
   - [ ] Run all tests
   - [ ] Verify environment variables
   - [ ] Create PayPal plans
   - [ ] Configure webhooks

2. **Deployment**:
   - [ ] Deploy to production
   - [ ] Run database migrations
   - [ ] Verify webhook endpoint accessible

3. **Post-deployment**:
   - [ ] Test payment flow with small amount
   - [ ] Monitor webhook logs
   - [ ] Verify user plan updates

## 📞 Support Contacts

- **PayPal Integration Issues**: developer.paypal.com/support
- **Database Issues**: Check connection string and migration status
- **Webhook Issues**: Verify endpoint is publicly accessible

## 🔍 Monitoring

Monitor these endpoints for errors:

- `/api/create-paypal-subscription`
- `/api/payments`
- `/api/paypal-webhook`
- `/api/billing/cancel-subscription`

## ✅ Launch Approval

Only deploy when ALL critical items are completed and tested.

**Estimated time to complete critical items: 2-3 hours**
