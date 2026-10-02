import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight">AI Niche Scout</h1>
      <p className="text-muted-foreground">Scaffold is ready. Building in progress.</p>
      <ModeToggle />
    </main>
  );
}
