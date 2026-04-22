import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Target,
  Video,
  Lightbulb,
  BarChart3,
  ArrowRight,
} from "lucide-react";

type Goal = "Awareness" | "Traffic" | "Conversions";
type Platform = "TikTok" | "YouTube" | "Pinterest";
type Industry =
  | "Fitness"
  | "Ecommerce"
  | "SaaS"
  | "Beauty"
  | "Travel"
  | "Food";
type Budget = "under-1000" | "1000-5000" | "5000-20000" | "20000-plus";

type GoalRule = {
  format: string;
  length: string;
  hook: string;
  creative: string;
  strategy: string;
};

const platformRules: Record<Platform, Record<Lowercase<Goal>, GoalRule>> = {
  TikTok: {
    awareness: {
      format: "Short-form vertical video",
      length: "6–15 seconds",
      hook: "Start with a bold problem or payoff in the first 1–2 seconds",
      creative: "UGC-style, fast cuts, native-looking footage",
      strategy:
        "Prioritize scroll-stopping hooks and visible product payoff over polished branding.",
    },
    traffic: {
      format: "Vertical video with clear CTA",
      length: "10–20 seconds",
      hook: "Lead with the value prop, then show the action you want users to take",
      creative: "Creator-led walkthrough or demo",
      strategy: "Balance strong native creative with a clear reason to click.",
    },
    conversions: {
      format: "Demo-first performance video",
      length: "15–30 seconds",
      hook: "Open with the product solving a real pain point immediately",
      creative: "Testimonial, before/after, offer-led creative",
      strategy: "Show proof fast and remove friction with one clear CTA.",
    },
  },
  YouTube: {
    awareness: {
      format: "Skippable in-stream or short video",
      length: "15–30 seconds",
      hook: "Brand and message should land before the skip moment",
      creative: "Story-driven video with early brand cues",
      strategy:
        "Front-load brand recognition while keeping the opening emotionally or visually interesting.",
    },
    traffic: {
      format: "Explainer or product demo video",
      length: "20–45 seconds",
      hook: "State the problem and show why the solution matters early",
      creative: "Demo-led with benefit callouts",
      strategy: "Focus on clarity and credibility to earn the click.",
    },
    conversions: {
      format: "Product proof video",
      length: "20–45 seconds",
      hook: "Open with strongest proof point or offer",
      creative: "Product demo + testimonial + CTA",
      strategy: "Use proof, specificity, and intent-driven messaging.",
    },
  },
  Pinterest: {
    awareness: {
      format: "Vertical video or motion-led static",
      length: "6–15 seconds",
      hook: "Lead with inspiration and the end-state benefit",
      creative: "Aspirational visuals with clean text overlays",
      strategy:
        "Match discovery behavior by making the creative feel useful, inspiring, and save-worthy.",
    },
    traffic: {
      format: "Idea-led video or static sequence",
      length: "6–20 seconds",
      hook: "Show the use case first, then reinforce with text",
      creative: "Search- and intent-friendly visuals",
      strategy: "Lean into utility and relevance rather than disruption.",
    },
    conversions: {
      format: "Solution-oriented video or static",
      length: "10–20 seconds",
      hook: "Show the product in-context solving a need",
      creative: "Product-forward with benefit overlays",
      strategy:
        "Connect intent to action with clear benefits and frictionless CTA language.",
    },
  },
};

const industryModifiers: Record<Industry, string[]> = {
  Fitness: [
    "Use transformation, routine, or goal-based messaging.",
    "Show the product in action, not just posed visuals.",
  ],
  Ecommerce: [
    "Feature the product within the first few seconds.",
    "Test social proof, limited-time framing, and product close-ups.",
  ],
  SaaS: [
    "Lead with workflow pain points and time-saving benefits.",
    "Use simple UI demonstration rather than abstract claims.",
  ],
  Beauty: [
    "Before-and-after or real-use results can be powerful.",
    "Keep visuals clean and show texture, finish, or routine context.",
  ],
  Travel: [
    "Open with destination payoff or emotional outcome.",
    "Use immersive visuals and benefit-led overlays.",
  ],
  Food: [
    "Lead with appetite appeal and sensory visuals.",
    "Pair crave-worthy visuals with one clear reason to act now.",
  ],
};

function getBudgetNote(budget: Budget): string {
  if (budget === "under-1000")
    return "With a smaller budget, focus on 1–2 strong creative concepts instead of spreading spend too thin.";
  if (budget === "1000-5000")
    return "Use this budget to test 2–3 hooks or formats and learn quickly before scaling.";
  if (budget === "5000-20000")
    return "You have enough room to test multiple hook styles and creator angles while keeping one primary CTA.";
  if (budget === "20000-plus")
    return "Use this budget to build a structured testing plan across multiple creative variants and audience segments.";
  return "Start with a focused creative test plan tied to one primary success metric.";
}

type Recommendation = {
  summary: string;
  format: string;
  length: string;
  hook: string;
  creative: string;
  strategy: string;
  tests: string[];
  industryNotes: string[];
  budgetNote: string;
  ideaFeedback: string;
};

