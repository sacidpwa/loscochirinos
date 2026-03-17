import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const pricingData = [
  { categoria: "Bebidas", nombre: "Agua Natural", precioActual: 20, precioPropuesto: 25 },
  { categoria: "Bebidas", nombre: "Aguas de Sabor", precioActual: 30, precioPropuesto: 30 },
  { categoria: "Bebidas", nombre: "Refresco", precioActual: 25, precioPropuesto: 30 },
  { categoria: "Extras", nombre: "Bolillo", precioActual: 4, precioPropuesto: 4 },
  { categoria: "Extras", nombre: "Cebolla", precioActual: 15, precioPropuesto: 15 },
  { categoria: "Extras", nombre: "Crema", precioActual: 15, precioPropuesto: 15 },
  { categoria: "Extras", nombre: "Desechable", precioActual: 10, precioPropuesto: 10 },
  { categoria: "Extras", nombre: "Desechable Gde", precioActual: 30, precioPropuesto: 30 },
  { categoria: "Extras", nombre: "Envío", precioActual: 40, precioPropuesto: 40 },
  { categoria: "Extras", nombre: "Frijoles", precioActual: 20, precioPropuesto: 25 },
  { categoria: "Extras", nombre: "Queso", precioActual: 10, precioPropuesto: 10 },
  { categoria: "Extras", nombre: "Queso Rallado", precioActual: 10, precioPropuesto: 5 },
  { categoria: "Extras", nombre: "Salsas", precioActual: 20, precioPropuesto: 20 },
  { categoria: "Extras", nombre: "Taco dorado", precioActual: 20, precioPropuesto: 20 },
  { categoria: "Extras", nombre: "Tortilla Maíz o Harina", precioActual: 5, precioPropuesto: 5 },
  { categoria: "Extras", nombre: "Tortillas medio", precioActual: 20, precioPropuesto: 25 },
  { categoria: "Extras", nombre: "Vaso escarchado", precioActual: 10, precioPropuesto: 10 },
  { categoria: "Especialidades", nombre: "Cochilokos", precioActual: 60, precioPropuesto: 78 },
  { categoria: "Especialidades", nombre: "Cochimix", precioActual: 55, precioPropuesto: 65 },
  { categoria: "Especialidades", nombre: "Cochirina", precioActual: 65, precioPropuesto: 78 },
  { categoria: "Especialidades", nombre: "Cochirino Original", precioActual: 35, precioPropuesto: 45, nota: "60gr" },
  { categoria: "Especialidades", nombre: "El Mestizo", precioActual: 40, precioPropuesto: 45 },
  { categoria: "Especialidades", nombre: "Kasadilla", precioActual: 25, precioPropuesto: 35 },
  { categoria: "Especialidades", nombre: "Kukulcan", precioActual: 40, precioPropuesto: 40 },
  { categoria: "Especialidades", nombre: "Mini Cochirina", precioActual: 35, precioPropuesto: 55 },
  { categoria: "Especialidades", nombre: "Panucho del Mayab", precioActual: 55, precioPropuesto: 65 },
  { categoria: "Especialidades", nombre: "Panucho sin cochinita", precioActual: 40, precioPropuesto: 40 },
  { categoria: "Tortas", nombre: "Cochi-Mestiza", precioActual: 55, precioPropuesto: 65 },
  { categoria: "Tortas", nombre: "Cochipuerka", precioActual: 60, precioPropuesto: 70 },
  { categoria: "Tortas", nombre: "Puerkamix", precioActual: 70, precioPropuesto: 85 },
  { categoria: "Compartir", nombre: "1/4 pesada", precioActual: 138, precioPropuesto: 180 },
  { categoria: "Compartir", nombre: "La Pesada", precioActual: 550, precioPropuesto: 580 },
  { categoria: "Compartir", nombre: "Media Pesada", precioActual: 275, precioPropuesto: 320 },
  { categoria: "Postres", nombre: "Flan", precioActual: 40, precioPropuesto: 60 },
]

function getPriceChangeIcon(actual: number, propuesto: number) {
  if (propuesto > actual) return <TrendingUp className="h-4 w-4 text-green-600" />
  if (propuesto < actual) return <TrendingDown className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

function getPriceChangePercentage(actual: number, propuesto: number) {
  if (actual === 0) return 0
  return Math.round(((propuesto - actual) / actual) * 100)
}

export function PricingProposal() {
  const categorias = Array.from(new Set(pricingData.map((item) => item.categoria)))

  return (
    <section id="precios" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Propuesta de Precios</h2>
          <p className="text-muted-foreground">
            Análisis comparativo de precios actuales vs. propuestos para optimizar márgenes de contribución
          </p>
        </div>

        <div className="space-y-6">
          {categorias.map((categoria) => {
            const items = pricingData.filter((item) => item.categoria === categoria)

            return (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle className="text-xl">{categoria}</CardTitle>
                  <CardDescription>
                    {items.length} producto{items.length > 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-right">Precio Actual</TableHead>
                          <TableHead className="text-right">Precio Propuesto</TableHead>
                          <TableHead className="text-center">Cambio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, index) => {
                          const cambio = getPriceChangePercentage(item.precioActual, item.precioPropuesto)

                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.nombre}
                                {item.nota && <span className="ml-2 text-xs text-muted-foreground">({item.nota})</span>}
                              </TableCell>
                              <TableCell className="text-right">${item.precioActual}</TableCell>
                              <TableCell className="text-right font-semibold">${item.precioPropuesto}</TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {getPriceChangeIcon(item.precioActual, item.precioPropuesto)}
                                  {cambio !== 0 && (
                                    <Badge
                                      variant={cambio > 0 ? "default" : "secondary"}
                                      className={cambio > 0 ? "bg-green-600" : "bg-red-600"}
                                    >
                                      {cambio > 0 ? "+" : ""}
                                      {cambio}%
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
