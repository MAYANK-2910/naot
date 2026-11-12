import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { StepNav } from '@/components/layout/StepNav';
import { DeveloperPage } from '@/features/developer/DeveloperPage';
import { ScreenerWorkspace } from '@/features/ScreenerWorkspace';
import { useScreener } from '@/hooks/useScreener';
import { useTheme } from '@/hooks/useTheme';
import type { View } from '@/types';

export default function App() {
  const { theme, toggle } = useTheme();
  const screener = useScreener();
  const [view, setView] = useState<View>('screener');

  return (
    <div className="min-h-dvh">
      <Header view={view} onViewChange={setView} theme={theme} onToggleTheme={toggle} />

      {view === 'screener' && (
        <StepNav current={screener.step} hasResult={screener.analysis !== null} onSelect={screener.setStep} />
      )}

      <PageContainer>
        {view === 'developer' ? (
          <DeveloperPage />
        ) : (
          <ScreenerWorkspace screener={screener} />
        )}
      </PageContainer>
    </div>
  );
}
