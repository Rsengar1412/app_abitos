import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings2, Check } from 'lucide-react';
import './Notificaciones.css';

/**
 * HABIT_MESSAGES: Textos para las notificaciones push según el hábito.
 */
const HABIT_MESSAGES = {
    porn: { title: "Dopamina Real", body: "No busques lo fácil. Busca lo que te hace sentir orgulloso." },
    smoking: { title: "Aire Puro", body: "¿Has notado cómo respiras hoy? Sigue así." },
    socialmedia: { title: "Mundo Real", body: "Toda la vida pasa fuera de la pantalla. Levanta la vista." },
    sugar: { title: "Energía Estable", body: "Tu cuerpo prefiere combustible de calidad. Elige bien hoy." },
    default: { title: "Mantente Fuerte", body: "Un paso más hacia tu mejor versión." }
};

/**
 * Notificaciones: Gestiona los permisos del navegador para enviar alertas push.
 * habits: Recibe la lista de hábitos para configurar recordatorios individuales.
 */
const Notificaciones = ({ habits = [] }) => {
    // Aseguramos que habits sea un array para evitar errores en el .map()
    const safeHabits = Array.isArray(habits) ? habits : [];

    // permission: Estado del permiso en el navegador (default, granted, denied).
    const [permission, setPermission] = useState('default');
    // enabled: Si el usuario ha activado globalmente las alertas en la app.
    const [enabled, setEnabled] = useState(false);
    // activeHabitsReminders: Diccionario de qué hábitos tienen el recordatorio encendido.
    const [activeHabitsReminders, setActiveHabitsReminders] = useState({});

    /**
     * EFECTO: Cargar preferencias guardadas localmente al iniciar.
     */
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            setEnabled(localStorage.getItem('notificationsEnabled') === 'true');
            const stored = JSON.parse(localStorage.getItem('habitReminders') || '{}');
            setActiveHabitsReminders(stored);
        }
    }, []);

    /**
     * requestPermission: Solicita al navegador permiso para enviar notificaciones.
     */
    const requestPermission = async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            setEnabled(true);
            localStorage.setItem('notificationsEnabled', 'true');
            // Enviamos una notificación de prueba para confirmar éxito.
            new Notification('¡Soporte Activo!', {
                body: 'Recibirás recordatorios personalizados para tus hábitos.',
                icon: '/icon.svg'
            });
        }
    };

    /**
     * toggleNotification: Activa o desactiva la función global sin revocar permisos.
     */
    const toggleNotification = () => {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem('notificationsEnabled', next ? 'true' : 'false');
    };

    /**
     * toggleHabitReminder: Activa recordatorios para un hábito específico.
     */
    const toggleHabitReminder = (id) => {
        const next = { ...activeHabitsReminders, [id]: !activeHabitsReminders[id] };
        setActiveHabitsReminders(next);
        localStorage.setItem('habitReminders', JSON.stringify(next));
    };

    // Si el navegador no soporta notificaciones, no renderizamos nada.
    if (!('Notification' in window)) return null;

    return (
        <div className="notificaciones-container">
            <div className="header-notif-main">
                <div className="info-notif-text">
                    <h3 className="titulo-notif">Recordatorios Personalizados</h3>
                    <p className="desc-notif">Recibe apoyo justo cuando más lo necesitas.</p>
                </div>
                <button
                    onClick={permission === 'granted' ? toggleNotification : requestPermission}
                    className={`btn-master-toggle ${enabled ? 'active' : ''}`}
                >
                    {enabled ? <Bell size={18} /> : <BellOff size={18} />}
                    <span>{enabled ? 'Activas' : 'Inactivas'}</span>
                </button>
            </div>

            {/* Solo mostramos la lista de hábitos si las notificaciones están activadas. */}
            {enabled && safeHabits.length > 0 && (
                <div className="habits-reminders-list">
                    <p className="small-label">Recordatorios por Hábito:</p>
                    <div className="grid-notif-habitos">
                        {safeHabits.map(h => (
                            <button
                                key={h.id}
                                className={`btn-habit-notif ${activeHabitsReminders[h.id] ? 'active' : ''}`}
                                onClick={() => toggleHabitReminder(h.id)}
                            >
                                <div className="dot-habit-notif" style={{ backgroundColor: h.color }} />
                                <span className="name-habit-notif">{h.name}</span>
                                {activeHabitsReminders[h.id] && <Check size={14} className="check-notif" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {permission === 'denied' && (
                <p className="error-permisos">
                    ❌ Las notificaciones están bloqueadas en tu navegador. Actívalas en ajustes para recibir apoyo.
                </p>
            )}
        </div>
    );
};

export default Notificaciones;
