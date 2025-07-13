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
      <div className="relative overflow-hidden bg-black text-white">
        <div className="flex items-center justify-center min-h-screen px-4 py-16">
          <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-700 backdrop-blur-xl shadow-2xl animate-slide-in-up">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-20 h-20 bg-zinc-800/50 rounded-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 border border-zinc-700">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F52b46fbc49c34422a0037fa4f335b74e%2Fbb939da26bfc4cc796ee9f5b0cc88eec?format=webp&width=800"
                  alt="NeuroLint Logo"
                  className="w-12 h-12 object-contain"
                  loading="eager"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                You're on the list!
              </CardTitle>
              <CardDescription className="text-zinc-400">
                We'll notify you as soon as NeuroLint is ready for you to try.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                  In the meantime, follow our progress and get updates:
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50 transition-all duration-300 h-11"
                    onClick={() =>
                      window.open("https://x.com/neurolint", "_blank")
                    }
                  >
                    Follow on X
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="ghost"
                className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 h-11"
              >
                Join another email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-zinc-900/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-zinc-800/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="mb-6 sm:mb-8 animate-fade-in-blur">
              <span className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-zinc-900/80 rounded-2xl text-sm sm:text-base font-medium backdrop-blur-xl border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/90 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black">
                Coming Soon
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tight text-white leading-none animate-slide-in-up">
              NeuroLint is
              <br />
              <span className="relative">
                Almost Ready
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-zinc-600 rounded-full transform scale-x-0 animate-[scale-x_1s_ease-out_1.5s_forwards]"></div>
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 animate-slide-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              We're putting the finishing touches on the most advanced code
              analysis platform. Join our waitlist to be among the first to
              experience{" "}
              <span className="text-white font-semibold relative">
                next-generation code transformation
              </span>
              .
            </p>
          </div>

          {/* Waitlist Form */}
          <Card
            className="w-full max-w-md mx-auto bg-zinc-900/80 border-zinc-700 backdrop-blur-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02] focus-within:scale-[1.02] animate-slide-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-zinc-700">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F52b46fbc49c34422a0037fa4f335b74e%2Fbb939da26bfc4cc796ee9f5b0cc88eec?format=webp&width=800"
                  alt="NeuroLint Logo"
                  className="w-10 h-10 object-contain"
                  loading="eager"
                />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
                Join the Waitlist
              </CardTitle>
              <CardDescription className="text-zinc-400 text-sm sm:text-base">
                Be the first to know when NeuroLint launches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-zinc-300 text-sm font-medium flex items-center gap-2 transition-colors duration-200 hover:text-white"
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
                    className="bg-zinc-800/70 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-300 h-12 text-base focus:ring-2 focus:ring-zinc-500/20 focus:ring-offset-0"
                    aria-describedby="email-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-zinc-300 text-sm font-medium flex items-center gap-2 transition-colors duration-200 hover:text-white"
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
                    className="bg-zinc-800/70 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-300 h-12 text-base focus:ring-2 focus:ring-zinc-500/20 focus:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-zinc-300 text-sm font-medium flex items-center gap-2 transition-colors duration-200 hover:text-white"
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
                    className="bg-zinc-800/70 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-zinc-500 focus:bg-zinc-800 transition-all duration-300 h-12 text-base focus:ring-2 focus:ring-zinc-500/20 focus:ring-offset-0"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-semibold hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black mt-8 group"
                  aria-describedby={
                    isSubmitting ? "submitting-status" : undefined
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="w-4 h-4 mr-2 animate-spin"
                        aria-hidden="true"
                      />
                      <span id="submitting-status">Joining...</span>
                    </>
                  ) : (
                    <>
                      Join Waitlist
                      <ArrowRight
                        className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Button>

                <p className="text-xs text-zinc-500 text-center leading-relaxed pt-2">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