function getRecommendation({
  platform,
  goal,
  industry,
  budget,
  idea,
}: {
  platform: Platform;
  goal: Goal;
  industry: Industry;
  budget: Budget;
  idea: string;
}): Recommendation {
  const normalizedGoal = goal.toLowerCase() as Lowercase<Goal>;
  const platformData =
    platformRules[platform]?.[normalizedGoal] ?? {
      format: "Short-form video",
      length: "10–20 seconds",
      hook: "Lead with the strongest user pain point immediately",
      creative: "Native-feeling creative aligned to the platform",
      strategy: "Keep the message focused, visual, and outcome-driven.",
    };

  const modifiers =
    industryModifiers[industry] ?? [
      "Keep the message simple and user-centered.",
      "Show the product or value quickly.",
    ];

  const ideaFeedback = idea?.trim()
    ? `Given your concept — "${idea.trim()}" — I would keep the opening tighter and ensure the payoff is visible immediately rather than explained too late.`
    : "If you already have a concept, test whether the value is obvious in the opening seconds without needing extra explanation.";

  return {
    summary: `For a ${goal} campaign on ${platform}, the strongest starting point is ${platformData.format.toLowerCase()} creative that quickly communicates the value and matches how users already engage on the platform.`,
    format: platformData.format,
    length: platformData.length,
    hook: platformData.hook,
    creative: platformData.creative,
    strategy: platformData.strategy,
    tests: [
      "Test two opening hooks with the same core message.",
      "Compare creator-led vs product-led framing.",
      "Keep one CTA consistent so the test isolates creative differences.",
    ],
    industryNotes: modifiers,
    budgetNote: getBudgetNote(budget),
    ideaFeedback,
  };
}

export default function App() {
  const [platform, setPlatform] = useState<Platform>("TikTok");
  const [goal, setGoal] = useState<Goal>("Awareness");
  const [industry, setIndustry] = useState<Industry>("Fitness");
  const [budget, setBudget] = useState<Budget>("1000-5000");
  const [brandName, setBrandName] = useState("");
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const recommendation = useMemo(
    () => getRecommendation({ platform, goal, industry, budget, idea }),
    [platform, goal, industry, budget, idea],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full">PM Project MVP</Badge>
                <Badge variant="secondary" className="rounded-full">
                  AdTech
                </Badge>
              </div>
              <CardTitle className="mt-3 text-3xl font-semibold tracking-tight">
                Ad Creative Optimization Assistant
              </CardTitle>
              <CardDescription className="text-base leading-7 text-slate-600">
                A lightweight tool that helps creators and marketers decide what
                kind of ad creative to make before launching a campaign.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Campaign input</CardTitle>
                <CardDescription>
                  Fill in a few details and generate creative guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={platform}
                      onValueChange={(v) => setPlatform(v as Platform)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Pinterest">Pinterest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Campaign goal</Label>
                    <Select
                      value={goal}
                      onValueChange={(v) => setGoal(v as Goal)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Awareness">Awareness</SelectItem>
                        <SelectItem value="Traffic">Traffic</SelectItem>
                        <SelectItem value="Conversions">Conversions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select
                      value={industry}
                      onValueChange={(v) => setIndustry(v as Industry)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Budget range</Label>
                    <Select
                      value={budget}
                      onValueChange={(v) => setBudget(v as Budget)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1000">Under $1,000</SelectItem>
                        <SelectItem value="1000-5000">
                          $1,000–$5,000
                        </SelectItem>
                        <SelectItem value="5000-20000">
                          $5,000–$20,000
                        </SelectItem>
                        <SelectItem value="20000-plus">$20,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Brand or creator name</Label>
                  <Input
                    className="rounded-xl"
                    placeholder="Example: GlowFuel, CoachMia, PeakForm"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current creative idea (optional)</Label>
                  <Textarea
                    className="min-h-[120px] rounded-xl"
                    placeholder="Example: We want a quick creator-led video showing a pre-workout routine and ending with a promo code."
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full rounded-xl"
                  onClick={() => setSubmitted(true)}
                >
                  Generate creative recommendation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <CardTitle className="text-xl">
                    Recommendation output
                  </CardTitle>
                </div>
                <CardDescription>
                  {submitted
                    ? `Guidance for ${brandName || "your campaign"}`
                    : "Your recommendation will appear here after you submit the form."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {submitted ? (
                  <>
                    <Card className="rounded-2xl border border-slate-200 shadow-none">
                      <CardContent className="p-5">
                        <p className="text-sm leading-7 text-slate-700">
                          {recommendation.summary}
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2">
                      <InfoCard
                        icon={<Video className="h-4 w-4" />}
                        title="Recommended format"
                        value={recommendation.format}
                      />
                      <InfoCard
                        icon={<BarChart3 className="h-4 w-4" />}
                        title="Suggested length"
                        value={recommendation.length}
                      />
                      <InfoCard
                        icon={<Target className="h-4 w-4" />}
                        title="Hook strategy"
                        value={recommendation.hook}
                      />
                      <InfoCard
                        icon={<Lightbulb className="h-4 w-4" />}
                        title="Creative direction"
                        value={recommendation.creative}
                      />
                    </div>

                    <Section title="Strategic guidance">
                      <p>{recommendation.strategy}</p>
                    </Section>

                    <Section title="What to test first">
                      <ul className="list-disc space-y-2 pl-5">
                        {recommendation.tests.map((test) => (
                          <li key={test}>{test}</li>
                        ))}
                      </ul>
                    </Section>

                    <Section title="Industry-specific notes">
                      <ul className="list-disc space-y-2 pl-5">
                        {recommendation.industryNotes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </Section>

                    <Section title="Budget guidance">
                      <p>{recommendation.budgetNote}</p>
                    </Section>

                    <Section title="Feedback on your current idea">
                      <p>{recommendation.ideaFeedback}</p>
                    </Section>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm leading-7 text-slate-500">
                    Enter campaign details on the left to preview how the tool
                    recommends creative strategy, format, hooks, and testing
                    ideas.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-none">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          {icon}
          <p className="text-xs uppercase tracking-wide">{title}</p>
        </div>
        <p className="text-sm leading-6 text-slate-800">{value}</p>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="text-sm leading-7 text-slate-700">{children}</div>
    </div>
  );
}
