
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  Heart,
  Clock,
} from "lucide-react";

import { Navbar } from "@/shared";
import restaurant from "@/assets/images/restaurant.jpg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">

      <Navbar />

      {/* Portada principal */}
      <main className="flex-1">

        <section
          className="relative min-h-[650px] lg:min-h-[760px] flex items-center overflow-hidden"
          style={{
            backgroundImage: `url(${restaurant})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

          {/* Capa oscura */}
          <div className="absolute inset-0 bg-black/65" />

          {/* Degradado lateral */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Contenido principal */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm mb-8">
                <Sparkles size={16} className="text-amber-300" />

                <span className="text-sm font-semibold tracking-widest text-white uppercase">
                  Bienvenido a Coffee Flavor
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Un buen momento
                <span className="block text-amber-300">
                  comienza con un gran sabor.
                </span>
              </h1>

              <p className="max-w-xl mt-7 text-base sm:text-lg text-white/85 leading-relaxed">
                Descubre una experiencia gastronómica pensada para
                disfrutar, compartir y crear momentos especiales.
                En Coffee Flavor cada detalle cuenta.
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <button
                  type="button"
                  onClick={() => navigate("/dashboard/readMenu")}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-brand-strong text-white font-bold shadow-xl hover:brightness-110 hover:-translate-y-1 transition-all duration-300"
                >
                  Explorar nuestro menú
                  <ArrowRight size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("about")?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-white/60 text-white font-semibold backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300"
                >
                  Conócenos
                </button>

              </div>

              {/* Indicador */}
              <div className="flex items-center gap-3 mt-14">
                <div className="w-12 h-[2px] bg-amber-300" />

                <span className="text-xs sm:text-sm text-white/75 tracking-[0.2em] uppercase">
                  Calidad · Sabor · Experiencia
                </span>
              </div>

            </div>

          </div>

          {/* Elemento decorativo */}
          <div className="absolute bottom-0 right-0 hidden lg:flex items-center justify-center w-72 h-72 rounded-tl-full bg-white/5 backdrop-blur-sm">
            <Coffee size={115} className="text-white/20" />
          </div>

        </section>

        {/* Sección de presentación */}
        <section
          id="about"
          className="bg-panel px-6 sm:px-10 py-20 lg:py-24"
        >

          <div className="max-w-7xl mx-auto">

            <div className="text-center max-w-3xl mx-auto">

              <span className="text-sm font-bold tracking-[0.2em] text-brand-strong uppercase">
                Nuestra esencia
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mt-4">
                Más que un restaurante, una experiencia para disfrutar.
              </h2>

              <p className="text-text-secondary mt-5 leading-relaxed">
                En Coffee Flavor creemos que los mejores momentos
                se disfrutan alrededor de una buena mesa. Por eso
                queremos ofrecerte una experiencia donde el sabor,
                la atención y la calidad se encuentran.
              </p>

            </div>

            {/* Características */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-16">

              <article className="group p-8 rounded-2xl bg-panel-muted border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-brand-strong/10 text-brand-strong">
                  <UtensilsCrossed size={28} />
                </div>

                <h3 className="text-xl font-bold text-text-primary mt-6">
                  Variedad de sabores
                </h3>

                <p className="text-text-secondary mt-3 leading-relaxed">
                  Explora nuestros productos y encuentra opciones
                  para cada momento y gusto.
                </p>

              </article>

              <article className="group p-8 rounded-2xl bg-panel-muted border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-brand-strong/10 text-brand-strong">
                  <Heart size={28} />
                </div>

                <h3 className="text-xl font-bold text-text-primary mt-6">
                  Calidad y dedicación
                </h3>

                <p className="text-text-secondary mt-3 leading-relaxed">
                  Cada producto representa nuestro compromiso
                  con una experiencia agradable.
                </p>

              </article>

              <article className="group p-8 rounded-2xl bg-panel-muted border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-brand-strong/10 text-brand-strong">
                  <Clock size={28} />
                </div>

                <h3 className="text-xl font-bold text-text-primary mt-6">
                  Momentos especiales
                </h3>

                <p className="text-text-secondary mt-3 leading-relaxed">
                  Un espacio para compartir, disfrutar y convertir
                  cada visita en un buen recuerdo.
                </p>

              </article>

            </div>

          </div>

        </section>

        {/* Invitación final */}
        <section className="bg-brand-strong px-6 sm:px-10 py-16">

          <div className="max-w-5xl mx-auto text-center">

            <Coffee size={38} className="mx-auto text-white mb-5" />

            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              ¿Listo para descubrir nuestros sabores?
            </h2>

            <p className="text-white/85 mt-4 max-w-2xl mx-auto leading-relaxed">
              Explora nuestro menú y conoce todo lo que Coffee Flavor
              tiene preparado para ti.
            </p>

            <button
              type="button"
              onClick={() => navigate("/dashboard/readMenu")}
              className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-xl bg-white text-brand-strong font-bold shadow-lg hover:bg-panel-muted hover:-translate-y-1 transition-all duration-300"
            >
              Ver menú
              <ArrowRight size={19} />
            </button>

          </div>

        </section>

      </main>

      {/* Pie de página */}
      <footer className="bg-panel border-t border-border px-6 py-7">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Coffee size={21} className="text-brand-strong" />

            <span className="font-bold tracking-wider text-text-primary">
              COFFEE FLAVOR
            </span>
          </div>

          <p className="text-sm text-text-muted text-center">
            © {new Date().getFullYear()} Coffee Flavor. Todos los derechos reservados.
          </p>

        </div>

      </footer>

    </div>
  );
}
