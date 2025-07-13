import React, { useState } from "react";
import { supabase, WaitlistEntry, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Building2,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function Waitlist() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      toast.error("Waitlist is not configured yet. Please check back later!");
      console.error(
        "Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const waitlistEntry: WaitlistEntry = {
        email: formData.email,
        name: formData.name || undefined,
        company: formData.company || undefined,
        status: "pending",
      };

      const { error } = await supabase.from("waitlist").insert([waitlistEntry]);

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        // Show specific error message to user
        const errorMessage =
          error.message || "Something went wrong. Please try again.";
        toast.error(errorMessage);
        return;
      }

      setIsSubmitted(true);
      toast.success("Successfully joined the waitlist!");

      // Reset form
      setFormData({ email: "", name: "", company: "" });
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-zinc-900/70 border-zinc-800 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              You're on the list!
            </CardTitle>
            <CardDescription className="text-zinc-300">
              We'll notify you as soon as NeuroLint is ready for you to try.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-4">
                In the meantime, follow our progress and get updates:
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                  onClick={() =>
                    window.open("https://twitter.com/neurolint", "_blank")
                  }
                >
                  Follow on Twitter
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                  onClick={() =>
                    window.open("https://github.com/neurolint", "_blank")
                  }
                >
                  Star on GitHub
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white"
            >
              Join another email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6 animate-fade-in-blur">
            <span className="px-6 py-3 bg-zinc-900/70 rounded-2xl text-base font-bold backdrop-blur-xl border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300">
              Coming Soon
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">
            NeuroLint is
            <br />
            Almost Ready
          </h1>

          <p className="text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            We're putting the finishing touches on the most advanced code
            analysis platform. Join our waitlist to be among the first to
            experience{" "}
            <span className="text-white font-bold">
              next-generation code transformation
            </span>
            .
          </p>
        </div>

        {/* Waitlist Form */}
        <Card className="w-full max-w-lg mx-auto bg-zinc-900/70 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Join the Waitlist
            </CardTitle>
            <CardDescription className="text-zinc-300 text-center">
              Be the first to know when NeuroLint launches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-zinc-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  required
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-zinc-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-zinc-300 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleInputChange("company")}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-bold hover:bg-gray-100 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-zinc-500 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Status Message */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 transition-opacity duration-300 hover:text-zinc-400">
            Expected launch: Q1 2024 • Join early for exclusive benefits
          </p>
        </div>
      </div>
    </div>
  );
}
