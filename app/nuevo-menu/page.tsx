import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Nuevo Menu de Desayunos - Los Cochirinos",
  description: "Conoce el nuevo menu de desayunos de Los Cochirinos, Especialistas en Cochinita Pibil",
}

export default function NuevoMenuPage() {
  return (
    <main className="min-h-screen bg-[#f5f0e8]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {"<-"} Volver al inicio
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#2a2a2a] mb-2 font-serif">
          Nuevo Menu de Desayunos
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Febrero 2026
        </p>

        {/* Menu Image */}
        <div className="rounded-xl overflow-hidden shadow-2xl mb-12">
          <Image
            src="/images/nuevo-menu-desayuno-feb2026.jpg"
            alt="Nuevo Menu de Desayunos Los Cochirinos - Febrero 2026"
            width={1080}
            height={1920}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Ventajas del nuevo menu */}
        <section className="bg-background rounded-xl p-6 sm:p-10 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2a2a2a] mb-6 text-center">
            Ventajas del Nuevo Menu de Desayunos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Diseno mas limpio y legible</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El nuevo formato de dos columnas con fondo claro y tipografia clara facilita la lectura rapida de los platillos y precios, mejorando la experiencia del cliente al momento de ordenar.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Extras claramente visibles</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada platillo muestra sus opciones de extras (queso, huevo extra, carne asada) con iconos y precios visibles, lo que facilita el upselling y aumenta el ticket promedio por cliente.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Variedad equilibrada de platillos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El menu ofrece 9 opciones que cubren diferentes rangos de precio ($45 a $148), desde el accesible Cochirino Original hasta los completos Cochilaquiles Rojos, atendiendo a todo tipo de presupuesto.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Identidad de marca reforzada</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El logo prominente de Los Cochirinos con los tres cerditos y los elementos decorativos en teal y dorado refuerzan la identidad visual de la marca, creando una experiencia memorable.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Descripciones detalladas</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada platillo incluye una descripcion completa de sus ingredientes y preparacion, lo que reduce las preguntas al mesero, agiliza el servicio y ayuda al cliente a tomar decisiones informadas.
              </p>
            </div>

            <div className="p-5 rounded-lg bg-[#f5f0e8] border border-[#d4a853]/30">
              <h3 className="font-bold text-lg text-[#2a2a2a] mb-2">Formato optimizado para redes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El formato vertical del menu es ideal para compartir en redes sociales como Instagram Stories y WhatsApp, permitiendo una difusion digital efectiva sin necesidad de adaptar el diseno.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center mt-8 pb-8">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {"<-"} Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
