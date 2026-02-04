import React, { useState, useEffect } from 'react';
/**
 * AuthProvider: Proveedor del contexto de autenticación.
 * useAuth: Hook para acceder al usuario actual y funciones de login/logout.
 */
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * IMPORTACIÓN DE COMPONENTES
 * Todos los componentes principales de la interfaz.
 */
import Autenticacion from './components/Autenticacion';
import Contadores from './components/Contadores';
import BotonSOS from './components/BotonSOS';
import Recursos from './components/Recursos';
import Logros from './components/Logros';
import FraseDiaria from './components/FraseDiaria';
import ProgresoRecuperacion from './components/ProgresoRecuperacion';
import DiarioGratitud from './components/DiarioGratitud';
import Notificaciones from './components/Notificaciones';
import Onboarding from './components/Onboarding';

// Estilos globales de la aplicación
import './App.css';

/**
 * AppContent: Componente que maneja la lógica de visualización basada en el estado del usuario.
 */
function AppContent() {
  // currentUser: Información del usuario logueado desde Firebase Auth.
  const { currentUser } = useAuth();

  // habits: Lista de hábitos que el usuario está siguiendo.
  const [habits, setHabits] = useState([]);

  // maxDays: El récord máximo de días limpio entre todos los hábitos.
  const [maxDays, setMaxDays] = useState(0);

  // loading: Estado para controlar mientras se cargan los datos de Firestore.
  const [loading, setLoading] = useState(true);

  /**
   * EFECTO: Escuchar cambios en Firestore en tiempo real.
   * Se activa cuando cambia el usuario (login/logout).
   */
  useEffect(() => {
    // Si no hay usuario, no hay nada que cargar.
    if (!currentUser) {
      console.log("AppContent: No hay usuario logueado, saltando carga de datos.");
      setLoading(false);
      return;
    }

    console.log("AppContent: Usuario logueado, iniciando carga de datos para UID:", currentUser.uid);

    // Timeout de seguridad: Si Firestore tarda más de 3 segundos, quitamos la pantalla de carga.
    // Esto evita que la app se quede en negro si hay problemas de red o permisos.
    const safetyTimeout = setTimeout(() => {
      console.warn("AppContent: Timeout de carga de datos de Firestore alcanzado (3s). Forzando fin de carga.");
      setLoading(false);
    }, 3000);

    // Suscripción al documento del usuario en la colección 'users'.
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      try {
        if (doc.exists()) {
          const data = doc.data();
          console.log("AppContent: Datos de usuario recibidos de Firestore.", data);
          // Aseguramos que habits sea un array para evitar errores de renderizado.
          const userHabits = Array.isArray(data.habits) ? data.habits : [];

          const now = new Date();
          // Procesamos cada hábito para calcular los días transcurridos desde su startDate.
          const processed = userHabits.map(h => {
            const startDate = h.startDate ? new Date(h.startDate) : new Date();
            const diff = now - startDate;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            // Validamos que 'days' sea un número válido.
            return { ...h, days: isNaN(days) ? 0 : days };
          });

          setHabits(processed);
          // Calculamos el máximo de días entre todos los hábitos para el progreso general.
          setMaxDays(processed.length > 0 ? Math.max(...processed.map(h => h.days)) : 0);
        } else {
          // Si el documento no existe (usuario nuevo sin onboarding), limpiamos hábitos.
          setHabits([]);
          setMaxDays(0);
        }
      } catch (err) {
        console.error("Error procesando datos del usuario:", err);
      } finally {
        // Marcamos la carga como completada.
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    }, (error) => {
      console.error("Error en el listener de Firebase (posibles permisos):", error);
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    // Cleanup: Cancelar la suscripción al desmontar el componente.
    return () => {
      unsub();
      clearTimeout(safetyTimeout);
    };
  }, [currentUser]);

  /**
   * FLUJO DE RENDERIZADO
   */

  // 1. Si el usuario NO está logueado, mostramos la pantalla de Login/Registro.
  if (!currentUser) {
    return <Autenticacion />;
  }

  // 2. Si todavía estamos cargando datos de Firestore, mostramos una pantalla de espera.
  if (loading) {
    return (
      <div className="onboarding-overlay" style={{ background: '#000', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Preparando tu camino...</h2>
          <p style={{ opacity: 0.7, fontStyle: 'italic' }}>Libre - Un día a la vez</p>
        </div>
      </div>
    );
  }

  // 3. Si el usuario está logueado pero NO tiene hábitos configurados, mostramos el Onboarding.
  if (habits.length === 0) {
    return <Onboarding uid={currentUser.uid} />;
  }

  // 4. Pantalla Principal: Se muestra cuando el usuario está logueado y tiene al menos un hábito.
  console.log("Renderizando App Principal con hábitos:", habits.length);
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-titulo">Libre</h1>
      </header>

      <main className="app-main">
        {/* === SECCIONES DE LA APP === */}

        {/* Contadores core: Muestran el tiempo transcurrido en cada hábito. */}
        <Contadores habits={habits} />

        {/* Motivación diaria: Una frase aleatoria para inspirar. */}
        <FraseDiaria />

        {/* Diario Personal: Espacio para anotar por qué estamos agradecidos hoy. */}
        <DiarioGratitud />

        {/* Gestión de Alertas: Configuración de notificaciones personalizadas. */}
        <Notificaciones habits={habits} />

        {/* Gamificación: Hitos y beneficios científicos desbloqueados por tiempo. */}
        <ProgresoRecuperacion maxDays={maxDays} />

        {/* Premios: Medallas visuales para celebrar las rachas. */}
        <Logros habits={habits} currentMaxDays={maxDays} />

        {/* Botón de Emergencia: Recursos rápidos para cuando el usuario siente urgencia. */}
        <BotonSOS habits={habits} />

        {/* Biblioteca de Ayuda: Consejos específicos según los hábitos seleccionados. */}
        <Recursos habits={habits} />
      </main>

      <footer className="app-footer">
        <p>Cada momento cuenta. Mantente fuerte.</p>
      </footer>
    </div>
  );
}

/**
 * App: Componente raíz que envuelve la aplicación en el contexto de Auth.
 */
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
