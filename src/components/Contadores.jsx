import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, LogOut, Eye, Hand, AlertTriangle, ArrowLeft, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Contadores.css';

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
    }
};

const Contadores = ({ onDaysUpdate }) => {
    // ESTADOS: Ahora guardamos un objeto { value: 5, unit: 'horas'/'días' }
    const [pornTime, setPornTime] = useState({ value: 0, unit: 'días' });
    const [masturbationTime, setMasturbationTime] = useState({ value: 0, unit: 'días' });

    // Estados para el MODAL de Alerta
    const [warningType, setWarningType] = useState(null);

    const { currentUser, logout } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        const loadHabitData = async () => {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.pornStartDate) calculateTime(data.pornStartDate, 'porn');
                    if (data.masturbationStartDate) calculateTime(data.masturbationStartDate, 'masturbation');
                } else {
                    const now = new Date().toISOString();
                    await setDoc(docRef, { pornStartDate: now, masturbationStartDate: now });
                    setPornTime({ value: 0, unit: 'horas' });
                    setMasturbationTime({ value: 0, unit: 'horas' });
                    if (onDaysUpdate) onDaysUpdate({ porn: 0, masturbation: 0 });
                }
            } catch (error) { console.error('Error cargando datos:', error); }
        };
        loadHabitData();

        // Actualizar cada minuto para que las horas suban en tiempo real el primer día
        const interval = setInterval(() => {
            loadHabitData();
        }, 60000);
        return () => clearInterval(interval);

    }, [currentUser]);

    const calculateTime = (start, type) => {
        const startDt = new Date(start);
        const now = new Date();
        const diffMs = now - startDt;

        // Cálculos
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        let result = { value: 0, unit: 'días' };

        if (days < 1) {
            // Si es menos de 1 día, mostramos HORAS
            result = { value: hours, unit: 'horas' };
        } else {
            // Si ya pasó un día, mostramos DÍAS
            result = { value: days, unit: 'días' };
        }

        if (type === 'porn') setPornTime(result);
        else setMasturbationTime(result);

        // Al padre le pasamos siempre DÍAS para los logros (aunque sean 0)
        if (onDaysUpdate) {
            onDaysUpdate((prev) => ({
                ...prev,
                [type]: days
            }));
        }
    };

    const requestReset = (type) => setWarningType(type);
    const cancelReset = () => setWarningType(null);

    const confirmReset = async () => {
        if (!warningType) return;
        const type = warningType;
        const now = new Date().toISOString();
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            const currentData = docSnap.exists() ? docSnap.data() : {};

            if (type === 'porn') {
                await setDoc(docRef, { ...currentData, pornStartDate: now });
                setPornTime({ value: 0, unit: 'horas' });
            } else {
                await setDoc(docRef, { ...currentData, masturbationStartDate: now });
                setMasturbationTime({ value: 0, unit: 'horas' });
            }
            if (onDaysUpdate) onDaysUpdate(prev => ({ ...prev, [type]: 0 }));
        } catch (error) { alert('Error al guardar.'); }
        finally { setWarningType(null); }
    };

    const handleLogout = async () => { await logout(); };
    const alertInfo = warningType ? CONSECUENCIAS[warningType] : null;

    return (
        <div className="contadores-container">
            <button onClick={handleLogout} className="btn-salir">
                <LogOut size={14} /> Salir
            </button>

            <h2 className="titulo-seccion">Tus Contadores</h2>

            <div className="grid-contadores">
                {/* --- PORNOGRAFÍA --- */}
                <div className={`tarjeta-contador ${pornTime.unit === 'días' && pornTime.value > 7 ? 'racha-activa' : ''}`}>
                    <div className="header-contador">
                        <Eye size={20} /> <span className="titulo-contador">Pornografía</span>
                    </div>
                    <div className="numero-contador">{pornTime.value}</div>
                    <p className="texto-dias">{pornTime.unit}</p>

                    {/* Mensaje motivacional según fase */}
                    {pornTime.unit === 'horas' && (
                        <div className="mensaje-racha" style={{ color: 'var(--brand-color)' }}>
                            <Clock size={14} /> <span>¡El inicio es duro!</span>
                        </div>
                    )}
                    {pornTime.unit === 'días' && pornTime.value > 7 && (
                        <div className="mensaje-racha">
                            <Trophy size={16} /> <span>¡Imparable!</span>
                        </div>
                    )}

                    <button onClick={() => requestReset('porn')} className="btn-reiniciar">
                        <RefreshCw size={12} /> Reiniciar
                    </button>
                </div>

                {/* --- MASTURBACIÓN --- */}
                <div className={`tarjeta-contador ${masturbationTime.unit === 'días' && masturbationTime.value > 7 ? 'racha-activa' : ''}`}>
                    <div className="header-contador">
                        <Hand size={20} /> <span className="titulo-contador">Masturbación</span>
                    </div>
                    <div className="numero-contador">{masturbationTime.value}</div>
                    <p className="texto-dias">{masturbationTime.unit}</p>

                    {masturbationTime.unit === 'horas' && (
                        <div className="mensaje-racha" style={{ color: 'var(--brand-color)' }}>
                            <Clock size={14} /> <span>Recuperando energía...</span>
                        </div>
                    )}
                    {masturbationTime.unit === 'días' && masturbationTime.value > 7 && (
                        <div className="mensaje-racha">
                            <Trophy size={16} /> <span>¡Imparable!</span>
                        </div>
                    )}

                    <button onClick={() => requestReset('masturbation')} className="btn-reiniciar">
                        <RefreshCw size={12} /> Reiniciar
                    </button>
                </div>
            </div>

            <p className="nota-pie">Cada decisión cuenta.</p>

            {/* === MODAL DE ADVERTENCIA === */}
            {warningType && (
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
