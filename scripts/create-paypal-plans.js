/**
 * Script to create PayPal subscription plans
 * Run this once before deploying to production
 */

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || "sandbox";

const PAYPAL_BASE_URL =
  PAYPAL_ENVIRONMENT === "production"
    ? "https://api.paypal.com"
    : "https://api.sandbox.paypal.com";

async function getAccessToken() {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function createProduct(accessToken, name, description) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      name,
      description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  const product = await response.json();
  return product.id;
}

async function createPlan(accessToken, productId, planId, name, price) {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name,
      description: `${name} subscription plan`,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // Infinite
          pricing_scheme: {
            fixed_price: {
              value: price.toString(),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "USD",
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    }),
  });

  const plan = await response.json();
  return plan;
}

async function main() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error("PayPal credentials not configured");
    process.exit(1);
  }

  try {
    console.log("Getting PayPal access token...");
    const accessToken = await getAccessToken();

    console.log("Creating NeuroLint product...");
    const productId = await createProduct(
      accessToken,
      "NeuroLint",
      "Advanced rule-based code transformation and analysis tool",
    );

    console.log(`Product created: ${productId}`);

    // Create Pro plan
    console.log("Creating Pro plan...");
    const proPlan = await createPlan(
      accessToken,
      productId,
      "neurolint-pro",
      "NeuroLint Pro",
      29,
    );
    console.log(`Pro plan created: ${proPlan.id}`);

    // Create Enterprise plan
    console.log("Creating Enterprise plan...");
    const enterprisePlan = await createPlan(
      accessToken,
      productId,
      "neurolint-enterprise",
      "NeuroLint Enterprise",
      199,
    );
    console.log(`Enterprise plan created: ${enterprisePlan.id}`);

    console.log("\n✅ PayPal plans created successfully!");
    console.log("\nAdd these plan IDs to your environment:");
    console.log(`PAYPAL_PRO_PLAN_ID=${proPlan.id}`);
    console.log(`PAYPAL_ENTERPRISE_PLAN_ID=${enterprisePlan.id}`);

    console.log(
      "\nMake sure to configure webhook endpoint in PayPal dashboard:",
    );
    console.log("Webhook URL: https://your-domain.com/api/paypal-webhook");
    console.log("Events to subscribe to:");
    console.log("- BILLING.SUBSCRIPTION.ACTIVATED");
    console.log("- BILLING.SUBSCRIPTION.CANCELLED");
    console.log("- BILLING.SUBSCRIPTION.SUSPENDED");
    console.log("- PAYMENT.SALE.COMPLETED");
    console.log("- PAYMENT.SALE.DENIED");
    console.log("- PAYMENT.SALE.REFUNDED");
  } catch (error) {
    console.error("Error creating PayPal plans:", error);
    process.exit(1);
  }
}

main();
