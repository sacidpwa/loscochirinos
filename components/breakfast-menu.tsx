import Image from "next/image"

export function BreakfastMenu() {
  return (
    <section id="desayunos" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Menú de Desayunos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Propuesta de menú de desayunos especializado con opciones tradicionales y creaciones únicas de cochinita
            pibil
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              src="/images/desayunos-menu.png"
              alt="Menú de Desayunos Los Cochirinos"
              width={1200}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
