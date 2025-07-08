import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  date: string;
  invoice_url: string;
}

export function BillingHistory() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBillingHistory();
    }
  }, [user?.id]);

  const fetchBillingHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/history/${user?.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch billing history");
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error fetching billing history:", error);
      toast({
        title: "Error",
        description: "Failed to load billing history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/billing/invoice/${paymentId}`);

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      // For now, just show a message
      toast({
        title: "Invoice Download",
        description: "Invoice download feature will be available soon.",
      });
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Card className="bg-black/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5" />
          Billing History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading billing history...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-4">
            <Calendar className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400">No billing history yet</p>
            <p className="text-gray-500 text-sm">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0"
            >
              <div>
                <p className="text-white text-sm">
                  {new Date(payment.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-400 text-xs">{payment.description}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    payment.status === "completed"
                      ? "bg-zinc-600/20 text-zinc-300"
                      : "bg-zinc-500/20 text-zinc-400"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm">
                  ${payment.amount.toFixed(2)} {payment.currency}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-300 p-0 h-auto"
                  onClick={() => handleDownloadInvoice(payment.id)}
                >
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
