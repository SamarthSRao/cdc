"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Github, Twitter, MapPin, Linkedin, Globe, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#ededed] font-sans selection:bg-white/10 selection:text-white pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Desktop</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-32 px-6 sm:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4">
                Samarth S Rao
              </h1>
              <p className="text-xl sm:text-2xl text-white/50 font-medium">
                Backend Developer & Computer Science Student @ JSS Academy
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-4 text-sm text-white/40">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500/50" />
                <span>Bengaluru, India</span>
              </div>
              <a href="mailto:Samarthz0901@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-500/50" />
                <span>Samarthz0901@gmail.com</span>
              </a>
              <a href="https://linkedin.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4 text-blue-500/50" />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/SamarthSRao" className="flex items-center gap-3 hover:text-white transition-colors">
                <Github className="w-4 h-4 text-blue-500/50" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="w-full h-px bg-white/5" />
        </header>

        {/* Education Section */}
        <Section title="EDUCATION">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <h3 className="text-2xl font-bold text-white">JSS Academy of Technology</h3>
            <span className="text-sm font-mono text-white/30 tracking-widest uppercase">May 2027</span>
          </div>
          <p className="text-lg text-white/60 mb-2">Bachelor of Engineering in Computer Science</p>
          <p className="text-sm font-mono text-white/20 uppercase tracking-widest font-medium">Bangalore, India</p>
        </Section>

        {/* Projects Section */}
        <Section title="FEATURED PROJECTS">
          <div className="space-y-16 mt-4">
            <ProjectItem
              title="Jss Rooms"
              subtitle="Campus Connectivity and Event Management Website"
              link="https://jssroom.space"
              description="Built a dynamic real-time collaboration and event management platform designed for college students to connect, chat, and participate in campus activities."
              tech={["React 19", "Go", "PostgreSQL", "WebSockets", "GSAP", "Framer Motion"]}
              bullets={[
                "Successfully scaled to 100+ active users during college festivals and activities.",
                "Custom WebSocket hub for ephemeral chat rooms and real-time interaction.",
                "Digital ticketing system where users receive unique QR codes for event registration, which Admins can scan and verify in real-time.",
                "Distinctive Industrial design system using Custom CSS and GSAP for immersive animations."
              ]}
            />
            <ProjectItem
              title="Eco-Quest"
              subtitle="Sustainable Activity Tracker & Rewards Platform"
              link="https://github.com/SamarthSRao/eco-rewards"
              description="Robust agentic-ready web platform to incentivize sustainable living by tracking eco-friendly activities and rewarding users with points and milestones."
              tech={["Node.js", "Express", "MongoDB", "React 18", "Tailwind CSS", "JWT"]}
              bullets={[
                "Designed a secure and scalable backend with Node.js and MongoDB featuring JWT-based authentication.",
                "Developed a dynamic and responsive frontend with React 18 and Tailwind CSS for real-time visualization of user progress.",
                "Integrated weather APIs and data visualization for leaderboard rankings and milestone tracking."
              ]}
            />
            <ProjectItem
              title="Inter Prep"
              subtitle="Collaborative Technical Interview Preparation Platform"
              link="https://prepterview.vercel.app"
              description="A comprehensive preparation platform to help users organize, practice, and master technical interview questions across various categories."
              tech={["Go", "Gin Framework", "PostgreSQL", "React 18", "Vite", "JWT"]}
              bullets={[
                "High-performance backend using Go and Gin for optimized RESTful API handling.",
                "Robust PostgreSQL database schema with automated migrations for managing specialized question sets.",
                "Seamless user experience for candidates to track progress and collaborate on interview materials."
              ]}
            />
          </div>
        </Section>

        {/* Skills Section */}
        <Section title="TECHNICAL SKILLS">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            <SkillRow
              label="Backend & Architecture"
              skills={["Restful APIs", "Microservices", "gRPC", "JWT Authentication", "OAuth2", "Event-Driven Architecture"]}
            />
            <SkillRow
              label="Programming Languages"
              skills={["Java", "Go", "JavaScript", "TypeScript"]}
            />
            <SkillRow
              label="Databases & Infra"
              skills={["PostgreSQL", "MongoDB", "Redis", "Apache Kafka", "Message Queues", "Docker", "Linux Shell"]}
            />
            <SkillRow
              label="Tools & DevOps"
              skills={["CI/CD Pipelines", "Git / GitHub", "Vite", "Framer Motion", "GORM"]}
            />
          </div>
        </Section>

        {/* Certifications Section */}
        <Section title="CERTIFICATIONS">
          <div className="space-y-6">
            <div className="flex justify-between items-baseline group">
              <div>
                <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Data Structures and Algorithms in Java</h4>
                <p className="text-white/40 mt-1">Udemy • Comprehensive Mastery of Algorithms and Data Structures</p>
              </div>
              <span className="text-sm font-mono text-white/20 whitespace-nowrap ml-8">Udemy</span>
            </div>
            <div className="flex justify-between items-baseline group">
              <div>
                <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Backend Master Class</h4>
                <p className="text-white/40 mt-1">Advanced Backend Development with Golang, PostgreSQL, Kubernetes, and gRPC</p>
              </div>
              <span className="text-sm font-mono text-white/20 whitespace-nowrap ml-8">Advanced</span>
            </div>
          </div>
        </Section>

      </main>

      {/* Footer Decoration */}
      <footer className="py-24 flex justify-center opacity-10">
        <div className="w-1.5 h-1.5 rounded-full bg-white mx-8" />
        <div className="w-1.5 h-1.5 rounded-full bg-white mx-8" />
        <div className="w-1.5 h-1.5 rounded-full bg-white mx-8" />
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-24">
      <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white/20 mb-12 flex items-center gap-4">
        {title}
        <div className="flex-1 h-px bg-white/5" />
      </h2>
      <div className="px-1">{children}</div>
    </section>
  );
}

function ProjectItem({ title, subtitle, description, tech, bullets, link }: { title: string; subtitle: string; description: string; tech: string[]; bullets: string[]; link?: string }) {
  return (
    <div className="group">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
            {link && <a href={link} className="text-white/20 hover:text-white transition-colors"><ExternalLink size={16} /></a>}
          </div>
          <p className="text-lg text-white/40 font-medium">{subtitle}</p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-2">
          {tech.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded border border-white/10 text-[11px] font-mono text-white/40 uppercase group-hover:border-white/20 transition-colors">
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-3xl">
        {description}
      </p>
      <ul className="space-y-4">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-4 text-white/50 leading-relaxed">
            <CheckCircle2 className="w-5 h-5 text-blue-500/30 shrink-0 mt-0.5" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillRow({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-6">{label}</h4>
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {skills.map((s) => (
          <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-sm text-white/70 border border-white/5 hover:border-white/20 hover:text-white transition-all cursor-default">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
