import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PricingCard } from "@/components/billing/PricingCard";
import { UsageDisplay } from "@/components/billing/UsageDisplay";
import { PayPalSubscription } from "@/components/billing/PayPalSubscription";
import { SubscriptionManager } from "@/components/billing/SubscriptionManager";
import { BillingHistory } from "@/components/billing/BillingHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Calendar, Users } from "lucide-react";
import { PRICING_PLANS, type PlanType } from "@/lib/config/pricing";

export function Billing() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: PlanType) => {
    setSelectedPlan(plan);
    setLoading(true);
    // Handle subscription logic here
    setTimeout(() => setLoading(false), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Please sign in to access billing.</p>
      </div>
    );
  }

  const currentPlan = user.app_metadata?.plan_type || "free";
  const planData = PRICING_PLANS[currentPlan];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Billing & Usage
          </h1>
          <p className="text-zinc-400">
            Manage your subscription, view usage, and download invoices
          </p>
        </div>

        <div className="space-y-8">
          {/* Current Plan & Usage */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {currentPlan} Plan
                    </h3>
                    <p className="text-zinc-400">${planData.price}/month</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-zinc-300 border-zinc-600"
                  >
                    Active
                  </Badge>
                </div>

                {currentPlan !== "free" && (
                  <div className="pt-4 border-t border-zinc-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">Next billing date</span>
                      <span className="text-white">Jan 15, 2024</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Display */}
            <UsageDisplay />

            {/* Subscription Management */}
            <SubscriptionManager />

            {/* Billing History */}
            <BillingHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
