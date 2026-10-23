import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";
import { Marquee } from "../components/ui/Marquee";
import { ImageBand } from "../components/ui/ImageBand";
import { SocialIcon } from "../components/Icons";
import { useToast } from "../context/ToastContext";
import { FAQ, PROFILE, SOCIALS } from "../lib/data";
import { cx } from "../lib/utils";

const PROJECT_TYPES = [
  "Website / landing page",
  "AI tool or backend",
  "Video edit / motion",
  "Open source collab",
  "Internship / role",
  "Something else",
];

const BUDGETS = ["< ₹10k", "₹10k – ₹40k", "₹40k – ₹1L", "₹1L+", "Not sure yet"];

interface FormState {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  projectType: PROJECT_TYPES[0],
  budget: BUDGETS[4],
  message: "",
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) errors.name = "Please tell me what to call you.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = "That email doesn't look right.";
  if (form.message.trim().length < 12)
    errors.message = "A sentence or two about the project, please.";
  return errors;
}

function FaqItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <Reveal delay={(Math.min(index, 2)) as 0 | 1 | 2} className="border-b border-line">
      <button
        type="button"
        id={buttonId}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-5 py-5 text-left transition-colors duration-300 hover:text-[#4b58ff]"
      >
        <span className="font-serif-ed text-[19px] leading-snug md:text-[21px]">{item.q}</span>
        <ChevronDown
          className={cx(
            "mt-1.5 h-4 w-4 flex-none text-muted transition-transform duration-400",
            open && "rotate-180"
          )}
          style={{ transitionTimingFunction: "var(--ease)" }}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="grid transition-[grid-template-rows] duration-500"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transitionTimingFunction: "var(--ease)",
        }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-[13.5px] leading-relaxed text-muted">{item.a}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function Contact() {
  const { show } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [draft, setDraft] = useState<{ subject: string; body: string; mailto: string } | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key as keyof FormErrors]: undefined }));
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      show("Email copied to clipboard");
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      show("Check the highlighted fields");
      return;
    }

    const subject = `${form.projectType} — enquiry from ${form.name.trim()}`;
    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Project type: ${form.projectType}`,
      `Budget: ${form.budget}`,
      "",
      form.message.trim(),
      "",
      "— Sent from adarshukumar.dev contact form",
    ].join("\n");

    const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // A mailto: hands off to the OS and gives us no receipt, so the panel says
    // "your app should be open" and repeats every field as a fallback the
    // visitor can copy. Nothing claims the message was delivered.
    setSent(true);
    setDraft({ subject, body, mailto });
    show("Opening your email app…");
    window.location.href = mailto;
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSent(false);
  };

  return (
    <>
      <PageHero
        kicker="Contact / 007"
        title="Let's talk."
        outline="Let's build."
        description="I'm always happy to meet thoughtful people with ambitious ideas. Tell me what you're working on — the form below opens a pre-filled email, or you can write directly."
        meta={
          <>
            <span className="chip">
              <span className="chip-dot" style={{ ["--dot-color" as string]: "#35d07f" }} />
              {PROFILE.availability}
            </span>
            <span className="chip">
              <Clock className="h-3 w-3" aria-hidden="true" /> Usually replies within a day
            </span>
            <span className="chip">
              <MapPin className="h-3 w-3" aria-hidden="true" /> {PROFILE.locationLine}
            </span>
          </>
        }
      />

      {/* ───────────────────  form + details  ─────────────────── */}
      <section className="section-pad" aria-labelledby="form-title">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <div className="rounded-[20px] border border-line bg-surface p-[clamp(20px,3vw,36px)]">
              {sent ? (
                <div className="flex flex-col items-start gap-5 py-8">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-full"
                    style={{ background: "var(--acid)", color: "var(--acid-ink)" }}
                    aria-hidden="true"
                  >
                    <Check className="h-7 w-7" />
                  </span>
                  <h2 className="font-serif-ed text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">
                    Your email app should be open.
                  </h2>
                  <p className="max-w-md text-[13.5px] leading-relaxed text-muted">
                    Everything you typed is already filled in — just hit send. If nothing opened,
                    write to{" "}
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="border-b border-linestrong text-ink"
                    >
                      {PROFILE.email}
                    </a>{" "}
                    directly and I'll get back to you.
                  </p>
                  {draft ? (
                    <div className="w-full rounded-[14px] border border-line bg-surface2/60 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="micro-label">Your message, if you need to copy it</span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(draft.mailto);
                              show("Message copied — paste it anywhere");
                            } catch {
                              show("Copy failed — select the text below");
                            }
                          }}
                          className="text-link text-[12px]"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-mono-code text-[11.5px] leading-relaxed text-muted">
{draft.body}
                      </pre>
                    </div>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-3">
                    <Magnetic>
                      <button type="button" onClick={reset} className="btn btn-outline btn-sm">
                        Write another
                      </button>
                    </Magnetic>
                    <Magnetic>
                      <a href={`mailto:${PROFILE.email}`} className="btn btn-sm">
                        Open mail again
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </Magnetic>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-7 flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] leading-none uppercase">
                      Start a conversation
                    </h2>
                    <span className="micro-label hidden sm:block">5 fields</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="micro-label">
                        Your name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(event) => update("name", event.target.value)}
                        placeholder="Jane Doe"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={cx("field", errors.name && "field-error")}
                      />
                      {errors.name ? (
                        <span id="name-error" className="text-[11.5px] text-red">
                          {errors.name}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="micro-label">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder="jane@studio.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={cx("field", errors.email && "field-error")}
                      />
                      {errors.email ? (
                        <span id="email-error" className="text-[11.5px] text-red">
                          {errors.email}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="projectType" className="micro-label">
                        What do you need?
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={form.projectType}
                        onChange={(event) => update("projectType", event.target.value)}
                        className="field"
                      >
                        {PROJECT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="budget" className="micro-label">
                        Budget range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={form.budget}
                        onChange={(event) => update("budget", event.target.value)}
                        className="field"
                      >
                        {BUDGETS.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <label htmlFor="message" className="micro-label">
                        Tell me about it
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={(event) => update("message", event.target.value)}
                        placeholder="What are you building, who is it for, and when do you need it?"
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        className={cx("field resize-y", errors.message && "field-error")}
                      />
                      <div className="flex items-center justify-between gap-3">
                        {errors.message ? (
                          <span id="message-error" className="text-[11.5px] text-red">
                            {errors.message}
                          </span>
                        ) : (
                          <span className="text-[11.5px] text-muted">
                            The more context, the more honest the estimate.
                          </span>
                        )}
                        <span className="font-mono-code text-[11px] text-muted tabular-nums">
                          {form.message.trim().length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-7">
                    <Magnetic>
                      <button type="submit" className="btn">
                        Send the message
                        <Send aria-hidden="true" />
                      </button>
                    </Magnetic>
                    <Magnetic>
                      <button type="button" onClick={copyEmail} className="btn btn-outline">
                        Copy email instead
                        <Copy aria-hidden="true" />
                      </button>
                    </Magnetic>
                    <span className="micro-label ml-auto hidden sm:block">
                      Opens your mail app
                    </span>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* direct details */}
          <div className="flex flex-col gap-5">
            <Reveal delay={1} className="rounded-[20px] border border-line bg-surface p-6">
              <span className="micro-label mb-4 block">Direct</span>
              <a
                href={`mailto:${PROFILE.email}`}
                className="group flex items-start gap-3.5 border-b border-line pb-5"
              >
                <span className="icon-disc !h-10 !w-10 flex-none">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="micro-label block">Email</span>
                  <span className="block truncate text-[13.5px] transition-colors group-hover:text-[#4b58ff]">
                    {PROFILE.email}
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-3.5 pt-5">
                <span className="icon-disc !h-10 !w-10 flex-none">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="micro-label block">Based in</span>
                  <span className="block text-[13.5px]">{PROFILE.locationLine}</span>
                </span>
              </div>
            </Reveal>

            <Reveal delay={2} className="rounded-[20px] border border-line bg-surface p-6">
              <span className="micro-label mb-4 block">Or find me here</span>
              <ul className="flex flex-col gap-1">
                {SOCIALS.filter((social) => social.key !== "email")
                  .slice(0, 6)
                  .map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.url}
                        target={social.url.startsWith("http") ? "_blank" : undefined}
                        rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 rounded-[10px] px-2 py-2.5 transition-colors duration-300 hover:bg-surface2"
                      >
                        <SocialIcon social={social.key} className="h-4 w-4 flex-none text-muted transition-colors group-hover:text-ink" />
                        <span className="text-[13px]">{social.name}</span>
                        <span className="font-mono-code ml-auto truncate text-[11px] text-muted">
                          {social.handle}
                        </span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 flex-none text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
              </ul>
            </Reveal>

            <Reveal delay={3} className="relative overflow-hidden rounded-[20px] bg-[#0b0b0b] p-6 text-[#f4f1e9]">
              <div
                className="blob pointer-events-none -right-16 -bottom-20 h-56 w-56 opacity-60"
                style={{ background: "var(--acid)" }}
                aria-hidden="true"
              />
              <div className="relative">
                <span className="micro-label mb-3 block !text-white/45">Open for</span>
                <ul className="flex flex-col gap-2.5">
                  {["AI / ML projects", "Open source collab", "Freelance AI dev", "Research partnerships"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2.5 text-[13px] text-white/75">
                        <span
                          className="h-1.5 w-1.5 flex-none rounded-full"
                          style={{ background: "var(--acid)" }}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee words={["Let's talk", "Let's build", "Ship it", "Learn from it", "Do it better"]} />

      <ImageBand
        src="/img/delhi.jpg"
        alt="A busy street scene in Delhi, India"
        kicker="Delhi, India — working worldwide"
        align="center"
      >
        Based in Delhi, building for anyone with a good idea —{" "}
        <em className="italic">timezones have never once been the problem.</em>
      </ImageBand>

      {/* ───────────────────  FAQ  ─────────────────── */}
      <section className="section-pad" aria-labelledby="faq-title">
        <SectionHeading
          kicker="Before you write"
          title={
            <>
              Questions I
              <br />
              <em>get a lot.</em>
            </>
          }
          description="If yours isn't here, that's what the form is for."
        />

        <div className="border-t border-line">
          {FAQ.map((item, index) => (
            <FaqItem key={item.q} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ───────────────────  response promise  ─────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="promise-title">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Within a day",
              desc: "Every message gets a real reply — not a template. Usually the same day, always within one.",
            },
            {
              title: "Honest estimates",
              desc: "You'll get a number and what it covers, including what I'd cut if the budget is tight.",
            },
            {
              title: "No lock-in",
              desc: "Clean, commented code handed over with a walkthrough. You own everything I build for you.",
            },
          ].map((item, index) => (
            <Reveal
              as="article"
              key={item.title}
              delay={(index % 3) as 0 | 1 | 2}
              className="border-t border-line pt-6"
            >
              <span className="micro-label mb-4 block">
                {String(index + 1).padStart(2, "0")} / Promise
              </span>
              <h3 className="font-display mb-3 text-[20px] leading-tight uppercase">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-muted">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export default Contact;
