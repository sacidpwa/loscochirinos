import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MarketAnalysis } from "@/components/market-analysis"
import { BusinessModel } from "@/components/business-model"
import { FinancialAnalysis } from "@/components/financial-analysis"
import { ContributionMargin } from "@/components/contribution-margin"
import { Operations } from "@/components/operations"
import { Recommendations } from "@/components/recommendations"
import { Objectives } from "@/components/objectives"
import { PricingProposal } from "@/components/pricing-proposal"
import { MenuProposal } from "@/components/menu-proposal"
import { BreakfastMenu } from "@/components/breakfast-menu"
import { FacadeProposal } from "@/components/facade-proposal"
import { KanbanManager } from "@/components/kanban-manager"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MarketAnalysis />
      <BusinessModel />
      <FinancialAnalysis />
      <ContributionMargin />
      <Operations />
      <Recommendations />
      <Objectives />
      <PricingProposal />
      <MenuProposal />
      <BreakfastMenu />
      <FacadeProposal />
      <KanbanManager />
      <Footer />
    </main>
  )
}
