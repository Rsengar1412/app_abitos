import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Smartphone, Flame, Coffee, Hand, Eye, ChevronRight, Sparkles,
    Wine, Gamepad2, Dices, CupSoda
} from 'lucide-react';

const PRESETS = [
    { id: 'porn', name: 'Pornografía', iconId: 'Eye', icon: <Eye size={24} />, color: '#e74c3c', rgb: '231, 76, 60' },
    { id: 'masturbation', name: 'Masturbación', iconId: 'Hand', icon: <Hand size={24} />, color: '#3498db', rgb: '52, 152, 219' },
    { id: 'smoking', name: 'Fumar', iconId: 'Flame', icon: <Flame size={24} />, color: '#e67e22', rgb: '230, 126, 34' },
    { id: 'socialmedia', name: 'Redes Sociales', iconId: 'Smartphone', icon: <Smartphone size={24} />, color: '#9b59b6', rgb: '155, 89, 182' },
    { id: 'sugar', name: 'Azúcar / Dulces', iconId: 'Coffee', icon: <Coffee size={24} />, color: '#f1c40f', rgb: '241, 196, 15' },
    { id: 'alcohol', name: 'Alcohol', iconId: 'Wine', icon: <Wine size={24} />, color: '#8e44ad', rgb: '142, 68, 173' },
    { id: 'caffeine', name: 'Cafeína', iconId: 'CupSoda', icon: <CupSoda size={24} />, color: '#d35400', rgb: '211, 84, 0' },
    { id: 'gaming', name: 'Videojuegos', iconId: 'Gamepad2', icon: <Gamepad2 size={24} />, color: '#2c3e50', rgb: '44, 62, 80' },
    { id: 'gambling', name: 'Apuestas', iconId: 'Dices', icon: <Dices size={24} />, color: '#27ae60', rgb: '39, 174, 96' }
];

const Onboarding = ({ uid }) => {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleHabit = (preset) => {
        if (selected.some(s => s.id === preset.id)) {
            setSelected(selected.filter(s => s.id !== preset.id));
        } else {
            setSelected([...selected, preset]);
        }
    };

    const startApp = async () => {
        if (selected.length === 0 || loading) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'users', uid);
            const now = new Date().toISOString();
            const habitsToSave = selected.map(h => ({
                id: h.id,
                name: h.name,
                icon: h.iconId,
                color: h.color,
                startDate: now
            }));
            await setDoc(docRef, { habits: habitsToSave }, { merge: true });
        } catch (error) {
            console.error("Error al guardar onboarding:", error);
            alert("No se pudo conectar con el servidor. Revisa tu conexión de internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[2000] p-5 overflow-y-auto bg-gradient-to-br from-[#1a1a1a] to-black sm:p-4">
            <div className="w-full max-w-[500px] rounded-[32px] p-8 text-center border border-white/10 shadow-2xl bg-gradient-to-br from-[#1e1e1e] to-[#141414] animate-fade-in sm:p-6 sm:rounded-3xl">
                <div className="mb-6">
                    <div className="flex justify-center">
                        <Sparkles size={40} color="#e74c3c" />
                    </div>
                    <h1 className="mt-6 mb-2 text-3xl font-extrabold bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent sm:text-2xl sm:mt-4">
                        Bienvenido a Libre
                    </h1>
                    <p className="text-text-secondary text-lg leading-relaxed mb-10 sm:text-base sm:mb-8">
                        Hoy empieza tu nueva vida. ¿Qué hábitos quieres dejar atrás?
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-1">
                    {PRESETS.map((p) => {
                        const isSelected = selected.some(s => s.id === p.id);
                        return (
                            <button
                                key={p.id}
                                type="button"
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-brand bg-brand/20 shadow-lg' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => toggleHabit(p)}
                            >
                                <div className="flex items-center justify-center text-text-primary">{p.icon}</div>
                                <span className="text-sm font-medium text-text-primary">{p.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div>
                    <button
                        type="button"
                        className="w-full py-5 px-5 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center gap-2.5 border-0 cursor-pointer transition-all shadow-lg shadow-brand/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:shadow-none hover:scale-[1.02] hover:brightness-110 sm:py-4 sm:text-base"
                        disabled={selected.length === 0 || loading}
                        onClick={startApp}
                    >
                        {loading ? 'Preparando todo...' : 'Comenzar mi viaje'}
                        {!loading && <ChevronRight size={20} />}
                    </button>
                    <p className="text-sm text-text-secondary mt-5">Podrás añadir más hábitos después si lo deseas.</p>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
