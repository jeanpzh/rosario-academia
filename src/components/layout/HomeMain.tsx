export default function HomeMain() {
  return (
    <div className="flex flex-col items-center gap-16">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] w-full items-center justify-center">
        <img
          src="https://images8.alphacoders.com/575/575648.jpg"
          alt="Hero"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="relative z-10 rounded-lg bg-black bg-opacity-0 p-8 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Academia Rosario</h1>
          <p className="mb-8 text-xl md:text-2xl">Formando campeones desde la cuna</p>
          <a
            href="#contacto"
            className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Únete ahora
          </a>
        </div>
      </section>

      {/* Noticias Destacadas */}
      <section id="noticias" className="max-w-12xl w-full bg-blue-800/5 py-16 text-foreground">
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
                <a href="#" className="text-primary transition-colors hover:text-primary/80"></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section id="eventos" className="max-w-12xl w-full bg-blue-800/5 py-16 text-foreground">
        <h2 className="mb-8 text-center text-3xl font-bold">PROXIMOS EVENTOS</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card p-6 text-card-foreground shadow-md transition-transform hover:scale-105">
            <img
              src="https://imgmedia.elpopular.pe/640x358/elpopular/original/2025/01/26/6796bd01df574c43915b96d0.webp"
              alt="Torneo de Fútbol"
              className="mb-4 h-60 w-full rounded object-cover"
            />
            <h3 className="mb-2 text-xl font-semibold">Makanaky se Calatea y Acaba Frio</h3>
            <p className="mb-2 text-muted-foreground">Fecha: 28 de Enero, 2025</p>
            <p className="mb-4 text-muted-foreground">Lugar: Estadio Principal</p>
            <button className="mt-auto rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/80">
              Más información
            </button>
          </div>
          <div className="flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card p-6 text-card-foreground shadow-md transition-transform hover:scale-105">
            <img
              src="https://peru21-pe.b-cdn.net/sites/default/efsfiles/styles/wide/public/2025-01/rafael-lopez-aliaga-le-da-la-bienvenida-a-ishow-speed-en-lima.png?itok=Sh3ccR61"
              alt="Competencia de Natación"
              className="mb-4 h-60 w-full rounded object-cover"
            />
            <h3 className="mb-2 text-xl font-semibold">Homenaje en Honor a Speed</h3>
            <p className="mb-2 text-muted-foreground">Fecha: 29 de Enero, 2025</p>
            <p className="mb-4 text-muted-foreground">Lugar: Piscina Olímpica</p>
            <button className="mt-auto rounded bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/80">
              Más información
            </button>
          </div>
        </div>
      </section>

      {/* Galería de Imágenes */}
      <section id="galeria" className="w-full max-w-7xl py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Galería</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              id: 1,
              imageUrl: "https://e.rpp-noticias.io/xlarge/2010/09/19/524895.jpg",
              alt: "Equipo celebrando",
            },
            {
              id: 2,
              imageUrl:
                "https://www.infobae.com/resizer/v2/KUHBIS5T4FAHDBYT33WNR4MENY.jpg?auth=aaa75ebfea162330370913bbfa8f5a0c322507498af24d8dcd2bba85c819bb41&smart=true&width=992&height=558&quality=85",
              alt: "Entrenamiento intensivo",
            },
            {
              id: 3,
              imageUrl:
                "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/461352674_10232906216055425_2417695151802184897_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=yi7CtTl9DB8Q7kNvgE9oDdH&_nc_oc=AdjWwm8FmioArOtBHV9JeD-VoEkUggRB1lA5DwpFB-fVndlfMA862bB34fAnNWONN_o&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=As9xD2sUxFO4xYNUKxQgrvl&oh=00_AYB19PWkEU0OPHneSbN44__SqL_zonKfBp9M3JIMOcrcNg&oe=679DEC2C",
              alt: "Competencia de natación",
            },
            {
              id: 4,
              imageUrl:
                "https://www.infobae.com/resizer/v2/LLUKISE7P5FZRFZPNNG4XZC7GM.jpg?auth=cca112f1c6d14b2bf6cfb37305745c7c61f1a41295a7f072f97fad02cb5f4e21&smart=true&width=992&height=661&quality=85",
              alt: "Premiación de atletas",
            },
          ].map((imagen) => (
            <div key={imagen.id} className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={imagen.imageUrl || "/placeholder.svg"}
                alt={imagen.alt}
                className="size-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="w-full max-w-7xl rounded-xl bg-secondary p-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">¿Listo para unirte a nosotros?</h2>
        <p className="mb-8 text-xl">Descubre todo lo que Academia Rosario tiene para ofrecerte</p>
        <form className="mx-auto max-w-md">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Comienza tu journey deportivo
          </button>
        </form>
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="https://wa.me/+51978257871"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors hover:text-primary/80"
          >
            <svg className="size-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M21.35 3.65c-2.33-2.33-5.43-3.62-8.73-3.62-6.82 0-12.36 5.54-12.36 12.36 0 2.17.57 4.29 1.65 6.16L0 24l6.54-1.72c1.8.98 3.84 1.5 5.92 1.5h.01c6.82 0 12.36-5.54 12.36-12.36 0-3.3-1.29-6.4-3.62-8.73zm-8.73 19.01h-.01c-1.84 0-3.65-.5-5.23-1.44l-.37-.22-3.87 1.02.99-3.62-.24-.38c-1.02-1.62-1.56-3.49-1.56-5.41 0-5.67 4.61-10.28 10.29-10.28 2.75 0 5.33 1.07 7.27 3.01 1.94 1.94 3.01 4.52 3.01 7.27 0 5.67-4.61 10.28-10.29 10.28zm5.66-7.71c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.15-.69.15-.21.3-.8.99-.98 1.19-.18.2-.36.22-.67.07-.31-.15-1.31-.48-2.49-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.36.46-.54.15-.18.2-.31.3-.51.1-.2.05-.37-.02-.52-.07-.15-.69-1.66-.94-2.27-.24-.59-.49-.51-.67-.52-.17-.01-.37-.01-.56-.01-.2 0-.51.07-.78.37-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.21 3.06.15.2 2.11 3.22 5.11 4.51.71.31 1.27.5 1.7.64.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.18-1.42-.07-.13-.28-.21-.59-.37z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">WhatsApp</span>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors hover:text-primary/80"
          >
            <svg className="size-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary transition-colors hover:text-primary/80"
          >
            <svg className="size-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">Instagram</span>
          </a>
        </div>
      </section>
    </div>
  );
}
