const menuData = {
  especialidades: [
    {
      nombre: "COCHIMIX",
      precio: 65,
      descripcion: "Dúo irresistible de carne asada + cochinita, servido en tortilla de maíz",
    },
    {
      nombre: "COCHIRINA",
      precio: 78,
      descripcion: "Cochinita con queso fundido, envuelta en tortilla de harina doradita",
    },
    {
      nombre: "COCHILOKOS",
      precio: 78,
      descripcion:
        "Tacos dorados rellenos de cochinita, crujientes por fuera y jugosos por dentro, con crema, queso y lechuga fresca",
    },
    {
      nombre: "COCHIRINO ORIGINAL",
      precio: 45,
      descripcion: "El taco esencial de cochinita pibil con cebolla morada. Tradicional y auténtico (60gr)",
    },
  ],
  tacosALaPlancha: [
    {
      nombre: "KUKULCÁN (Pollo)",
      precio: 40,
      descripcion: "Muslo de pollo asado, jugoso y ligeramente sazonado",
    },
    {
      nombre: "EL MESTIZO (Asaro)",
      precio: 45,
      descripcion: "Carne asada estilo norteño, con opción de extra queso fundido",
    },
    {
      nombre: "KASADILLA",
      precio: 35,
      descripcion: "Tortilla doradita con queso fundido (harina o maíz), perfecta para acompañar",
    },
  ],
  tortas: [
    {
      nombre: "PUERKAMIX",
      precio: 85,
      descripcion: "Carne asada + cochinita pibil, en pan dorado con mayonesa y frijoles refritos",
    },
    {
      nombre: "COCHI-MESTIZA",
      precio: 65,
      descripcion: "Carne asada jugosa y brillante en pan con mayonesa",
    },
    { nombre: "COCHIPUERKA", precio: 70, descripcion: "Cochinita pibil, frijoles, mayonesa y cebolla morada" },
  ],
  paraCompartir: [
    {
      nombre: "LA PESADA",
      precio: 580,
      descripcion:
        "Cochinita pibil cocinada lentamente al estilo tradicional. Incluye tortillas, cebolla y salsa habanera (1 kg)",
    },
    { nombre: "MEDIA PESADA", precio: 320, descripcion: "Perfecta para compartir en familia" },
    { nombre: "1/4 PESADA", precio: 180, descripcion: "Ideal para 2-3 personas" },
  ],
  bebidas: [
    { nombre: "Cebollita", precio: 15 },
    { nombre: "San Jojas", precio: 15 },
    { nombre: "Frijoles", precio: 20 },
    { nombre: "Natural", precio: 20 },
    { nombre: "Hoda", precio: 15 },
    { nombre: "Gréma", precio: 10 },
    { nombre: "Queso", precio: 10 },
    { nombre: "Desacha", precio: 10 },
  ],
}

export function MenuProposal() {
  return (
    <section id="menu" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-black text-white rounded-2xl p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tight">MENÚ LOS COCHIRINOS</h1>
            <div className="h-1 w-full bg-red-600 mb-8"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="space-y-12">
              {/* Especialidades */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">ESPECIALIDADES</h2>
                <div className="space-y-6">
                  {menuData.especialidades.map((item) => (
                    <div key={item.nombre}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{item.nombre}</h3>
                        <span className="text-2xl md:text-3xl font-bold ml-4">${item.precio}</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tortas */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">TORTAS</h2>
                <div className="space-y-6">
                  {menuData.tortas.map((item) => (
                    <div key={item.nombre}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{item.nombre}</h3>
                        <span className="text-2xl md:text-3xl font-bold ml-4">${item.precio}</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Tacos a la Plancha */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">TACOS A LA PLANCHA</h2>
                <div className="space-y-6">
                  {menuData.tacosALaPlancha.map((item) => (
                    <div key={item.nombre}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{item.nombre}</h3>
                        <span className="text-2xl md:text-3xl font-bold ml-4">${item.precio}</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Para Compartir */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">PARA COMPARTIR</h2>
                <div className="space-y-6">
                  {menuData.paraCompartir.map((item) => (
                    <div key={item.nombre}>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight">{item.nombre}</h3>
                        <span className="text-2xl md:text-3xl font-bold ml-4">${item.precio}</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300 leading-relaxed">{item.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bebidas */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">BEBIDAS</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {menuData.bebidas.map((item) => (
                    <div key={item.nombre} className="flex justify-between items-center">
                      <span className="text-base md:text-lg">{item.nombre}</span>
                      <span className="text-lg md:text-xl font-bold">${item.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alert at bottom */}
          <div className="mt-12 bg-red-900/20 border-2 border-red-600 rounded-lg p-6 flex items-start gap-4">
            <div className="text-red-600 text-3xl font-bold flex-shrink-0">⚠</div>
            <div>
              <p className="text-red-500 text-lg md:text-xl font-bold">
                ¡Alergias! Si tienes alguna alergia, avísanos antes de ordenar!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
