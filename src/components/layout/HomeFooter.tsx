"use client";
import { Users, Building2, Trophy } from "lucide-react";

export default function HomeFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-secondary/50 to-secondary">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-primary">
            ¿Por qué elegirnos?
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-primary/30" />
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Entrenadores Expertos",
              description: "Aprende de los mejores profesionales del vóley",
            },
            {
              icon: Building2,
              title: "Instalaciones de Primera",
              description: "Entrena en canchas de alta calidad y con equipamiento moderno",
            },
            {
              icon: Trophy,
              title: "Ambiente Motivador",
              description: "Únete a una comunidad apasionada por el vóley",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl bg-card/50 p-8 transition-all duration-300 hover:bg-card hover:shadow-lg"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent opacity-0 blur transition duration-300 group-hover:opacity-100" />

              <div className="mb-6 flex justify-center">
                <div className="relative rounded-xl bg-primary/10 p-4 ring-2 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:ring-primary/30">
                  <feature.icon className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              <h3 className="mb-3 text-center text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>

              <p className="text-center text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
