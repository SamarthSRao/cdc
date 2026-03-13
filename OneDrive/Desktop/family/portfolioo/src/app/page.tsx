import Header from "@/components/header";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-background">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-40" />
      
      {/* Header */}
      <Header />

      {/* Content Area (User will build here) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto pt-32 px-6">
        <h1 className="text-foreground/20 text-sm font-mono uppercase tracking-widest">
          Portfolio Workspace
        </h1>
      </div>
    </main>
  );
}
