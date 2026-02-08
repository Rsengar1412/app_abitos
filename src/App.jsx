import React from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useUserHabits } from '@/hooks/useUserHabits';

import Autenticacion from '@/sections/Autenticacion';
import Onboarding from '@/sections/Onboarding';
import Contadores from '@/sections/Contadores';
import FraseDiaria from '@/sections/FraseDiaria';
import DiarioGratitud from '@/sections/DiarioGratitud';
import Notificaciones from '@/sections/Notificaciones';
import ProgresoRecuperacion from '@/sections/ProgresoRecuperacion';
import Logros from '@/sections/Logros';
import BotonSOS from '@/sections/BotonSOS';
import Recursos from '@/sections/Recursos';

import ThemeToggle from '@/components/ThemeToggle';

const themeToggleClass = 'fixed top-4 right-4 z-[1000] sm:top-3 sm:right-3 [top:max(1rem,env(safe-area-inset-top))] [right:max(1rem,env(safe-area-inset-right))]';

function LoadingScreen() {
  return (
    <>
      <ThemeToggle className={themeToggleClass} />
      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-bg-main text-text-primary p-5 sm:p-4 [padding-left:max(1.25rem,env(safe-area-inset-left))] [padding-right:max(1.25rem,env(safe-area-inset-right))]">
        <div className="text-center max-w-[90vw]">
          <h2 className="mb-2.5 text-lg font-semibold sm:text-base">Preparando tu camino...</h2>
          <p className="opacity-70 italic text-sm sm:text-xs">Libre - Un día a la vez</p>
        </div>
      </div>
    </>
  );
}

function AppPrincipal({ habits, maxDays }) {
  return (
    <div
      className="
        min-h-screen w-full max-w-6xl mx-auto flex flex-col overflow-x-hidden
        px-3 py-4
        sm:px-4 sm:py-5
        md:px-6 md:py-6
        lg:px-8 lg:py-8
        xl:px-10 xl:py-10
        [padding-left:max(0.75rem,env(safe-area-inset-left))]
        [padding-right:max(0.75rem,env(safe-area-inset-right))]
      "
    >
      <header className="flex justify-center items-center shrink-0 py-3 sm:py-4 md:py-5 lg:py-6">
        <h1 className="text-base font-semibold uppercase tracking-widest text-text-secondary sm:text-lg sm:tracking-[0.2em] md:text-xl lg:text-2xl">
          Libre
        </h1>
      </header>

      <ThemeToggle className={themeToggleClass} />

      <main className="w-full flex-1 min-w-0 flex flex-col gap-4 sm:gap-5 md:gap-6 lg:grid lg:grid-cols-3 lg:gap-5 xl:gap-6 lg:items-start lg:content-start">
        <section className="w-full min-w-0 lg:col-span-3">
          <Contadores habits={habits} />
        </section>
        <section className="w-full min-w-0 lg:col-span-2">
          <FraseDiaria />
        </section>
        <section className="w-full min-w-0 lg:col-span-1">
          <DiarioGratitud />
        </section>
        <section className="w-full min-w-0 lg:col-span-1">
          <Notificaciones habits={habits} />
        </section>
        <section className="w-full min-w-0 lg:col-span-2">
          <ProgresoRecuperacion maxDays={maxDays} />
        </section>
        <section className="w-full min-w-0 lg:col-span-2">
          <Logros habits={habits} currentMaxDays={maxDays} />
        </section>
        <section className="w-full min-w-0 lg:col-span-1">
          <BotonSOS habits={habits} />
        </section>
        <section className="w-full min-w-0 lg:col-span-3">
          <Recursos habits={habits} />
        </section>
      </main>

      <footer className="shrink-0 mt-6 pt-4 sm:mt-8 sm:pt-5 md:mt-10 md:pt-6 lg:mt-12 lg:pt-8 text-center text-text-secondary opacity-60 text-xs sm:text-sm pb-[env(safe-area-inset-bottom)]">
        <p>Cada momento cuenta. Mantente fuerte.</p>
      </footer>
    </div>
  );
}

/**
 * AppContent: Decide qué pantalla mostrar según sesión y datos del usuario (habits).
 */
function AppContent() {
  const { currentUser } = useAuth();
  const { habits, maxDays, loading } = useUserHabits(currentUser);

  if (!currentUser) {
    return (
      <div className="min-h-screen w-screen flex justify-center items-center">
        <ThemeToggle className={themeToggleClass} />
        <Autenticacion />
      </div>
    );
  }

  if (loading) return <LoadingScreen />;

  if (habits.length === 0) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <ThemeToggle className={themeToggleClass} />
        <Onboarding uid={currentUser.uid} />
      </div>
    );
  }

  return <AppPrincipal habits={habits} maxDays={maxDays} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
