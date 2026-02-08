import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';

const HABIT_MESSAGES = {
    porn: { title: "Dopamina Real", body: "No busques lo fácil. Busca lo que te hace sentir orgulloso." },
    smoking: { title: "Aire Puro", body: "¿Has notado cómo respiras hoy? Sigue así." },
    socialmedia: { title: "Mundo Real", body: "Toda la vida pasa fuera de la pantalla. Levanta la vista." },
    sugar: { title: "Energía Estable", body: "Tu cuerpo prefiere combustible de calidad. Elige bien hoy." },
    alcohol: { title: "Mente Clara", body: "No necesitas anestesia para vivir. Disfruta tu lucidez hoy." },
    caffeine: { title: "Energía Natural", body: "Deja que tu cuerpo encuentre su propio ritmo. Tú puedes." },
    gaming: { title: "Misión: Vida Real", body: "El mejor nivel es el que estás construyendo fuera de la pantalla." },
    gambling: { title: "Victoria Segura", body: "La única forma de ganar es no jugar. Tu dinero y tu tiempo valen más." },
    default: { title: "Mantente Fuerte", body: "Un paso más hacia tu mejor versión." }
};

const Notificaciones = ({ habits = [] }) => {
    const safeHabits = Array.isArray(habits) ? habits : [];
    const [permission, setPermission] = useState('default');
    const [enabled, setEnabled] = useState(false);
    const [activeHabitsReminders, setActiveHabitsReminders] = useState({});

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            setEnabled(localStorage.getItem('notificationsEnabled') === 'true');
            setActiveHabitsReminders(JSON.parse(localStorage.getItem('habitReminders') || '{}'));
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            setEnabled(true);
            localStorage.setItem('notificationsEnabled', 'true');
            new Notification('¡Soporte Activo!', { body: 'Recibirás recordatorios personalizados para tus hábitos.', icon: '/icon.svg' });
        }
    };

    const toggleNotification = () => {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem('notificationsEnabled', next ? 'true' : 'false');
    };

    const toggleHabitReminder = (id) => {
        const next = { ...activeHabitsReminders, [id]: !activeHabitsReminders[id] };
        setActiveHabitsReminders(next);
        localStorage.setItem('habitReminders', JSON.stringify(next));
    };

    if (!('Notification' in window)) return null;

    return (
        <div className="p-6 rounded-lg bg-bg-secondary mb-8 border border-white/5">
            <div className="flex justify-between items-center mb-6 gap-4 sm:flex-col sm:items-stretch">
                <div className="text-left">
                    <h3 className="text-lg font-bold text-text-primary mb-1">Recordatorios Personalizados</h3>
                    <p className="text-sm text-text-secondary max-w-[300px]">Recibe apoyo justo cuando más lo necesitas.</p>
                </div>
                <button
                    type="button"
                    onClick={permission === 'granted' ? toggleNotification : requestPermission}
                    className={`flex items-center gap-2.5 py-3 px-5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 bg-bg-primary text-text-secondary border border-white/10 cursor-pointer ${enabled ? 'bg-brand text-white border-transparent shadow-lg shadow-brand/30' : ''} sm:w-full sm:justify-center`}
                >
                    {enabled ? <Bell size={18} /> : <BellOff size={18} />}
                    <span>{enabled ? 'Activas' : 'Inactivas'}</span>
                </button>
            </div>

            {enabled && safeHabits.length > 0 && (
                <div className="text-left bg-black/20 p-5 rounded-md border border-white/[0.03]">
                    <p className="text-[0.7rem] text-text-secondary uppercase tracking-wide mb-3 font-bold">Recordatorios por Hábito:</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5 sm:grid-cols-1">
                        {safeHabits.map(h => (
                            <button
                                key={h.id}
                                type="button"
                                className={`flex items-center gap-3 py-2.5 px-2.5 rounded-sm cursor-pointer transition-all bg-bg-primary border border-white/5 text-text-secondary hover:border-brand ${activeHabitsReminders[h.id] ? 'bg-white/10 text-text-primary border-white/20' : ''}`}
                                onClick={() => toggleHabitReminder(h.id)}
                            >
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                                <span className="text-sm flex-1 text-left font-medium">{h.name}</span>
                                {activeHabitsReminders[h.id] && <Check size={14} className="text-[#2ecc71]" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {permission === 'denied' && (
                <p className="mt-6 text-sm text-marketing-red text-center bg-marketing-red/10 py-2.5 px-3 rounded-sm">
                    ❌ Las notificaciones están bloqueadas en tu navegador. Actívalas en ajustes para recibir apoyo.
                </p>
            )}
        </div>
    );
};

export default Notificaciones;
