function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.53 3.68 1.446 5.194L2 22l4.94-1.406A9.947 9.947 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.94 7.94 0 0 1-4.05-1.11l-.29-.172-3.024.862.85-2.98-.19-.306A7.95 7.95 0 1 1 12 20z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452z" />
    </svg>
  );
}

const CHANNELS = [
  {
    name: "YouTube",
    icon: YoutubeIcon,
    reason: "Career roadmap, skill tutorials aur interview tips wale free videos.",
    url: "https://youtube.com/@nextaaroh?si=Myk9M61sW-eigc-c",
    color: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
  {
    name: "Instagram",
    icon: InstagramIcon,
    reason: "Daily Learning, quick career tips aur behind-the-scenes updates.",
    url: "https://www.instagram.com/nextaaroh?igsh=MXNxcHY5ZXIyanI1dw==",
    color: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
    reason: "NextAaroh community updates aur events ki latest jaankari.",
    url: "https://www.facebook.com/share/1RgGyLD9cA/",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    name: "WhatsApp Channel",
    icon: WhatsappIcon,
    reason: "Naye jobs, opportunities aur updates sabse pehle seedha phone par.",
    url: "https://whatsapp.com/channel/0029Vb8ehOB545v42vzs9Q0m",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    name: "LinkedIn",
    icon: LinkedinIcon,
    reason: "Professional network banao aur job/internship updates paao.",
    url: "https://www.linkedin.com/in/next-aaroh-aa0288428?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
];

export default function SocialChannels() {
  return (
    <section className="px-4 py-6">
      <h2 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Humse Judiye
      </h2>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Career updates, tips aur opportunities kabhi miss mat karo.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-start gap-2 rounded-xl border border-neutral-200 p-3 transition hover:border-indigo-300 hover:shadow-sm dark:border-neutral-800"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${c.color}`}>
                <Icon size={18} />
              </span>
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {c.name}
              </span>
              <span className="text-xs leading-snug text-neutral-500 dark:text-neutral-400">
                {c.reason}
              </span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Join →
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
