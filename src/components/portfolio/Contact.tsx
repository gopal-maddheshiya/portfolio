import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { PERSONAL_INFO } from "@/data/profile";
import { Reveal } from "./Reveal";
import { Section, SectionHeading } from "./Section";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function buildMessage({
  name,
  email,
  subject,
  message,
}: FormState) {
  return `Hello Gopal,

Name: ${name}
Email: ${email}
Subject: ${subject || "General Enquiry"}

${message}`;
}

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sending, setSending] = useState(false);

  const update =
    (key: keyof FormState) =>
    (event: { target: { value: string } }) => {
      setForm((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));

      // Clear messages when user starts editing again
      if (error) setError("");
      if (success) setSuccess("");
    };

  const validate = () => {
    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      setSuccess("");
      return false;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      setSuccess("");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return false;
    }

    if (!trimmedMessage) {
      setError("Please enter your message.");
      setSuccess("");
      return false;
    }

    setError("");
    return true;
  };

  // -----------------------------
  // WhatsApp
  // -----------------------------
  const handleWhatsApp = (event?: FormEvent) => {
    if (event) event.preventDefault();

    if (!validate()) return;

    const text = encodeURIComponent(buildMessage(form));

    window.open(
      `https://wa.me/${PERSONAL_INFO.whatsapp}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // -----------------------------
  // EmailJS
  // -----------------------------
  const handleEmail = async (event?: FormEvent) => {
    if (event) event.preventDefault();

    if (!validate()) return;

    setSending(true);
    setError("");
    setSuccess("");

    try {
      await emailjs.send(
        "service_njyc3k2",
        "template_il42ptj",
        {
          name: form.name.trim(),
          from_name: form.name.trim(),
          user_name: form.name.trim(),
          email: form.email.trim(),
          from_email: form.email.trim(),
          user_email: form.email.trim(),
          reply_to: form.email.trim(),
          to_name: "Gopal Maddheshiya",
          subject:
            form.subject.trim() ||
            `Portfolio enquiry from ${form.name.trim()}`,
          message: form.message.trim(),
        },
        {
          publicKey: "-7KHeknrjHN-f2QH5",
        }
      );

      setForm(EMPTY);

      setSuccess(
        "Your message has been sent successfully! I'll get back to you soon."
      );
    } catch (err) {
      console.error("EmailJS error:", err);

      setError(
        "Unable to send your message via email right now. Please try WhatsApp or email directly."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something useful."
        description="Have an internship opportunity, project idea, or simply want to connect? Send me a message."
      />

      <div className="mt-8 sm:mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Contact Form */}
        <Reveal>
          <form
            onSubmit={handleEmail}
            noValidate
            className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8"
          >
            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-xs sm:text-sm font-medium text-foreground"
                >
                  Name <span className="text-primary">*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  required
                  disabled={sending}
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your name"
                  className={`mt-1.5 sm:mt-2 ${inputClass}`}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-medium text-foreground"
                >
                  Email <span className="text-primary">*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={sending}
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  className={`mt-1.5 sm:mt-2 ${inputClass}`}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="mt-4 sm:mt-5">
              <label
                htmlFor="subject"
                className="text-xs sm:text-sm font-medium text-foreground"
              >
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                disabled={sending}
                value={form.subject}
                onChange={update("subject")}
                placeholder="Internship opportunity / Project inquiry"
                className={`mt-1.5 sm:mt-2 ${inputClass}`}
              />
            </div>

            {/* Message */}
            <div className="mt-4 sm:mt-5">
              <label
                htmlFor="message"
                className="text-xs sm:text-sm font-medium text-foreground"
              >
                Message <span className="text-primary">*</span>
              </label>

              <textarea
                id="message"
                name="message"
                required
                disabled={sending}
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="Tell me a bit about the role or project."
                className={`mt-1.5 sm:mt-2 resize-y ${inputClass}`}
              />
            </div>

            {/* Success message */}
            {success ? (
              <div
                role="status"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs sm:text-sm text-primary"
              >
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{success}</span>
              </div>
            ) : null}

            {/* Error message */}
            {error ? (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            ) : null}

            {/* Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-col gap-3 sm:flex-row">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handleWhatsApp()}
                disabled={sending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-soft cursor-pointer"
              >
                <MessageCircle
                  className="size-4 shrink-0"
                  aria-hidden="true"
                />

                <span>Send via WhatsApp</span>
              </button>

              {/* Email */}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium transition-all hover:bg-secondary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {sending ? (
                  <>
                    <Loader2
                      className="size-4 shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Send via Email</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 text-[11px] sm:text-xs text-muted-foreground">
              WhatsApp opens in a new tab. Email is delivered
              directly to my inbox.
            </p>
          </form>
        </Reveal>

        {/* Direct Contact */}
        <Reveal
          delay={80}
          className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">
              Direct contact
            </h3>

            <ul className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm">
              {/* Email */}
              <li>
                <a
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground transition-colors hover:text-foreground break-all"
                  href={`mailto:${PERSONAL_INFO.email}`}
                >
                  <Mail
                    className="size-4 text-primary shrink-0"
                    aria-hidden="true"
                  />

                  <span>{PERSONAL_INFO.email}</span>
                </a>
              </li>

              {/* WhatsApp / Phone */}
              <li>
                <a
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground transition-colors hover:text-foreground"
                  href={`https://wa.me/${PERSONAL_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone
                    className="size-4 text-primary shrink-0"
                    aria-hidden="true"
                  />

                  <span>{PERSONAL_INFO.phone}</span>
                </a>
              </li>

              {/* Location */}
              <li className="inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground">
                <MapPin
                  className="size-4 text-primary shrink-0"
                  aria-hidden="true"
                />

                <span>{PERSONAL_INFO.location}</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="mt-6 sm:mt-8 flex gap-2">
            {/* GitHub */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex size-10 sm:size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Github
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </a>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex size-10 sm:size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Linkedin
                className="size-4 shrink-0"
                aria-hidden="true"
              />
            </a>

            {/* LeetCode */}
            <a
              href={PERSONAL_INFO.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LeetCode profile"
              className="flex size-10 sm:size-11 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              LC
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}