"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  Eye,
  Heart,
  Users,
  Briefcase,
  GraduationCap,
  Rocket,
  MapPin,
  Sparkles,
  ShieldCheck,
  FileText,
  Scale,
  IndianRupee,
  Clock,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  Award,
  Building2,
  Mic,
  Palette,
  UserCheck,
  CreditCard,
  Phone,
  Image as ImageIcon,
  Smartphone,
  Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type BannerId =
  | "about"
  | "leadership"
  | "mentorship"
  | "community"
  | "legal"
  | "blinkit";

interface Banner {
  id: BannerId;
  title: string;
  subtitle: string;
  image: string;
  eyebrow: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const BANNERS: Banner[] = [
  {
    id: "about",
    eyebrow: "Who We Are",
    title: "About NextAaroh",
    subtitle:
      "Empowering Youth with Skills, Leadership, Employment & Entrepreneurship.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "leadership",
    eyebrow: "Meet The Team",
    title: "Leadership Team",
    subtitle: "Founder • CEO • Vice President • Vision",
    image: "https://i.ibb.co/FLSWVBRS/file-00000000e3c4820b909a19b0b2817fcf.png",
  },
  {
    id: "mentorship",
    eyebrow: "Guidance That Matters",
    title: "Mentorship & Guidance",
    subtitle: "Experienced Mentors Building Future Leaders",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "community",
    eyebrow: "Together We Grow",
    title: "Community & Creative Hub",
    subtitle: "Building a Strong Community Together",
    image:
      "https://images.unsplash.com/photo-1552664688-cf412ec27db2?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "legal",
    eyebrow: "Governance & Trust",
    title: "Legal Team",
    subtitle: "Legal Support & Organizational Compliance",
    image:
      "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "blinkit",
    eyebrow: "We're Hiring",
    title: "Blinkit Picker Onboarding Vacancy",
    subtitle: "Apply Now • Weekly Payout • Flexible Shift • Career Growth",
    image: "https://i.ibb.co/LhxLG6Qw/file-0000000016088230bf54db22c28f205c.png",
  },
];

const MISSION_ITEMS = [
  { icon: Sparkles, label: "Skill Development" },
  { icon: Users, label: "Leadership" },
  { icon: Briefcase, label: "Employment" },
  { icon: Award, label: "Sports" },
  { icon: Rocket, label: "Entrepreneurship" },
  { icon: Smartphone, label: "Digital Skills" },
  { icon: Target, label: "Innovation" },
];

const CORE_VALUES = [
  "Leadership",
  "Respect",
  "Integrity",
  "Innovation",
  "Learning",
  "Teamwork",
];

const FUTURE_GOALS = [
  { icon: Briefcase, label: "Jobs" },
  { icon: Award, label: "Sports" },
  { icon: Users, label: "Leadership" },
  { icon: GraduationCap, label: "Education" },
  { icon: Rocket, label: "Entrepreneurship" },
  { icon: Sparkles, label: "Technology" },
  { icon: MapPin, label: "Rural Development" },
];

const LEGAL_TEAM = [
  {
    name: "Legal Advisor",
    designation: "Legal Advisory",
    points: ["Legal Counsel", "Risk Assessment", "Contract Review"],
  },
  {
    name: "Compliance Officer",
    designation: "Compliance Management",
    points: ["Regulatory Compliance", "Audit Support", "Policy Enforcement"],
  },
  {
    name: "Documentation Coordinator",
    designation: "Documentation",
    points: ["Record Maintenance", "Filing & Archiving", "Data Accuracy"],
  },
  {
    name: "Policy Coordinator",
    designation: "Policy Management",
    points: ["Policy Drafting", "Internal Guidelines", "Governance Support"],
  },
  {
    name: "Legal Executive",
    designation: "Legal Operations",
    points: ["Day-to-day Legal Ops", "Documentation Support", "Coordination"],
  },
];

/* ------------------------------------------------------------------ */
/*  Reusable UI primitives                                             */
/* ------------------------------------------------------------------ */

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
        <Icon className="h-4.5 w-4.5" strokeWidth={2.25} />
      </span>
      <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h3>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/10 px-3.5 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm">
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      {children}
    </span>
  );
}

