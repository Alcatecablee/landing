import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[];
}

const faqData: FAQItem[] = [
  {
    question: "What is NeuroLint and how does it work?",
    answer:
      "NeuroLint is a React & Next.js modernization platform that helps teams upgrade legacy codebases safely and efficiently. It analyzes your React applications to identify outdated patterns, class components, and Next.js legacy code, then provides automated migration workflows for React 18, Next.js App Router, and modern TypeScript patterns.",
    keywords: [
      "React modernization",
      "Next.js migration",
      "legacy upgrade",
      "TypeScript",
      "React 18",
      "App Router",
    ],
  },
  {
    question:
      "What types of React and Next.js modernization does NeuroLint handle?",
    answer:
      "NeuroLint specializes in React 16→18 upgrades, class-to-hooks conversions, Next.js Pages Router to App Router migrations, TypeScript config modernization, and deprecated pattern fixes. Our platform identifies technical debt and provides safe, automated upgrade paths with rollback protection.",
    keywords: [
      "React 18 upgrade",
      "class to hooks",
      "App Router migration",
      "TypeScript modernization",
      "technical debt",
      "legacy patterns",
    ],
  },
  {
    question: "How safe are NeuroLint's automated migrations?",
    answer:
      "NeuroLint prioritizes migration safety with detailed diff previews, rollback protection, and dry-run modes. Every transformation is validated before application, and you can review all changes before committing. We provide backup strategies and incremental migration options to minimize risk.",
    keywords: [
      "migration safety",
      "rollback protection",
      "diff preview",
      "dry-run mode",
      "validation",
      "backup",
    ],
  },
  {
    question:
      "Can I integrate NeuroLint with my existing development workflow?",
    answer:
      "Yes! NeuroLint offers a CLI tool for automated migrations, VS Code extension for in-editor modernization assistance, and CI/CD integrations. You can run modernization scans on pull requests, integrate with GitHub Actions, and use our API for custom workflows.",
    keywords: [
      "CLI tool",
      "VS Code extension",
      "CI/CD integration",
      "GitHub Actions",
      "API",
      "pull requests",
      "workflow",
    ],
  },
  {
    question: "What's included in the free vs premium plans?",
    answer:
      "The free plan includes unlimited project scanning and basic modernization reports. Premium unlocks detailed migration plans with PDF exports, one-click batch migrations, rollback protection, and team collaboration features. We also offer project-based billing for one-time migrations ($1k-$10k).",
    keywords: [
      "free plan",
      "premium features",
      "migration plans",
      "batch migrations",
      "project billing",
      "team collaboration",
    ],
  },
  {
    question: "How reliable are NeuroLint's React and Next.js migrations?",
    answer:
      "NeuroLint's migrations are highly reliable thanks to our specialized React and Next.js pattern recognition. We use AST-based transformations, extensive testing on real-world codebases, and incremental migration strategies. Each migration includes validation steps and rollback options for peace of mind.",
    keywords: [
      "migration reliability",
      "pattern recognition",
      "AST transformations",
      "validation",
      "rollback options",
      "testing",
    ],
  },
  {
    question: "Can NeuroLint modernize large React applications?",
    answer:
      "Yes! NeuroLint handles enterprise-scale React applications efficiently. We use incremental migration strategies, allowing you to modernize components gradually without breaking your application. Our platform supports codebases with hundreds of components and provides migration progress tracking.",
    keywords: [
      "large React apps",
      "enterprise scale",
      "incremental migration",
      "progress tracking",
      "component migration",
      "scalability",
    ],
  },
  {
    question: "Can I customize migration rules for my team's needs?",
    answer:
      "Yes! Premium and enterprise plans allow custom migration rules and patterns specific to your codebase. You can configure which React patterns to modernize, set Next.js migration preferences, and integrate with your existing TypeScript and ESLint configurations.",
    keywords: [
      "custom migration rules",
      "team configuration",
      "React patterns",
      "Next.js preferences",
      "TypeScript config",
      "ESLint integration",
    ],
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer comprehensive support including documentation, video tutorials, email support, and live chat. Pro customers get priority support with faster response times. Enterprise customers receive dedicated account management, onboarding assistance, and custom training sessions.",
    keywords: [
      "support",
      "documentation",
      "tutorials",
      "priority support",
      "enterprise support",
    ],
  },
  {
    question: "How do I start modernizing my React app with NeuroLint?",
    answer:
      "Start with a free modernization scan! Connect your GitHub repo or upload your code to get a detailed analysis of legacy patterns and upgrade opportunities. Then use our CLI tool or VS Code extension to begin incremental migrations. No subscription required for the initial scan.",
    keywords: [
      "modernization scan",
      "GitHub integration",
      "legacy analysis",
      "CLI tool",
      "VS Code extension",
      "free scan",
    ],
  },
];

const FAQItem: React.FC<{
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-white pr-4">
          {faq.question}
        </h3>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <div className="pt-2 border-t border-zinc-800">
            <p className="text-zinc-300 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Generate JSON-LD structured data for SEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section
        className="py-24 px-4"
        id="faq"
        role="region"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl backdrop-blur-sm mb-6">
              <HelpCircle className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-zinc-400">
                Frequently Asked Questions
              </span>
            </div>

            <h2
              id="faq-heading"
              className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white"
            >
              Everything You Need to Know
            </h2>

            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-medium">
              Get answers to common questions about NeuroLint's React & Next.js
              modernization, migration workflows, pricing, and team features.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-16 text-center">
            <div className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4">
                Still have questions?
              </h3>
              <p className="text-zinc-400 mb-6">
                Our team is here to help you get the most out of NeuroLint.
                Reach out for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@neurolint.com"
                  className="inline-flex items-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/docs"
                  className="inline-flex items-center px-6 py-3 bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors"
                >
                  View Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
