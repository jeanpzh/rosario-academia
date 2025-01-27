export default function HomeMain() {
  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex items-center justify-center gap-8">
        <a href="#" target="_blank" rel="noreferrer"></a>
        <span className="h-6 rotate-45 border-l" />
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer"></a>
      </div>
      <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
      <p className="mx-auto max-w-xl text-center text-3xl !leading-tight lg:text-4xl">
        Academia{" "}
        <a href="#" target="_blank" className="font-bold hover:underline" rel="noreferrer">
          Rosario
        </a>{" "}
      </p>
      <div className="my-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-px" />
    </div>
  );
}
