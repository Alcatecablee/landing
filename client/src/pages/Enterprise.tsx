import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Enterprise = () => {
  const features = [
    {
      title: "Enterprise Security",
      description:
        "SOC 2 compliance, advanced security controls, and audit logging",
      link: "/enterprise/sso",
    },
    {
      title: "Advanced Analytics",
      description:
        "Comprehensive reporting, team insights, and performance metrics",
      link: "/enterprise/analytics",
    },
    {
      title: "Rule-Based Analysis",
      description:
        "Advanced AST parsing and sophisticated pattern matching for code transformation",
      link: "/enterprise/market",
    },
    {
      title: "Webhook System",
      description:
        "Real-time integrations with your enterprise tools and workflows",
      link: "/enterprise/webhooks",
    },
  ];

  const benefits = [
    "Unlimited code analysis across all repositories",
    "Priority support with dedicated account management",
    "Custom rule development and implementation",
    "Advanced team collaboration and governance",
    "Enterprise-grade security and compliance",
    "Custom integrations and API access",
    "Training and onboarding for your team",
    "SLA guarantees with 99.9% uptime",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="mb-6 inline-block border border-zinc-800 px-4 md:px-6 py-2 text-sm font-medium text-zinc-300 rounded-lg transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/50 animate-fade-in-scale">
            Enterprise Edition
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 tracking-tight text-white animate-slide-in-up animate-delay-200">
            Enterprise-Grade
            <br />
            Code Intelligence
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-4xl mx-auto mb-8 md:mb-12 px-4 animate-slide-in-up animate-delay-300">
            Advanced features designed for large-scale development teams and
            organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center animate-slide-in-up animate-delay-500">
            <Button className="bg-white text-black px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:bg-zinc-200 w-full sm:w-auto touch-manipulation">
              Request Demo
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:bg-zinc-800 w-full sm:w-auto touch-manipulation"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 md:py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-white">
              Enterprise Features
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto px-4">
              Advanced capabilities designed for enterprise-scale development
              teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="group block">
                <Card
                  className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) hover:bg-zinc-800 cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-xl focus:scale-105 focus:-translate-y-1 focus:shadow-xl touch-manipulation h-full"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <CardHeader className="pb-3 md:pb-4">
                    <CardTitle className="text-white text-lg md:text-xl font-bold group-hover:text-zinc-300 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">
                Why Choose Enterprise?
              </h2>
              <p className="text-xl text-zinc-300 mb-8">
                Get everything you need to scale code quality across your entire
                organization with advanced features, dedicated support, and
                enterprise-grade security.
              </p>
              <Button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200">
                Get Started Today
              </Button>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0" />
                  <p className="text-zinc-300 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12">
              <h2 className="text-4xl font-black mb-6 text-white">
                Ready to Scale Your Code Quality?
              </h2>
              <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                Join leading enterprises who trust NeuroLint to maintain code
                quality at scale. Contact our team for a personalized demo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-zinc-200">
                  Schedule Demo
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-white px-8 py-4 text-lg font-semibold hover:bg-zinc-800"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Enterprise;
