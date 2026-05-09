"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";
import { ExternalLink, FolderOpen } from "lucide-react";
import { GithubIcon } from "@/components/icons";

export type Project = {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  category: string;
  description: string;
  tech: string[];
  live_url: string | null;
  github_url: string | null;
  image?: string;
  demo_note?: string;
};

const FILTERS = [
  "All",
  "AI Agents",
  "Full-Stack + AI",
  "AI Automation",
  "AI / Frontend",
] as const;
type Filter = (typeof FILTERS)[number];

const ease: Transition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: ease },
};

interface ProjectsProps {
  initialProjects: Project[];
}

const INITIAL_VISIBLE = 4;

export function Projects({ initialProjects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filtered =
    activeFilter === "All"
      ? initialProjects
      : initialProjects.filter((p) => p.category === activeFilter);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleFilterChange(f: Filter) {
    setActiveFilter(f);
    setVisibleCount(INITIAL_VISIBLE);
  }

  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
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
            {"// Projects"}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            What I&apos;ve Built
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ease, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {FILTERS.map((f) => (
            <button
              suppressHydrationWarning
              key={f}
              onClick={() => handleFilterChange(f)}
              className="px-4 py-1.5 rounded text-sm transition-all duration-200"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color:
                  activeFilter === f ? "#08080F" : "var(--text-secondary)",
                background:
                  activeFilter === f ? "var(--accent-cyan)" : "transparent",
                border: `1px solid ${
                  activeFilter === f
                    ? "var(--accent-cyan)"
                    : "var(--border-subtle)"
                }`,
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Show More */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ease, delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setVisibleCount((c) => c + 4)}
              className="px-6 py-2.5 rounded text-sm font-medium transition-all duration-200"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "var(--accent-cyan)",
                border: "1px solid var(--accent-cyan)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(0,212,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              Show More ({filtered.length - visibleCount} remaining)
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const hasLiveUrl =
    project.live_url !== null &&
    project.live_url !== "[your deployed URL]";
  const hasGithub =
    project.github_url !== null &&
    project.github_url !== "[your GitHub repo URL]";

  return (
    <motion.article
      variants={fadeUp}
      className="rounded-lg p-6 flex flex-col"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
      whileHover={{
        boxShadow: "0 0 28px rgba(0,212,255,0.12)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--accent-cyan)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--border-subtle)";
      }}
    >
      {/* Thumbnail */}
      {project.image && (
        <div
          className="rounded-md overflow-hidden mb-4 -mx-6 -mt-6"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <Image
            src={project.image}
            alt={project.title}
            width={600}
            height={300}
            className="w-full h-40 object-cover object-top"
          />
        </div>
      )}

      {/* Category + featured */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: "var(--accent-indigo)",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          {project.category}
        </span>
        {project.featured && (
          <span
            className="text-xs"
            style={{
              color: "var(--accent-cyan)",
              fontFamily: "var(--font-jetbrains-mono)",
            }}
          >
            ★ Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-base mb-2 leading-snug"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text-primary)",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm mb-4 leading-relaxed line-clamp-3 flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        {project.description}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.slice(0, 6).map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--accent-indigo)",
              background: "rgba(99,102,241,0.07)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            [{t}]
          </span>
        ))}
        {project.tech.length > 6 && (
          <span
            className="text-xs px-2 py-0.5"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--text-muted)",
            }}
          >
            +{project.tech.length - 6} more
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xs font-medium transition-colors duration-200 hover:text-[var(--accent-cyan)]"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          <FolderOpen size={13} className="inline mr-1" />
          Case Study →
        </Link>

        {hasLiveUrl ? (
          <a
            href={project.live_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium transition-colors duration-200 hover:text-[var(--accent-cyan)]"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            <ExternalLink size={13} className="inline mr-1" />
            Live Demo
          </a>
        ) : project.demo_note ? (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            Local Deployment
          </span>
        ) : null}

        {hasGithub && (
          <a
            href={project.github_url!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub: ${project.title}`}
            className="transition-colors duration-200 hover:text-[var(--accent-cyan)]"
            style={{ color: "var(--text-muted)" }}
          >
            <GithubIcon size={13} />
          </a>
        )}
      </div>
    </motion.article>
  );
}
