"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, MapPin, Leaf, UtensilsCrossed, Coffee, Star, Heart } from "lucide-react"

const scriptSections = [
  {
    id: "saludo",
    title: "Saludo Inicial",
    icon: MessageCircle,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    lines: [
      {
        speaker: "Empleado",
        text: "Bienvenido a Los Cochirinos, especialistas en cochinita pibil. Mi nombre es [NOMBRE], sera un gusto atenderle.",
      },
    ],
    tip: "Siempre con una sonrisa, contacto visual y tono calido.",
  },
  {
    id: "origen",
    title: "Origen Yucateco",
    icon: MapPin,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    lines: [
      {
        speaker: "Empleado",
        text: "Nuestra cochinita pibil se prepara siguiendo la receta tradicional yucateca, con tecnicas ancestrales de la peninsula de Yucatan que le dan ese sabor unico e inigualable.",
      },
    ],
    tip: "Transmitir orgullo y conocimiento por la tradicion yucateca.",
  },
  {
    id: "ingredientes",
    title: "Ingredientes Premium",
    icon: Leaf,
    color: "bg-teal-500",
    textColor: "text-teal-700",
    bgLight: "bg-teal-50",
    borderColor: "border-teal-200",
    lines: [
      {
        speaker: "Empleado",
        text: "Trabajamos con ingredientes de la mas alta calidad: achiote de Yucatan, naranja agria natural, hojas de platano seleccionadas y carne de cerdo premium. Todo preparado artesanalmente desde temprano para ofrecerle lo mejor.",
      },
    ],
    tip: "Enfatizar la frescura y calidad, mencionar que es preparacion artesanal del dia.",
  },
  {
    id: "desayunos",
    title: "Oferta de Desayunos",
    icon: Coffee,
    color: "bg-amber-600",
    textColor: "text-amber-800",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    lines: [
      {
        speaker: "Empleado (si es horario de desayuno)",
        text: "Contamos con deliciosos desayunos: desde nuestra Cochipuerka Mananera, huevos cochirinos, molletes, chilaquiles y cochilaquiles rojos, todos con el toque especial de nuestra cochinita pibil. Tambien ofrecemos un paquete de cafe y pan por solo $35 pesos adicionales.",
      },
    ],
    tip: "Sugerir el platillo mas popular o la recomendacion del dia.",
  },
  {
    id: "comidas",
    title: "Oferta de Comidas",
    icon: UtensilsCrossed,
    color: "bg-orange-600",
    textColor: "text-orange-800",
    bgLight: "bg-orange-50",
    borderColor: "border-orange-200",
    lines: [
      {
        speaker: "Empleado (si es horario de comida)",
        text: "Para comer le ofrecemos nuestro clasico taco de cochinita pibil, tortas cochipuerka, y nuestro menu completo con todo el sabor de Yucatan. Cada platillo esta preparado con el mismo cuidado y los ingredientes frescos del dia.",
      },
    ],
    tip: "Adaptar la sugerencia segun lo que observe del cliente (solo, familia, etc).",
  },
  {
    id: "recomendacion",
    title: "Recomendacion Personal",
    icon: Star,
    color: "bg-teal-600",
    textColor: "text-teal-800",
    bgLight: "bg-teal-50",
    borderColor: "border-teal-200",
    lines: [
      {
        speaker: "Empleado",
        text: "Le recomiendo especialmente [PLATILLO DEL DIA / MAS POPULAR]. Es uno de los favoritos de nuestros clientes. Si gusta, puedo agregarle extras como queso gratinado, huevo o carne asada.",
      },
    ],
    tip: "Personalizar la recomendacion. Ofrecer extras genera venta adicional.",
  },
  {
    id: "despedida",
    title: "Despedida y Cierre",
    icon: Heart,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    lines: [
      {
        speaker: "Empleado (al entregar el pedido)",
        text: "Aqui tiene su pedido. Que lo disfrute mucho. Si necesita algo mas, estoy para servirle.",
      },
      {
        speaker: "Empleado (al despedirse)",
        text: "Muchas gracias por su visita a Los Cochirinos. Esperamos verle pronto de regreso. Que tenga excelente dia.",
      },
    ],
    tip: "Despedirse siempre con amabilidad, invitar a regresar.",
  },
]

export function ScriptBienvenida() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro Card */}
      <Card className="border-2 border-amber-300 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-balance">
            Script de Bienvenida
          </h2>
          <p className="text-amber-100 mt-2 text-sm sm:text-base leading-relaxed">
            Guia para el equipo de Los Cochirinos. Cada interaccion con el cliente es una oportunidad para transmitir la esencia de nuestra cochinita pibil yucateca.
          </p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <MapPin className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-amber-900">Receta Yucateca</p>
                <p className="text-xs text-amber-700">Tradicion ancestral de la peninsula</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
              <Leaf className="w-8 h-8 text-teal-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-teal-900">Ingredientes Premium</p>
                <p className="text-xs text-teal-700">Calidad artesanal todos los dias</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <UtensilsCrossed className="w-8 h-8 text-orange-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-orange-900">Desayunos y Comidas</p>
                <p className="text-xs text-orange-700">Menu completo con sabor unico</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Script Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

        <div className="space-y-6">
          {scriptSections.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="relative pl-16 sm:pl-20">
                {/* Step number circle */}
                <div
                  className={`absolute left-2 sm:left-4 w-8 h-8 rounded-full ${section.color} flex items-center justify-center text-white font-bold text-sm z-10`}
                >
                  {index + 1}
                </div>

                <Card className={`border ${section.borderColor} overflow-hidden`}>
                  <CardHeader className={`${section.bgLight} py-3 px-4 sm:px-6`}>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Icon className={`w-5 h-5 ${section.textColor} shrink-0`} />
                      <span className={section.textColor}>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    {section.lines.map((line, lineIdx) => (
                      <div key={lineIdx} className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {line.speaker}:
                        </p>
                        <p className="text-foreground leading-relaxed text-sm sm:text-base italic border-l-4 border-amber-300 pl-3 py-1 bg-amber-50/50 rounded-r">
                          {'"'}{line.text}{'"'}
                        </p>
                      </div>
                    ))}
                    {section.tip && (
                      <div className="flex items-start gap-2 mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Tip: </span>
                          {section.tip}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Points Summary */}
      <Card className="border-2 border-teal-300">
        <CardHeader className="bg-teal-50 py-4 px-6">
          <CardTitle className="text-teal-800 text-lg">Puntos Clave a Recordar</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-3">
            {[
              "Siempre mencionar que la receta es tradicional yucateca, esto nos diferencia.",
              "Destacar la calidad premium de los ingredientes: achiote de Yucatan, naranja agria natural, hojas de platano.",
              "Ofrecer desayunos en la manana y comidas al mediodia, adaptando la sugerencia al horario.",
              "Recomendar extras (queso, huevo, carne asada) para aumentar el ticket promedio.",
              "Ser amable, hacer contacto visual, y despedirse invitando a regresar.",
              "Cada cliente es una oportunidad de crear un fan de Los Cochirinos.",
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm sm:text-base text-foreground leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
