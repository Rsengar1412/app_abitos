import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, LogOut, Eye, Hand, AlertTriangle, ArrowLeft, Clock, Plus, Trash2, Flame, Smartphone, Coffee, Ghost } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Contadores.css';

/**
 * ICON_MAP: Mapeo de nombres de iconos (strings) a componentes de Lucide.
 * Esto nos permite guardar solo el nombre en la base de datos y renderizar el componente real aquí.
 */
const ICON_MAP = {
    Eye: <Eye size={20} />,
    Hand: <Hand size={20} />,
    Flame: <Flame size={20} />,
    Smartphone: <Smartphone size={20} />,
    Coffee: <Coffee size={20} />,
    Ghost: <Ghost size={20} />
};

/**
 * PRESET_HABITS: Configuración visual rápida para añadir nuevos hábitos desde el modal.
 */
const PRESET_HABITS = [
    { id: 'porn', name: 'Pornografía', icon: 'Eye', color: '#e74c3c' },
    { id: 'masturbation', name: 'Masturbación', icon: 'Hand', color: '#3498db' },
    { id: 'smoking', name: 'Fumar', icon: 'Flame', color: '#95a5a6' },
    { id: 'socialmedia', name: 'Redes Sociales', icon: 'Smartphone', color: '#9b59b6' },
    { id: 'sugar', name: 'Azúcar/Dulces', icon: 'Coffee', color: '#f1c40f' }
];

/**
 * CONSECUENCIAS: Mensajes motivacionales y científicos que aparecen al intentar reiniciar una racha.
 */
const CONSECUENCIAS = {
    porn: {
        titulo: "⚠ ALERTA DE RECAÍDA ⚠",
        subtitulo: "¿Vas a tirar tu progreso?",
        texto: "Si reinicias ahora, confirmas que has vuelto a consumir. Esto pasará en tu cerebro:",
        lista: [
            "🧠 Tus receptores de dopamina se 'quemarán' de nuevo.",
            "🌫️ Volverá la niebla mental por 3-5 días.",
            "📉 Tu confianza social bajará inmediatamente.",
            "🔁 Reforzarás el circuito neuronal de la adicción."
        ],
        consejo: "Si ha sido solo un desliz, no te castigues. Pero si estás a punto de hacerlo... PARA. Aún estás a tiempo."
    },
    masturbation: {
        titulo: "⚠ CUIDADO CON TU ENERGÍA ⚠",
        subtitulo: "La energía vital es limitada.",
        texto: "La liberación compulsiva drena tu sistema. Vas a notar:",
        lista: [
            "🔋 Bajón inmediato de testosterona y energía.",
            "🥱 Pereza y falta de ganas de hacer cosas difíciles.",
            "👀 Ojos cansados y piel con menos brillo.",
            "📉 Pérdida de atracción y magnetismo personal."
        ],
        consejo: "¿Vale la pena perder tu 'drive' por 5 segundos de placer? Piénsalo."
    },
    default: {
        titulo: "⚠ ¿ESTÁS SEGURO? ⚠",
        subtitulo: "Vas a reiniciar tu racha.",
        texto: "Romper el hábito hoy significa empezar de cero mañana. Recuerda:",
        lista: [
            "🧠 La disciplina se construye con repetición.",
            "📉 Mañana será más difícil empezar de nuevo.",
            "🔄 La consistencia es la clave del cambio real."
        ],
        consejo: "Tómate un minuto, respira y recuerda por qué decidiste dejar esto."
    }
};

/**
 * Contadores: Componente principal que muestra las tarjetas de cada hábito activo.
 * habits: Array que viene desde App.jsx a través de un listener de Firestore.
 */
