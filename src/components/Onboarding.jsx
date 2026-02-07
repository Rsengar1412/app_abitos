import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
    Smartphone,
    Flame,
    Coffee,
    Hand,
    Eye,
    ChevronRight,
    Sparkles,
    Wine,
    Beer,
    Gamepad2,
    Dices,
    CupSoda
} from 'lucide-react';
import './Onboarding.css';

/**
 * PRESETS: Configuración inicial de hábitos disponibles para el usuario.
 * Cada uno tiene su ID, nombre, icono de Lucide, color principal y valores RGB para CSS.
 */
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

/**
 * Onboarding: Componente que se muestra a los usuarios nuevos.
 * Permite seleccionar los hábitos que quieren dejar y los guarda en la base de datos.
 */
const Onboarding = ({ uid }) => {
    // selected: Estado que guarda los hábitos que el usuario ha marcado.
    const [selected, setSelected] = useState([]);
    // loading: Controla el estado visual mientras se guarda en Firebase.
    const [loading, setLoading] = useState(false);

    /**
     * toggleHabit: Añade o quita un hábito de la lista de seleccionados.
     */
    const toggleHabit = (preset) => {
        const alreadySelected = selected.some(s => s.id === preset.id);
        if (alreadySelected) {
            setSelected(selected.filter(s => s.id !== preset.id));
        } else {
            setSelected([...selected, preset]);
        }
    };

    /**
     * startApp: Guarda los hábitos seleccionados en Firestore y activa la app principal.
     */
    const startApp = async () => {
        if (selected.length === 0 || loading) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'users', uid);
            const now = new Date().toISOString();
            // Mapeamos los seleccionados al formato que espera el resto de la app.
            const habitsToSave = selected.map(h => ({
                id: h.id,
                name: h.name,
                icon: h.iconId, // Guardamos el ID del icono para el mapeo dinámico.
                color: h.color,
                startDate: now
            }));

            // Usamos merge: true para no borrar otros datos que pudiera tener el perfil del usuario.
            await setDoc(docRef, { habits: habitsToSave }, { merge: true });
        } catch (error) {
            console.error("Error al guardar onboarding:", error);
            alert("No se pudo conectar con el servidor. Revisa tu conexión de internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-card">
                <div className="onboarding-header">
                    <div className="icon-welcome">
                        <Sparkles size={40} color="#e74c3c" />
                    </div>
                    <h1>Bienvenido a Libre</h1>
                    <p>Hoy empieza tu nueva vida. ¿Qué hábitos quieres dejar atrás?</p>
                </div>

                {/* Grid con las opciones de hábitos */}
                <div className="onboarding-grid">
                    {PRESETS.map((p) => {
                        const isSelected = selected.some(s => s.id === p.id);
                        return (
                            <button
                                key={p.id}
                                className={`onboarding-item ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleHabit(p)}
                                style={{
                                    '--habit-color': p.color,
                                    '--habit-rgb': p.rgb
                                }}
                            >
                                <div className="item-icon">{p.icon}</div>
                                <span className="item-name">{p.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="onboarding-footer">
                    <button
                        className="btn-start"
                        disabled={selected.length === 0 || loading}
                        onClick={startApp}
                    >
                        {loading ? 'Preparando todo...' : 'Comenzar mi viaje'}
                        {!loading && <ChevronRight size={20} />}
                    </button>
                    <p className="footer-note">Podrás añadir más hábitos después si lo deseas.</p>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
