"use client";

import Image from "next/image";
import { motion, type Variants, type Transition } from "framer-motion";
import { MapPin, Download, Eye } from "lucide-react";
import { Mail, MessageCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const ease: Transition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };

/* ── Data sourced from context/murad-profile.md ───────────────────────────── */
const stats = [
  "5 projects deployed",
  "3 channels automated live",
  "45 automated tests written",
  "168 hrs/week autonomous runtime",
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/Murad-Hasil",
    Icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muradhasil/",
    Icon: LinkedinIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923142241393",
    Icon: MessageCircle,
  },
  {
    label: "Email",
    href: "mailto:mbmuradhasil@gmail.com",
    Icon: Mail,
  },
] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: ease },
};

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ease}
          className="mb-12 text-center"
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--accent-cyan)",
            }}
          >
            {"// About"}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            About Me
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-14 items-start"
        >
          {/* Profile photo */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-4 md:items-start"
          >
            <div
              className="relative w-44 h-44 rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                border: "2px solid var(--border-subtle)",
                boxShadow: "0 0 32px rgba(0,212,255,0.07)",
              }}
            >
              <Image
                src="/profile/murad.png"
                alt="Murad Hasil"
                fill
                sizes="176px"
                className="object-cover"
                priority
              />
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={label}
                  className="transition-colors duration-200 hover:text-[var(--accent-cyan)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <div>
            {/* Bio */}
            <motion.div variants={fadeUp} className="mb-6">
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                I build AI systems that help businesses automate repetitive
                work, reduce operational overhead, and improve how they handle
                customer support, internal workflows, and data processing.
              </p>
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                My journey started in full-stack development, but I quickly
                realized most businesses didn&apos;t just need more software,
                they needed systems that could actually do the work
                automatically. That shift led me into AI automation.
              </p>
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Since 2023, I&apos;ve focused on building production-ready AI
                systems designed for real business use, not just demos. My work
                includes custom AI chatbots, RAG knowledge systems, and
                workflow automation built to solve practical operational
                problems.
              </p>
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                What makes my approach different is spec-driven execution.
                Before writing code, I define requirements, workflows, edge
                cases, and system architecture clearly so every build is
                reliable, scalable, and structured for real-world deployment.
              </p>
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                The result: fewer surprises, less rework, and AI systems that
                genuinely save businesses time and money.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                If repetitive manual work is slowing your business down, I
                build systems designed to fix that. Let&apos;s talk.
              </p>
            </motion.div>

            {/* Location + education */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <span
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <MapPin size={14} />
                Karachi, Pakistan
              </span>
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent-indigo)",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                AI Automation Engineer
              </span>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              {stats.map((phrase) => (
                <div
                  key={phrase}
                  className="rounded-lg p-4 text-center flex items-center justify-center"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {phrase}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
                style={{
                  background: "var(--accent-cyan)",
                  color: "#08080F",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                <Download size={14} />
                Download Resume
              </a>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
                style={{
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                <Eye size={14} />
                View Projects
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