const Contadores = ({ habits = [] }) => {
    // showAddModal: Controla si se ve el diálogo para añadir nuevos desafíos.
    const [showAddModal, setShowAddModal] = useState(false);
    // warningHabit: El hábito que el usuario está a punto de reiniciar (para el modal de alerta).
    const [warningHabit, setWarningHabit] = useState(null);
    // Acceso a funciones de logout y datos del usuario.
    const { currentUser, logout } = useAuth();

    /**
     * addHabit: Añade un nuevo hábito al perfil del usuario.
     */
    const addHabit = async (preset) => {
        if (habits.find(h => h.id === preset.id)) {
            alert("Ya estás siguiendo este hábito.");
            return;
        }
        const now = new Date().toISOString();
        const newHabit = { ...preset, startDate: now };
        // Limpiamos campos temporales para Firebase
        const updatedHabits = [...habits.map(({ display, days, ...rest }) => rest), newHabit];

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, { habits: updatedHabits });
            setShowAddModal(false);
        } catch (error) { console.error("Error al añadir hábito:", error); }
    };

    /**
     * removeHabit: Elimina permanentemente un hábito de la lista.
     */
    const removeHabit = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este hábito por completo? Borrarás todo el historial.")) return;
        const updatedHabits = habits.filter(h => h.id !== id).map(({ display, days, ...rest }) => rest);
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, { habits: updatedHabits });
        } catch (error) { console.error("Error al eliminar hábito:", error); }
    };

    /**
     * confirmReset: Pone el contador a cero (hoy) para el hábito seleccionado.
     */
    const confirmReset = async () => {
        if (!warningHabit) return;
        const now = new Date().toISOString();
        const updatedHabits = habits.map(({ display, days, ...rest }) => {
            if (rest.id === warningHabit.id) {
                return { ...rest, startDate: now };
            }
            return rest;
        });

        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, { habits: updatedHabits });
        } catch (error) { alert('Error al guardar.'); }
        finally { setWarningHabit(null); }
    };

    // Funciones auxiliares para el modal de advertencia.
    const requestReset = (habit) => setWarningHabit(habit);
    const cancelReset = () => setWarningHabit(null);
    const handleLogout = async () => { await logout(); };

    // Accedemos a la descripción de la alerta según el hábito actual o por defecto.
    const alertInfo = warningHabit ? (CONSECUENCIAS[warningHabit.id] || CONSECUENCIAS.default) : null;

    /**
     * habitsWithDisplay: Creamos un array procesado para el renderizado visual.
     * Calculamos si mostramos "horas" o "días" basándonos en la fecha actual.
     */
    const habitsWithDisplay = habits.map(h => {
        const now = new Date();
        const startDt = new Date(h.startDate);
        const diffMs = now - startDt;
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        return {
            ...h,
            display: days < 1 ? { value: hours, unit: 'horas' } : { value: days, unit: 'días' }
        };
    });

    return (
        <div className="contadores-container">
            <div className="top-bar-contadores">
                <button onClick={handleLogout} className="btn-salir">
                    <LogOut size={14} /> Salir
                </button>
                <button onClick={() => setShowAddModal(true)} className="btn-añadir">
                    <Plus size={14} /> Nuevo Hábito
                </button>
            </div>

            <h2 className="titulo-seccion">Tus Metas</h2>

            <div className="grid-contadores">
                {habitsWithDisplay.map((habit) => (
                    <div key={habit.id} className={`tarjeta-contador ${habit.display.unit === 'días' && habit.display.value > 7 ? 'racha-activa' : ''}`}>
                        <div className="header-contador-dinamico">
                            <div className="icon-title-container">
                                {ICON_MAP[habit.icon] || <Ghost size={20} />}
                                <span className="titulo-contador">{habit.name}</span>
                            </div>
                            <button onClick={() => removeHabit(habit.id)} className="btn-delete-habit">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div className="numero-contador" style={{ color: habit.color }}>{habit.display.value}</div>
                        <p className="texto-dias">{habit.display.unit}</p>

                        {habit.display.unit === 'horas' && (
                            <div className="mensaje-racha" style={{ color: 'var(--brand-color)' }}>
                                <Clock size={14} /> <span>¡Primeras horas clave!</span>
                            </div>
                        )}
                        {habit.display.unit === 'días' && habit.display.value > 7 && (
                            <div className="mensaje-racha">
                                <Trophy size={16} /> <span>¡Imparable!</span>
                            </div>
                        )}

                        <button onClick={() => requestReset(habit)} className="btn-reiniciar">
                            <RefreshCw size={12} /> Reiniciar
                        </button>
                    </div>
                ))}
            </div>

            <p className="nota-pie">Cada racha es una victoria sobre tu pasado.</p>

            {/* === MODAL DE AÑADIR HÁBITO === */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-recaida">
                        <h3 className="titulo-modal">Elige un nuevo desafío</h3>
                        <div className="grid-presets">
                            {PRESET_HABITS.map(preset => (
                                <button
                                    key={preset.id}
                                    className="btn-preset"
                                    onClick={() => addHabit(preset)}
                                    disabled={habits.some(h => h.id === preset.id)}
                                >
                                    {ICON_MAP[preset.icon]}
                                    <span>{preset.name}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="btn-cancelar-recaida" style={{ marginTop: '1rem' }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* === MODAL DE ADVERTENCIA === */}
            {warningHabit && (
                <div className="modal-overlay">
                    <div className="modal-recaida">
                        <AlertTriangle size={48} className="icono-alerta-grande" />
                        <h3 className="titulo-modal">{alertInfo.titulo}</h3>
                        <p className="texto-advertencia" style={{ fontWeight: 'bold' }}>{alertInfo.subtitulo}</p>
                        <p className="texto-advertencia">{alertInfo.texto}</p>

                        <ul className="lista-consecuencias">
                            {alertInfo.lista.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>

                        <p className="consejo-final">{alertInfo.consejo}</p>

                        <div className="acciones-modal">
                            <button onClick={cancelReset} className="btn-cancelar-recaida">
                                <ArrowLeft size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                                ¡ESPERA! NO HE RECAÍDO
                            </button>

                            <button onClick={confirmReset} className="btn-confirmar-recaida">
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
