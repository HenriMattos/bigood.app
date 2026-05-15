import { DashboardView } from "@/components/admin/dashboard-view"
import { WelcomeFlow } from "@/components/admin/welcome-flow"

export default function DashboardPage() {
  return (
    <WelcomeFlow>
      <DashboardView />
    </WelcomeFlow>
  )
}
