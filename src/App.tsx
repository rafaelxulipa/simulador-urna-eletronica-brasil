import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/common/AppShell'
import { RequireConsent } from '@/components/common/RequireConsent'
import { useApplyAccessibilityPreferences } from '@/hooks/useApplyAccessibilityPreferences'
import { LandingPage } from '@/pages/LandingPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { StateSelectPage } from '@/pages/StateSelectPage'
import { ModeSelectPage } from '@/pages/ModeSelectPage'
import { VotingPage } from '@/pages/VotingPage'
import { FinishedPage } from '@/pages/FinishedPage'
import { SourcesPage } from '@/pages/SourcesPage'
import { TermsPage } from '@/pages/TermsPage'
import { PrivacyPage } from '@/pages/PrivacyPage'

function App() {
  useApplyAccessibilityPreferences()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LandingPage />} />
          <Route path="como-funciona" element={<HowItWorksPage />} />
          <Route path="fontes" element={<SourcesPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />
          <Route element={<RequireConsent />}>
            <Route path="estado" element={<StateSelectPage />} />
            <Route path="modo" element={<ModeSelectPage />} />
            <Route path="votar" element={<VotingPage />} />
            <Route path="concluido" element={<FinishedPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
