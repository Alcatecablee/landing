import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { PRICING_PLANS } from "@/lib/config/pricing";

export function UsageDisplay() {
  const { user } = useAuth();

  if (!user) return null;

  const currentPlan = user.app_metadata?.plan_type || "free";
  const planData = PRICING_PLANS[currentPlan];
  const monthlyLimit = user.app_metadata?.monthly_limit || 25;
  const monthlyUsed = user.app_metadata?.monthly_transformations_used || 0;
  const isUnlimited = monthlyLimit >= 999999;
  const usagePercentage = isUnlimited ? 0 : (monthlyUsed / monthlyLimit) * 100;

  return (
    <Card className="bg-black/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Monthly Usage</span>
          <span className="text-sm font-normal text-zinc-400 capitalize">
            {currentPlan} Plan
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isUnlimited ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-400">Unlimited</p>
            <p className="text-gray-400">
              Transformations this month: {monthlyUsed}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transformations used</span>
              <span className="text-white">
                {monthlyUsed} / {monthlyLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {usagePercentage >= 90 && (
              <p className="text-zinc-400 text-sm">
                You're approaching your monthly limit. Consider upgrading to Pro
                for unlimited transformations.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
