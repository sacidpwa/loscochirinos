"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#mercado", label: "Mercado" },
  { href: "#financiero", label: "Financiero" },
  { href: "#operaciones", label: "Operaciones" },
  { href: "#objetivos", label: "Objetivos" },
  { href: "#precios", label: "Precios" },
  { href: "#menu", label: "Menu" },
  { href: "#desayunos", label: "Desayunos" },
  { href: "#fachada", label: "Fachada" },
  { href: "/kanban", label: "Kanban", external: true },
  { href: "/todo", label: "To-Do", external: true },
  { href: "/nuevo-menu", label: "Nuevo Menu", external: true },
  { href: "/recetas", label: "Recetas", external: true },
  { href: "/diagrama-apertura", label: "Diagrama Apertura", external: true },
  { href: "/script-bienvenida", label: "Script Bienvenida", external: true },
  { href: "/estado-cuenta", label: "Estado de Cuenta", external: true },
  { href: "/capacitacion", label: "Matriz Capacitacion", external: true },
  { href: "/proveedores", label: "Proveedores", external: true },
  { href: "/oratoria", label: "Evaluador Oratoria", external: true },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Los Cochirinos" width={180} height={48} className="h-12 w-auto" />
          </Link>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors border border-border"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-border bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-center"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
