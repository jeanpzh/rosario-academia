import Image from "next/image";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandWhatsapp,
  IconBrandFacebook,
  IconBrandInstagram,
  IconHome,
  IconArticle,
  IconCalendarEvent,
  IconMail,
  IconUserCircle,
} from "@tabler/icons-react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function HomeMain() {
  const navigationLinks = [
    {
      title: "Inicio",
      icon: <IconHome className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#",
    },
    {
      title: "Noticias",
      icon: <IconArticle className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#noticias",
    },
    {
      title: "Planes",
      icon: <IconCalendarEvent className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#planes",
    },
    {
      title: "Eventos",
      icon: <IconCalendarEvent className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#eventos",
    },
    {
      title: "testimonios",
      icon: <IconUserCircle className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#testimonios",
    },
    {
      title: "Contacto",
      icon: <IconMail className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "#contacto",
    },
    {
      title: "WhatsApp",
      icon: <IconBrandWhatsapp className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://wa.me/+51978257871",
    },
    {
      title: "Facebook",
      icon: <IconBrandFacebook className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://www.facebook.com/people/Academia-De-Voleibol-CD-Rosario/100062953882723/",
    },
    {
      title: "Instagram",
      icon: <IconBrandInstagram className="size-full text-neutral-500 dark:text-neutral-300" />,
      href: "https://instagram.com",
    },
  ];

  const testimonials = [
    {
      quote:
        "Nuestra categoría Sub-15 de Rosario acaba de coronarse campeona en este torneo, demostrando entrega, esfuerzo y pasión en cada set. Estamos inmensamente orgullosos de nuestras jugadoras, que con trabajo en equipo y determinación lograron este merecido triunfo. 🙌🏅",
      name: "🔥 ¡Campeonas de la Copa Inicia!",
      designation: "Nuestro Club Logro el 1er Puesto",
      src: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/461248332_861599169281871_7469391401049985808_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=laCaEJ4hg7QQ7kNvgGjlIjD&_nc_oc=AdgAI5csMLfE8n4UmyGO0mStBdamBM10NRLV757_bYtjdmdhXJFaVus3zwOiVegffds&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=AZXQYs9ZS72pVNIFsxS5EnB&oh=00_AYDqsMvhAaJKlp8HIFNCVbaQ1vwCsXlJo19Hpt2IKhni2g&oe=67AF3F40",
    },
    {
      quote:
        "Nuestra categoría Sub-16 de Rosario ha concluido su participación en este emocionante campeonato en Paracas, dejando todo en la cancha y demostrando su talento. Más que un torneo, fue una gran experiencia de aprendizaje, esfuerzo y crecimiento para nuestras jugadoras. ¡Seguimos sumando y mejorando! 🙌🏅",
      name: "Torneo Juvenil",
      designation: "Academia Rosario",
      src: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/475553185_952114686896985_5298658132659183352_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=VsetXc8Yj5kQ7kNvgFDFaVo&_nc_oc=Adj7B99llOQsNnr8I5owxByo2nukOSd8Djs8ORxVfOA_nrZyPu7OmVNFGurSMZF5pv0&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=ACf3A2p_WN7xfBVvzBE0uTV&oh=00_AYBGyCxPOVf4KDR8spWIGxlsb8GHJ3NxW1ipplczvKvpBQ&oe=67AF25DC",
    },
    {
      quote:
        "Nuestra academia Rosario se ha inscrito en el torneo Inicia, listos para demostrar nuestra pasión, esfuerzo y talento en la cancha. Con disciplina y trabajo en equipo, estamos seguros de que daremos lo mejor en cada partido. 🏐 💪 💙",
      name: "Copa Inicia",
      designation: "Vamos por la Copa Inicia",
      src: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/449823596_814925507282571_3650948511189200407_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=iFEprawDuFgQ7kNvgHeiEkH&_nc_oc=Adgk9n0fFPTeuUxAW213pvIF-mRvDd5KdTdTPVvSVw62LFcSkFnfUzKjHYn3dgZiNYw&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=A3XlWrkJiMbYhEGj9K05Bjq&oh=00_AYBk4ZTTi7Txuk2T2VTj-3JrCicjvJ2TfGy72jw_1at3Lg&oe=67AF3016",
    },
    {
      quote:
        "Para cerrar con broche de oro nuestro ciclo de invierno, hemos organizado un emocionante campeonato junto a diversas academias, donde nuestras alumnas pusieron en práctica todo lo aprendido y, sobre todo, ¡disfrutaron al máximo!.Más que una competencia, fue una experiencia llena de aprendizaje, amistad y pasión por el vóley. 🙌🏅",
      name: "Festival de Voleibol Rosario",
      designation: "Festival Rosario",
      src: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/429668901_739130968195359_1719156284860849123_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HAmOod7VZ6wQ7kNvgHqisSV&_nc_oc=Adhp42gwwj2lnEH3XwKhZEcdzlIzzhEnHoMTRHFvVfy5LE2lLXiGtQBkLDt1GV5WelQ&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=ACvb2xef4dA07eAICSL5V66&oh=00_AYBAt-FjVxx6f4uUc9CAaLRntUpdpvaV8EkDLveU3J6AwQ&oe=67AF534E",
    },
    {
      quote:
        " Nuestra academia Rosario ha sido parte del Campeonato Distrital de la Liga de Carabayllo, demostrando esfuerzo, disciplina y amor por el vóley en cada partido. Seguimos sumando experiencia y creciendo como equipo, enfrentándonos a nuevos desafíos con la misma pasión de siempre. 🙌🏅",
      name: "Liga Deportiva Distrital de Voleibol",
      designation: "Participación en la Liga de Carabayllo",
      src: "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/476436385_956177669824020_5382164427717118561_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FYB2pfUkMG0Q7kNvgEkAn_R&_nc_oc=AdgtXmy4hefO7-ipldDIbJhWU_U51JOeEFOQgQuIgabSc6ArglgpM8AgDPlycs6Jzto&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=A5M6FXErUdyZ7YM-3VMbqKn&oh=00_AYBgykvl0skHXW8GghvCg_OAoZFtS_eRr8OYiSUNbV_-IQ&oe=67AF4B80",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-16">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] w-full items-center justify-center">
        <Image
          src="https://images8.alphacoders.com/575/575648.jpg"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 rounded-lg bg-black/0 p-8 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Academia Rosario</h1>
          <p className="mb-8 text-xl md:text-2xl">Formando campeones desde la cuna</p>
          <a
            href="/sign-up"
            className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Únete ahora
          </a>
        </div>
      </section>

      {/* Noticias Destacadas */}
      <section id="noticias" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary">Noticias Destacadas</h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              id: 1,
              title: "Gran victoria en el torneo local",
              description: "Nuestro equipo logró una impresionante victoria...",
              imageUrl:
                "https://movistardeportes.pe/wp-content/uploads/sites/2/2023/10/Proyecto-nuevo-42.jpg",
            },
            {
              id: 2,
              title: "Nuevo programa de entrenamiento",
              description: "Implementamos un innovador programa de entrenamiento...",
              imageUrl:
                "https://wallpapers.com/images/high/volleyball-4k-bright-orange-sunset-abm145nfqiprnr0n.webp",
            },
            {
              id: 3,
              title: "Reconocimiento a nuestros atletas",
              description: "Tres de nuestros atletas fueron nominados para...",
              imageUrl:
                "https://wallpapers.com/images/high/girl-spiking-midair-volleyball-4k-iii24yjkmb6ghp9y.webp",
            },
          ].map((noticia) => (
            <div
              key={noticia.id}
              className="overflow-hidden rounded-lg border border-primary/20 bg-card text-card-foreground shadow-md transition-transform hover:scale-105"
            >
              <img
                src={noticia.imageUrl || "/placeholder.svg"}
                alt={noticia.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-7">
                <h3 className="mb-2 text-xl font-semibold">{noticia.title}</h3>
                <p className="mb-16 text-muted-foreground">{noticia.description}</p>
                <a href="#" className="text-primary transition-colors hover:text-primary/80">
                  Leer más
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Planes - Matrícula */}
      <section id="planes" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold text-primary">Planes - Matrícula</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              nivel: "Avanzado",
              descripcion: "Para jugadores con experiencia competitiva",
              color: "bg-primary",
              icon: "🏐",
            },
            {
              nivel: "Intermedio",
              descripcion: "Para jugadores con conocimientos sólidos",
              color: "bg-primary",
              icon: "🏐",
            },
            {
              nivel: "Básico",
              descripcion: "Para principiantes entusiastas",
              color: "bg-primary",
              icon: "🏐",
            },
          ].map((plan) => (
            <div
              key={plan.nivel}
              className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl"
            >
              {/* Encabezado */}
              <div className={`relative p-6 ${plan.color} text-primary-foreground `}>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{plan.nivel}</h3>
                  <span className="text-2xl">{plan.icon}</span>
                </div>
                <p className="mt-2 text-sm opacity-90">{plan.descripcion}</p>
              </div>

              <div className="p-6">
                {/* Etiqueta Ciclo Verano */}
                <div className="mb-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                    Ciclo Verano
                  </span>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <p className="text-4xl font-bold">S/ 80</p>
                </div>

                {/* Beneficios */}
                <ul className="mb-6 space-y-4">
                  {[
                    "Carnet de estudiante",
                    "Acceso completo a la plataforma",
                    "Entrenamientos personalizados",
                    "Participación en torneos internos",
                  ].map((beneficio) => (
                    <li key={beneficio} className="flex items-center gap-2">
                      <svg
                        className="size-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>

                {/* Botón */}
                <button className="w-full rounded-lg bg-primary py-3 text-lg font-semibold text-primary-foreground  transition-colors hover:bg-primary/90">
                  Matricularme Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section id="eventos" className="w-full max-w-7xl py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold">Próximos Eventos</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card p-6 text-card-foreground shadow-md transition-transform hover:scale-105">
            <img
              src="https://www.businessempresarial.com.pe/wp-content/uploads/2024/07/evento.jpg"
              alt="Torneo de Fútbol"
              className="mb-4 h-60 w-full rounded object-cover"
            />
            <h3 className="mb-2 text-xl font-semibold">
              Charla Informativa - Expositor Said William
            </h3>
            <p className="mb-2 text-muted-foreground">Fecha: 14 de Febrero, 2025</p>
            <p className="mb-4 text-muted-foreground">Lugar: Sede Rosario</p>
            <button className="w-full rounded-lg bg-primary py-3 text-lg font-semibold text-primary-foreground  transition-colors hover:bg-primary/90">
              Más información
            </button>
          </div>
          <div className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card p-6 text-card-foreground shadow-md transition-transform hover:scale-105">
            <img
              src="https://ogbu.unmsm.edu.pe/wp-content/uploads/2022/05/MG_9827-scaled.jpg"
              alt="Competencia de Natación"
              className="mb-4 h-60 w-full rounded object-cover"
            />
            <h3 className="mb-2 text-xl font-semibold">
              Sesión de entrenamiento gratis para UNMSM
            </h3>
            <p className="mb-2 text-muted-foreground">Fecha: 10 de Febrero, 2025</p>
            <p className="mb-4 text-muted-foreground">Lugar: Puerta 1</p>
            <button className="w-full rounded-lg bg-primary py-3 text-lg font-semibold text-primary-foreground  transition-colors hover:bg-primary/90">
              Más información
            </button>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="w-full max-w-7xl py-8">
        <h2 className="mb-4 text-center text-3xl font-bold">Torneos Ganados</h2>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      {/* FloatingDock */}
      <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
        <FloatingDock
          items={navigationLinks}
          desktopClassName="w-full"
          mobileClassName="mx-auto flex justify-center"
        />
      </div>
    </div>
  );
}
