import Image from "next/image"
import { Card } from "@/components/ui/card"

export function FacadeProposal() {
  const facades = [
    {
      title: "Estilo Industrial Moderno",
      image: "/images/lamina-20cafe.jpeg",
      description:
        "Diseño contemporáneo que combina madera oscura con iluminación LED geométrica en tonos ámbar. Crea una atmósfera cálida y acogedora perfecta para un restaurante de comida rápida premium.",
      pros: [
        "Iluminación LED crea un ambiente nocturno atractivo y distintivo",
        "Madera oscura transmite calidad y autenticidad",
        "Diseño geométrico moderno atrae a público joven y urbano",
        "Jardineras con vegetación aportan frescura y vida al espacio",
        "Fácil visibilidad del interior a través de puertas de vidrio",
      ],
    },
    {
      title: "Estilo Arquitectónico Contemporáneo",
      image: "/images/moderno-20naranja.jpeg",
      description:
        "Fachada audaz con torre vertical y líneas LED angulares. Usa tonos cobre y negro con elementos geométricos modernos. Incluye señalización tipo caja luminosa en la parte superior para máxima visibilidad.",
      pros: [
        "Torre vertical con logo crea presencia imponente en la calle",
        "Diseño ultra moderno diferencia de competencia tradicional",
        "Iluminación LED crea efecto dramático y memorable",
        "Tonos cobre/naranja evocan calidez de cochinita pibil",
        "Plantas desérticas complementan la estética moderna mexicana",
        "Altamente visible desde distancia gracias a la altura",
      ],
    },
    {
      title: "Estilo Tradicional Mexicano",
      image: "/images/clasico-20cafe.png",
      description:
        "Diseño que honra las raíces yucatecas con tonos tierra y texturas rústicas. Presenta los tres cochirinos como elementos escultóricos dimensionales en la parte superior, creando una identidad de marca inolvidable.",
      pros: [
        "Evoca autenticidad y tradición yucateca",
        "Los cochirinos tridimensionales crean punto focal único",
        "Paleta de colores tierra es cálida y acogedora",
        "Texturas rugosas transmiten artesanía y calidad",
        "Diseño atemporal que no pasará de moda",
        "Puertas con vidrio permiten ver el interior activo",
        "Iluminación dorada sutil y elegante",
      ],
    },
  ]

  return (
    <section id="fachada" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Propuesta de Fachada</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tres propuestas de diseño arquitectónico para la fachada de Los Cochirinos, cada una con su propio carácter
            y ventajas estratégicas.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-12">
          {facades.map((facade, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-[500px] md:h-[600px]">
                  <Image
                    src={facade.image || "/placeholder.svg"}
                    alt={facade.title}
                    fill
                    className="object-contain bg-gray-100"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-3">{facade.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{facade.description}</p>
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Ventajas:</h4>
                    <ul className="space-y-2">
                      {facade.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-sm leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
