import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { CreditCard, AlertTriangle } from "lucide-react";

export function SubscriptionManager() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!user || user.app_metadata?.plan_type === "free") {
    return null;
  }

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionId:
            user.app_metadata?.paypal_subscription_id || "PLACEHOLDER_ID", // TODO: Store this when subscription is created
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      toast({
        title: "Subscription Cancelled",
        description:
          "Your subscription has been cancelled. You'll continue to have access until the end of your billing period.",
      });

      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      toast({
        title: "Error",
        description:
          "Failed to cancel subscription. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Card className="bg-black/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm">Current Plan</p>
            <p className="text-gray-400 text-xs capitalize">
              {user.app_metadata?.plan_type} Plan
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">
              ${user.app_metadata?.plan_type === "enterprise" ? "199" : "29"}
              /month
            </p>
            <p className="text-gray-400 text-xs">
              Next billing:{" "}
              {new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-600/10"
                disabled={cancelling}
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-zinc-400" />
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-black border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Cancel Subscription
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Are you sure you want to cancel your subscription? You'll lose
                  access to premium features at the end of your current billing
                  period.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300">
                  Keep Subscription
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelSubscription}
                  className="bg-zinc-600 hover:bg-zinc-700"
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