function ProfileCard({
  name,
  designation,
  points,
  bio,
}: {
  name: string;
  designation: string;
  points: string[];
  bio?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-3xl bg-white/70 dark:bg-white/5 p-5 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md shadow-lg shadow-black/5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-base font-bold text-white shadow-md">
          {initials}
        </div>
        <div>
          <p className="text-base font-bold text-neutral-900 dark:text-white">
            {name}
          </p>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            {designation}
          </p>
        </div>
      </div>

      {bio && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {bio}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {points.map((p) => (
          <span
            key={p}
            className="rounded-full bg-neutral-900/5 dark:bg-white/10 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal body per banner                                              */
/* ------------------------------------------------------------------ */

function AboutModalBody() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading icon={Building2} title="About NextAaroh" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          NextAaroh is a youth-first development platform built to close the
          gap between potential and opportunity. We work at the intersection
          of skill-building, leadership, sports and entrepreneurship to help
          young people from every background discover what they&apos;re
          capable of and turn it into a career. What began as a small,
          community-driven initiative has grown into a movement focused on
          practical, real-world impact — training, mentoring and connecting
          youth to the opportunities that shape their future.
        </p>
      </div>

      <div>
        <SectionHeading icon={Target} title="Mission" />
        <div className="flex flex-wrap gap-2.5">
          {MISSION_ITEMS.map((item) => (
            <Pill key={item.label}>{item.label}</Pill>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading icon={Eye} title="Vision" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          To build India&apos;s most trusted youth development platform —
          one that every young person can rely on for skills, guidance and
          real career opportunities.
        </p>
      </div>

      <div>
        <SectionHeading icon={Heart} title="Core Values" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CORE_VALUES.map((v) => (
            <div
              key={v}
              className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-white/5 dark:to-white/5 px-4 py-3 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/10"
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadershipModalBody() {
  return (
    <div className="space-y-8">
      <ProfileCard
        name="Shailesh Kumar Chauhan"
        designation="Founder & CEO"
        points={[
          "Organization Leadership",
          "Product Development",
          "Technology",
          "Innovation",
          "Business Strategy",
          "Partnerships",
          "Community Building",
          "Career Opportunities",
        ]}
        bio="As the Founder and CEO of NextAaroh, Shailesh Kumar Chauhan drives the organization's vision, strategy and growth. He leads product development and technology initiatives while forging partnerships that open real career pathways for youth. Under his leadership, NextAaroh has grown into a platform trusted for building skills, communities and opportunities that last."
      />
      <ProfileCard
        name="Mandeep Kumar"
        designation="Vice President"
        points={[
          "Physical Education",
          "Sports Development",
          "Youth Guidance",
          "Leadership Development",
          "Event Management",
          "Team Coordination",
          "Organizational Growth",
          "Community Engagement",
        ]}
        bio="As Vice President, Mandeep Kumar leads NextAaroh's sports and physical education initiatives, believing that discipline on the field builds leadership off it. He designs youth guidance programs, coordinates large-scale events and mentors emerging leaders within the organization. His hands-on approach to team coordination and community engagement has been instrumental in strengthening NextAaroh's grassroots presence."
      />

      <div>
        <SectionHeading icon={Sparkles} title="Why NextAaroh" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          NextAaroh was created because too many capable young people lack
          access to the right guidance, skills and opportunities — especially
          in rural and underserved areas. We exist to close that gap through
          youth empowerment, career guidance, sports, employment and
          entrepreneurship support, with a strong focus on rural development
          and the goals of Digital India.
        </p>
      </div>

      <div>
        <SectionHeading icon={Rocket} title="Future Goals" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FUTURE_GOALS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 py-4 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm"
            >
              <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MentorshipModalBody() {
  return (
    <div className="space-y-8">
      <ProfileCard
        name="Mr. Vimal Ekka Sir"
        designation="Senior Mentor"
        points={[
          "Communication Skills",
          "Youth Guidance",
          "Personality Development",
          "Career Counseling",
          "Leadership Mentorship",
          "Public Speaking",
          "Professional Behaviour",
        ]}
        bio="Mr. Vimal Ekka Sir brings years of experience in youth guidance and personal development to NextAaroh. As Senior Mentor, he helps young people sharpen their communication skills, build confident public speaking abilities and develop the professional behaviour needed to succeed in any career. His counseling sessions blend practical career advice with genuine personal mentorship, helping mentees turn ambition into a clear, actionable path forward."
      />

      <div>
        <SectionHeading icon={Mic} title="Mentorship Vision" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Great mentorship turns raw potential into real confidence. At
          NextAaroh, mentorship is not a one-time session — it&apos;s an
          ongoing relationship where experienced guides listen, challenge and
          support young people as they grow. Through personalized guidance,
          honest feedback and consistent encouragement, our mentors help
          youth develop the self-belief, communication and decision-making
          skills required to lead — in their careers, their communities and
          their own lives.
        </p>
      </div>
    </div>
  );
}

function CommunityModalBody() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading icon={Palette} title="Creative Team" />
        <ProfileCard
          name="Shailesh Kumar Chauhan"
          designation="Creative Direction"
          points={["Editing", "Graphic Design", "Video Editing", "Creative Direction", "Branding"]}
          bio="Beyond his role as Founder, Shailesh personally shapes NextAaroh's creative identity — from graphic design and branding to editing the video content that tells the organization's story to the world."
        />
      </div>

      <div>
        <SectionHeading icon={UserCheck} title="Community Team" />
        <div className="grid sm:grid-cols-2 gap-4">
          <ProfileCard
            name="Prithviraj"
            designation="Community Coordinator"
            points={["Outreach", "Member Support", "Event Coordination"]}
            bio="Prithviraj works closely with local members to keep the NextAaroh community active and connected, coordinating outreach efforts and on-ground events that bring people together."
          />
          <ProfileCard
            name="Rajabali"
            designation="Community Coordinator"
            points={["Engagement", "Grassroots Connect", "Support"]}
            bio="Rajabali focuses on grassroots engagement, ensuring every community member feels supported, heard and included as NextAaroh continues to grow."
          />
        </div>
      </div>
    </div>
  );
}

function LegalModalBody() {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading icon={Scale} title="NextAaroh Legal Team" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          The NextAaroh Legal Team ensures that every aspect of the
          organization operates with complete documentation, regulatory
          compliance, legal awareness and strong governance — protecting both
          the organization and the community it serves.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {LEGAL_TEAM.map((member) => (
          <ProfileCard
            key={member.name}
            name={member.name}
            designation={member.designation}
            points={member.points}
          />
        ))}
      </div>
    </div>
  );
}

function BlinkitModalBody() {
  const handleApply = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.grofers.customerapp",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading icon={Briefcase} title="About the Job" />
        <p className="text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          NextAaroh is helping connect motivated youth with warehouse picker
          opportunities at Blinkit. This is a great entry point into
          organized retail and logistics work — offering weekly payouts,
          flexible shifts and a clear path for career growth.
        </p>
      </div>

      <div>
        <SectionHeading icon={ImageIcon} title="Job Details" />
        <div className="flex flex-wrap gap-2.5">
          <Pill>Picker</Pill>
          <Pill>Warehouse</Pill>
          <Pill>Flexible Shift</Pill>
          <Pill>Career Growth</Pill>
        </div>
      </div>

      <div>
        <SectionHeading icon={ShieldCheck} title="Eligibility" />
        <div className="flex flex-wrap gap-2.5">
          <Pill>18+ Age</Pill>
          <Pill>Aadhaar</Pill>
          <Pill>PAN</Pill>
          <Pill>Bank Account</Pill>
          <Pill>Mobile Number</Pill>
        </div>
      </div>

      <div>
        <SectionHeading icon={TrendingUp} title="Benefits" />
        <div className="flex flex-wrap gap-2.5">
          <Pill>Weekly Payout</Pill>
          <Pill>Flexible Timing</Pill>
          <Pill>Safe Workplace</Pill>
          <Pill>Growth Opportunity</Pill>
        </div>
      </div>

      <div>
        <SectionHeading icon={FileText} title="Documents Required" />
        <div className="flex flex-wrap gap-2.5">
          <Pill>Aadhaar Card</Pill>
          <Pill>PAN Card</Pill>
          <Pill>Bank Passbook</Pill>
          <Pill>Passport Size Photo</Pill>
          <Pill>Mobile Number</Pill>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-white/5 dark:to-white/5 p-5 ring-1 ring-emerald-500/10">
        <div className="flex items-center gap-2.5 mb-1.5">
          <IndianRupee className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-bold text-neutral-900 dark:text-white">
            Salary
          </p>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Salary depends on location, warehouse and company policy.
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> Weekly Payout
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5" /> Flexible Shift
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" /> Mobile Required
        </span>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Apply Now
        <ExternalLink className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function renderModalBody(id: BannerId) {
  switch (id) {
    case "about":
      return <AboutModalBody />;
    case "leadership":
      return <LeadershipModalBody />;
    case "mentorship":
      return <MentorshipModalBody />;
    case "community":
      return <CommunityModalBody />;
    case "legal":
      return <LegalModalBody />;
    case "blinkit":
      return <BlinkitModalBody />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Modal shell                                                        */
/* ------------------------------------------------------------------ */

function BannerModal({
  banner,
  onClose,
}: {
  banner: Banner;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md animate-[fadeIn_.25s_ease-out]"
      />

      {/* panel */}
      <div
        className="relative flex w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white/90 dark:bg-neutral-900/85 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-2xl animate-[scaleIn_.3s_cubic-bezier(0.16,1,0.3,1)]"
        role="dialog"
        aria-modal="true"
        aria-label={banner.title}
      >
        {/* sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 px-5 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {banner.eyebrow}
            </p>
            <h2 className="truncate text-lg font-extrabold text-neutral-900 dark:text-white sm:text-xl">
              {banner.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-600 ring-1 ring-black/5 transition-colors hover:bg-neutral-900/10 dark:bg-white/10 dark:text-neutral-200 dark:ring-white/10 dark:hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {renderModalBody(banner.id)}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Carousel                                                           */
/* ------------------------------------------------------------------ */

const AUTO_SLIDE_MS = 4000;

export default function BannerCarousel() {
  const slides = [BANNERS[BANNERS.length - 1], ...BANNERS, BANNERS[0]];
  const [index, setIndex] = useState(1); // maps to BANNERS[0]
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setWithTransition(true);
    setIndex(next);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // autoplay
  useEffect(() => {
    if (isPaused || activeBanner) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => i + 1);
    }, AUTO_SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeBanner]);

  // handle infinite-loop snap-back
  const handleTransitionEnd = () => {
    if (index === slides.length - 1) {
      setWithTransition(false);
      setIndex(1);
    } else if (index === 0) {
      setWithTransition(false);
      setIndex(slides.length - 2);
    }
  };

  // re-enable transition on next tick after a snap
  useEffect(() => {
    if (!withTransition) {
      const id = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(id);
    }
  }, [withTransition]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const delta = touchDeltaX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  const realIndex =
    index === 0
      ? BANNERS.length - 1
      : index === slides.length - 1
        ? 0
        : index - 1;

  return (
    <section className="relative w-full py-8 sm:py-12">
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: translateY(24px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>

      {/* header */}
      <div className="mx-auto mb-6 max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            NextAaroh
          </h1>
        </div>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
          Empowering Youth Through Skills, Leadership, Sports &amp; Career
          Opportunities.
        </p>
      </div>

      {/* carousel */}
      <div
        className="group relative mx-auto max-w-6xl px-4 sm:px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative overflow-hidden rounded-3xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: withTransition
                ? "transform 600ms cubic-bezier(0.22,1,0.36,1)"
                : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((banner, i) => (
              <button
                type="button"
                key={`${banner.id}-${i}`}
                onClick={() => setActiveBanner(banner)}
                className="relative aspect-video w-full shrink-0 overflow-hidden rounded-3xl text-left shadow-2xl shadow-black/20 ring-1 ring-black/5 dark:ring-white/10"
                aria-label={`${banner.title} — open details`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  draggable={false}
                  className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/0" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90 ring-1 ring-white/20 backdrop-blur-md">
                    {banner.eyebrow}
                  </span>
                  <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl">
                    {banner.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm text-white/80 sm:text-base line-clamp-2">
                    {banner.subtitle}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/20">
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* arrows — desktop */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous banner"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2.5 text-neutral-800 opacity-0 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:bg-white group-hover:opacity-100 sm:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next banner"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2.5 text-neutral-800 opacity-0 shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:bg-white group-hover:opacity-100 sm:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {BANNERS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Go to ${b.title}`}
              onClick={() => goTo(i + 1)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === realIndex
                  ? "w-6 bg-emerald-500"
                  : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>
      </div>

      {activeBanner && (
        <BannerModal banner={activeBanner} onClose={() => setActiveBanner(null)} />
      )}
    </section>
  );
}