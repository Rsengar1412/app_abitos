import React, { useState } from 'react';
// Importamos el contexto de autenticación
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Importamos los componentes (ahora en español)
import Autenticacion from './components/Autenticacion';
import Contadores from './components/Contadores';
import BotonSOS from './components/BotonSOS';
import Recursos from './components/Recursos';
import Logros from './components/Logros';
import FraseDiaria from './components/FraseDiaria';
import ProgresoRecuperacion from './components/ProgresoRecuperacion';
import DiarioGratitud from './components/DiarioGratitud';
import Notificaciones from './components/Notificaciones';

// Estilos principales
import './App.css';

// Componente principal de contenido
function AppContent() {
  const { currentUser } = useAuth(); // Usuario actual

  // Estado para los contadores (se actualiza desde el componente Contadores)
  const [counters, setCounters] = useState({ porn: 0, masturbation: 0 });

  // Calculamos el máximo de días para la línea de tiempo y logros
  const maxDays = Math.max(counters.porn, counters.masturbation);

  // Si no está logueado, mostrar pantalla de autenticación
  if (!currentUser) {
    return <Autenticacion />;
  }

  // Si está logueado, mostrar la app principal
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-titulo">Libre</h1>
      </header>

      <main className="app-main">
        {/* Contadores Principales */}
        <Contadores onDaysUpdate={setCounters} />

        {/* Frase Motivacional */}
        <FraseDiaria />

        {/* Diario de Gratitud */}
        <DiarioGratitud />

        {/* Configuración de Notificaciones */}
        <Notificaciones />

        {/* Línea de Tiempo de Recuperación */}
        <ProgresoRecuperacion maxDays={maxDays} />

        {/* Logros y Medallas */}
        <Logros currentDays={maxDays} />

        {/* Botón SOS de Emergencia */}
        <BotonSOS />

        {/* Recursos Educativos */}
        <Recursos />
      </main>

      <footer className="app-footer">
        <p>Un día a la vez.</p>
      </footer>
    </div>
  );
}

// Componente Raíz que provee autenticación
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
