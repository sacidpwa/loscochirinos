import OratoriaEvaluator from "@/components/oratoria-evaluator"

export const metadata = {
  title: "Evaluador de Oratoria | Los Cochirinos",
  description: "Sistema de evaluacion de oratoria para certamen de belleza",
}

export default function OratoriaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <OratoriaEvaluator />
      </div>
    </main>
  )
}
