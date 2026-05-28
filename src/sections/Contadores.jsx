import React, { useState } from 'react';
import {
  RefreshCw,
  Trophy,
  LogOut,
  Eye,
  Hand,
  AlertTriangle,
  ArrowLeft,
  Clock,
  Plus,
  Trash2,
  Flame,
  Smartphone,
  Coffee,
  Ghost,
  Wine,
  CupSoda,
  Gamepad2,
  Dices,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ICON_MAP = {
  Eye: <Eye size={20} />,
  Hand: <Hand size={20} />,
  Flame: <Flame size={20} />,
  Smartphone: <Smartphone size={20} />,
  Coffee: <Coffee size={20} />,
  Ghost: <Ghost size={20} />,
  Wine: <Wine size={20} />,
  CupSoda: <CupSoda size={20} />,
  Gamepad2: <Gamepad2 size={20} />,
  Dices: <Dices size={20} />,
};

const PRESET_HABITS = [
  { id: 'porn', name: 'Pornografía', icon: 'Eye', color: '#e74c3c' },
  { id: 'masturbation', name: 'Masturbación', icon: 'Hand', color: '#3498db' },
  { id: 'smoking', name: 'Fumar', icon: 'Flame', color: '#e67e22' },
  { id: 'socialmedia', name: 'Redes Sociales', icon: 'Smartphone', color: '#9b59b6' },
  { id: 'sugar', name: 'Azúcar/Dulces', icon: 'Coffee', color: '#f1c40f' },
  { id: 'alcohol', name: 'Alcohol', icon: 'Wine', color: '#8e44ad' },
  { id: 'caffeine', name: 'Cafeína', icon: 'CupSoda', color: '#d35400' },
  { id: 'gaming', name: 'Videojuegos', icon: 'Gamepad2', color: '#2c3e50' },
  { id: 'gambling', name: 'Apuestas', icon: 'Dices', color: '#27ae60' },
];

const CONSECUENCIAS = {
  porn: {
    titulo: '⚠ ALERTA DE RECAÍDA ⚠',
    subtitulo: '¿Vas a tirar tu progreso?',
    texto: 'Si reinicias ahora, confirmas que has vuelto a consumir. Esto pasará en tu cerebro:',
    lista: [
      "🧠 Tus receptores de dopamina se 'quemarán' de nuevo.",
      '🌫️ Volverá la niebla mental por 3-5 días.',
      '📉 Tu confianza social bajará inmediatamente.',
      '🔁 Reforzarás el circuito neuronal de la adicción.',
    ],
    consejo:
      'Si ha sido solo un desliz, no te castigues. Pero si estás a punto de hacerlo... PARA. Aún estás a tiempo.',
  },
  masturbation: {
    titulo: '⚠ CUIDADO CON TU ENERGÍA ⚠',
    subtitulo: 'La energía vital es limitada.',
    texto: 'La liberación compulsiva drena tu sistema. Vas a notar:',
    lista: [
      '🔋 Bajón inmediato de testosterona y energía.',
      '🥱 Pereza y falta de ganas de hacer cosas difíciles.',
      '👀 Ojos cansados y piel con menos brillo.',
      '📉 Pérdida de atracción y magnetismo personal.',
    ],
    consejo: "¿Vale la pena perder tu 'drive' por 5 segundos de placer? Piénsalo.",
  },
  alcohol: {
    titulo: '⚠ ALCOHOL Y CONTROL ⚠',
    subtitulo: 'La sobriedad es tu mayor activo.',
    texto: 'Si reinicias ahora, recuerda las consecuencias físicas y mentales:',
    lista: [
      '🧠 El alcohol es un depresor del sistema nervioso.',
      '🥃 Causa inflamación sistémica y deshidratación.',
      '📉 Mañana la ansiedad (hangxiety) será mucho peor.',
      '🔄 Romperás la confianza que has construido contigo mismo.',
    ],
    consejo: '¿De verdad quieres despertar con resaca y arrepentimiento? Sigue adelante.',
  },
  default: {
    titulo: '⚠ ¿ESTÁS SEGURO? ⚠',
    subtitulo: 'Vas a reiniciar tu racha.',
    texto: 'Romper el hábito hoy significa empezar de cero mañana. Recuerda:',
    lista: [
      '🧠 La disciplina se construye con repetición.',
      '📉 Mañana será más difícil empezar de nuevo.',
      '🔁 La consistencia es la clave del cambio real.',
    ],
    consejo: 'Tómate un minuto, respira y recuerda por qué decidiste dejar esto.',
  },
};

const EMPTY_HABITS = [];
const toStoredHabit = (habit) => ({
  id: habit.id,
  name: habit.name,
  icon: habit.icon,
  color: habit.color,
  startDate: habit.startDate,
});

const Contadores = ({ habits = EMPTY_HABITS }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [warningHabit, setWarningHabit] = useState(null);
  const { currentUser, logout } = useAuth();

  const addHabit = async (preset) => {
    if (habits.find((h) => h.id === preset.id)) {
      alert('Ya estás siguiendo este hábito.');
      return;
    }
    const now = new Date().toISOString();
    const newHabit = { ...preset, startDate: now };
    const updatedHabits = [...habits.map(toStoredHabit), newHabit];
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { habits: updatedHabits });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error al añadir hábito:', error);
    }
  };

  const removeHabit = async (id) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres eliminar este hábito por completo? Borrarás todo el historial.'
      )
    )
      return;
    const updatedHabits = habits.reduce((acc, habit) => {
      if (habit.id === id) return acc;
      const { display: _DISPLAY, days: _DAYS, ...rest } = habit;
      acc.push(rest);
      return acc;
    }, []);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { habits: updatedHabits });
    } catch (error) {
      console.error('Error al eliminar hábito:', error);
    }
  };

  const confirmReset = async () => {
    if (!warningHabit) return;
    const now = new Date().toISOString();
    const updatedHabits = habits.map((habit) => {
      const base = toStoredHabit(habit);
      if (base.id === warningHabit.id) return { ...base, startDate: now };
      return base;
    });
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { habits: updatedHabits });
    } catch {
      alert('Error al guardar.');
    } finally {
      setWarningHabit(null);
    }
  };

  const requestReset = (habit) => setWarningHabit(habit);
  const cancelReset = () => setWarningHabit(null);
  const handleLogout = async () => {
    await logout();
  };

  const alertInfo = warningHabit ? CONSECUENCIAS[warningHabit.id] || CONSECUENCIAS.default : null;

  const habitsWithDisplay = habits.map((h) => {
    const now = new Date();
    const startDt = new Date(h.startDate);
    const diffMs = now - startDt;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    return {
      ...h,
      display: days < 1 ? { value: hours, unit: 'horas' } : { value: days, unit: 'días' },
    };
  });

  const modalOverlay =
    'fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in';
  const modalRecaida =
    'relative w-full max-w-[400px] rounded-lg py-8 px-8 border border-white/10 shadow-2xl text-white text-center overflow-hidden bg-gradient-to-b from-[#2c3e50] to-black';

  return (
    <div className="w-full">
      <div className="flex justify-center items-center gap-4 mb-8 w-full">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-sm bg-bg-secondary text-text-secondary text-[0.85rem] border-0 cursor-pointer transition-colors hover:bg-bg-primary hover:text-error"
        >
          <LogOut size={14} /> Salir
        </button>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 py-2 px-4 rounded-md bg-brand text-white text-sm font-semibold border-0 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:translate-y-0"
        >
          <Plus size={14} /> Nuevo Hábito
        </button>
      </div>

      <h2 className="text-2xl font-extrabold mb-8 text-text-primary text-center uppercase tracking-wide sm:text-xl">
        Tus Metas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 w-full">
        {habitsWithDisplay.map((habit) => (
          <div
            key={habit.id}
            className={`w-full min-w-0 bg-bg-secondary rounded-lg p-5 sm:p-6 border-2 border-transparent transition-all duration-300 flex flex-col justify-between items-center text-center hover:-translate-y-1 hover:bg-[#1a1a1a] ${habit.display.unit === 'días' && habit.display.value > 7 ? 'border-brand/30 shadow-lg shadow-brand/10' : ''}`}
          >
            <div className="flex items-center justify-center gap-4 w-full mb-6 relative text-center">
              <div className="flex items-center gap-2.5 text-text-secondary">
                {ICON_MAP[habit.icon] || <Ghost size={20} />}
                <span>{habit.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeHabit(habit.id)}
                className="absolute top-1 right-1 p-1.5 rounded-full flex items-center justify-center bg-transparent border-0 text-text-secondary cursor-pointer opacity-30 transition-all hover:opacity-100 hover:bg-marketing-red/10 hover:text-error"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="text-5xl font-extrabold leading-none" style={{ color: habit.color }}>
              {habit.display.value}
            </div>
            <p className="text-sm text-text-secondary mt-2 font-medium">{habit.display.unit}</p>

            {habit.display.unit === 'horas' && (
              <div className="flex items-center gap-2 mt-2 text-brand text-sm">
                <Clock size={14} /> <span>¡Primeras horas clave!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value < 7 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} />{' '}
                <span>¡Estos son los primeros días más difíciles, no te rindas!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value >= 7 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} /> <span>¡Ya has superado la primera semana, no te rindas!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value >= 30 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} /> <span>¡Ya has superado el primer mes, no te rindas!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value >= 90 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} />{' '}
                <span>¡Ya has superado el primer trimestre, no te rindas!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value >= 180 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} /> <span>¡Ya has superado el primer semestre, no te rindas!</span>
              </div>
            )}
            {habit.display.unit === 'días' && habit.display.value >= 365 && (
              <div className="flex items-center gap-2 mt-2 text-text-secondary text-sm">
                <Trophy size={16} /> <span>¡Ya has superado el primer año, no te rindas!</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => requestReset(habit)}
              className="mt-4 flex items-center gap-2 py-2 px-3 rounded-sm bg-bg-primary text-text-secondary text-sm border border-white/10 cursor-pointer hover:border-brand/50"
            >
              <RefreshCw size={12} /> Reiniciar
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-text-secondary text-center opacity-80">
        Cada racha es una victoria sobre tu pasado.
      </p>

      {showAddModal && (
        <div className={modalOverlay}>
          <div className={modalRecaida}>
            <h3 className="text-xl font-extrabold mb-4 text-white uppercase tracking-wide">
              Elige un nuevo desafío
            </h3>
            <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-1">
              {PRESET_HABITS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-md bg-white/5 border border-white/10 text-white cursor-pointer transition-all hover:bg-white/10 hover:border-brand hover:scale-[1.02] disabled:opacity-20 disabled:cursor-not-allowed disabled:grayscale disabled:hover:scale-100 disabled:hover:border-white/10 disabled:hover:bg-white/5"
                  onClick={() => addHabit(preset)}
                  disabled={habits.some((h) => h.id === preset.id)}
                >
                  {ICON_MAP[preset.icon]}
                  <span className="text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 mb-4 p-4 rounded-md bg-white text-black font-bold text-base border-0 cursor-pointer transition-all hover:bg-marketing-red hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/30"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {warningHabit && (
        <div className={modalOverlay}>
          <div className={modalRecaida}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-marketing-red" />
            <AlertTriangle size={48} className="text-marketing-red mb-4 animate-pulse" />
            <h3 className="text-xl font-extrabold mb-4 text-white uppercase tracking-wide">
              {alertInfo.titulo}
            </h3>
            <p className="text-base leading-relaxed text-white/90 mb-6 font-bold">
              {alertInfo.subtitulo}
            </p>
            <p className="text-base leading-relaxed text-white/90 mb-6">{alertInfo.texto}</p>
            <ul className="text-left rounded-sm p-4 mb-6 bg-marketing-red/10 border border-marketing-red/40 pl-2 list-inside">
              {alertInfo.lista.map((item) => (
                <li key={`${warningHabit.id}-${item}`} className="mb-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <p className="italic text-[0.95rem] text-accent mb-8 font-medium">
              {alertInfo.consejo}
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={cancelReset}
                className="w-full p-4 rounded-md bg-white text-black font-bold text-base border-0 cursor-pointer transition-all hover:bg-marketing-red hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand/30"
              >
                <ArrowLeft size={18} className="inline mr-2 align-middle" />
                ¡ESPERA! NO HE RECAÍDO
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="py-3 px-4 rounded-md bg-transparent border border-marketing-red text-marketing-red text-sm cursor-pointer opacity-70 mt-2 hover:bg-marketing-red hover:text-white hover:opacity-100"
              >
                Sí, he recaído. Asumo las consecuencias.
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contadores;
