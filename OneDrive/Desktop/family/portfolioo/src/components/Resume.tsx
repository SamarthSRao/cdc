"use client";

import { motion } from "framer-motion";
import { Mail, Github, Twitter, MapPin, Globe, Linkedin, ExternalLink } from "lucide-react";

export default function Resume({ onClose }: { onClose?: () => void }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.01, zIndex: 100 }}
      initial={{ zIndex: 10 }}
      className="w-[700px] h-[600px] flex flex-col relative overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-3xl"
      style={{
        backgroundColor: "#111111",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "rgba(0, 0, 0, 0.9) 0px 40px 80px, rgb(0, 0, 0) 0px 0px 0px 0.5px",
      }}
    >
      {/* Top Bar */}
      <div className="flex-none flex items-center h-8 px-4 border-b border-white/[0.05] relative select-none">
        <div className="flex items-center gap-1.5 z-10">
          <button
            onClick={onClose}
            className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors cursor-pointer outline-none"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
        </div>
        <p className="text-[10px] font-mono text-white/40 tracking-[0.2em] absolute left-1/2 -translate-x-1/2 uppercase pointer-events-none">
          SAMARTH_RESUME.PDF
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-6 font-sans scrollbar-hide bg-[#1a1a1a]/40 selection:bg-white/10 selection:text-white">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Samarth S Rao</h1>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-white/40 font-mono tracking-wide">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-blue-400/50" />
              <span>Bengaluru, India</span>
            </div>
            <a href="mailto:Samarthz0901@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail size={13} className="text-blue-400/50" />
              <span>Samarthz0901@gmail.com</span>
            </a>
            <a href="https://linkedin.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Linkedin size={13} className="text-blue-400/50" />
              <span>LinkedIn</span>
            </a>
            <a href="https://github.com/SamarthSRao" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Github size={13} className="text-blue-400/50" />
              <span>GitHub</span>
            </a>
          </div>
        </header>

        <div className="w-full h-px bg-white/5 mb-8" />

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-6 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" /> EDUCATION
          </h2>
          <div className="pl-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-[16px] font-bold text-white">JSS Academy of Technology</h3>
              <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest mt-1">May 2027</span>
            </div>
            <p className="text-[13px] text-white/60">Bachelor of Engineering, Computer Science</p>
            <p className="text-[11px] text-white/30 font-mono mt-1">Bangalore, India</p>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-6 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" /> PROJECTS
          </h2>
          <div className="space-y-8 pl-3">
            <ProjectItem
              title="Jss Rooms – Campus Connectivity"
              link="https://jssroom.space"
              description="Built a dynamic real-time collaboration and event management platform. Used by 400+ students during college fests."
              tech="Go, PostgreSQL, WebSockets, React 19, Framer Motion"
              highlights={[
                "Custom WebSocket hub for ephemeral chat rooms",
                "Digital ticketing system with dynamic QR code generation",
                "Industrial design system with GSAP animations"
              ]}
            />
            <ProjectItem
              title="Eco-Quest – Sustainable Tracker"
              link="https://github.com/SamarthSRao/eco-rewards"
              description="Agentic-ready platform to incentivize sustainable living via activity tracking and rewards."
              tech="Node.js, MongoDB, Express, React 18, JWT"
              highlights={[
                "JWT-based security with custom middleware",
                "Real-time weather integration & interactive dashboards",
                "Scalable backend with Mongoose data modeling"
              ]}
            />
            <ProjectItem
              title="Inter Prep – Collaborative Interview Prep"
              link="https://prepterview.vercel.app"
              description="Comprehensive platform to organize and master technical interview questions across categories."
              tech="Golang, Gin, PostgreSQL, React, Tailwind CSS"
              highlights={[
                "High-performance RESTful APIs built with Go/Gin",
                "PostgreSQL schema with automated migrations",
                "Real-time search capabilities for users and topics"
              ]}
            />
          </div>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-6 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" /> SKILLS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-3">
            <SkillSection title="Backend & Architecture" skills={["RESTful APIs", "Microservices", "gRPC", "JWT", "OAuth2", "Event-Driven Architecture"]} />
            <SkillSection title="Programming" skills={["Java", "Go", "JavaScript", "TypeScript", "SQL"]} />
            <SkillSection title="DB & Infra" skills={["PostgreSQL", "MongoDB", "Redis", "Apache Kafka", "Docker", "Linux Shell"]} />
            <SkillSection title="Tools" skills={["CI/CD Pipelines", "Git / GitHub", "Vite", "Framer Motion"]} />
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-10">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 mb-6 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500" /> CERTIFICATIONS
          </h2>
          <div className="space-y-3 pl-3">
            <div className="flex justify-between items-baseline">
              <p className="text-[14px] text-white/80">Data Structures and Algorithms in Java</p>
              <span className="text-[10px] text-white/30 font-mono">Udemy</span>
            </div>
            <div className="flex justify-between items-baseline">
              <p className="text-[14px] text-white/80">Backend Master Class (Go + K8s + gRPC)</p>
              <span className="text-[10px] text-white/30 font-mono">Advanced</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function SkillSection({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div>
      <h3 className="text-[12px] font-bold text-white/40 mb-3 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {skills.map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/[0.05] text-[11px] text-white/60">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectItem({ title, description, tech, highlights, link }: { title: string; description: string, tech: string, highlights: string[], link?: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
          {title}
          {link && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
        </h3>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{tech}</span>
      </div>
      <p className="text-[12px] text-white/50 mb-3 leading-relaxed">{description}</p>
      <ul className="space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className="flex gap-2 text-[11px] text-white/40">
            <span className="text-blue-500/50">•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
