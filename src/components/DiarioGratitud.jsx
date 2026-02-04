import React, { useState, useEffect } from 'react';
import { BookHeart, Save, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
// Importamos los estilos
import './DiarioGratitud.css';

/**
 * DiarioGratitud: Espacio diario para que el usuario registre 3 cosas positivas.
 * Ayuda a reprogramar el sistema de recompensa del cerebro enfocándose en lo positivo.
 */
const DiarioGratitud = () => {
    // entries: Almacena las 3 líneas de texto del diario.
    const [entries, setEntries] = useState(['', '', '']);
    // isCompleted: Indica si el usuario ya guardó su entrada de hoy en la base de datos.
    const [isCompleted, setIsCompleted] = useState(false);
    // loading: Estado de carga inicial mientras consultamos Firebase.
    const [loading, setLoading] = useState(true);

    // Acceso al usuario logueado.
    const { currentUser } = useAuth();

    /**
     * getTodayDateId: Genera un ID basado en la fecha actual (YYYY-M-D).
     */
    const getTodayDateId = () => {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    };

    /**
     * EFECTO: Al cargar, verificamos en Firestore si ya existe una entrada para el día de hoy.
     */
    useEffect(() => {
        if (!currentUser) return;

        const checkTodayEntry = async () => {
            try {
                const dateId = getTodayDateId();
                // El ID del documento es una combinación de UID_fecha para que sea único por día y usuario.
                const docId = `${currentUser.uid}_${dateId}`;
                const docRef = doc(db, 'gratitude', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEntries(docSnap.data().items || ['', '', '']);
                    setIsCompleted(true);
                }
            } catch (error) {
                console.error('Error verificando diario:', error);
            } finally {
                setLoading(false);
            }
        };

        checkTodayEntry();
    }, [currentUser]);

    /**
     * handleInputChange: Actualiza el estado de una de las 3 líneas de texto.
     */
    const handleInputChange = (index, value) => {
        const newEntries = [...entries];
        newEntries[index] = value;
        setEntries(newEntries);
    };

    /**
     * handleSave: Guarda los textos en Firestore y marca el diario como completado.
     */
    const handleSave = async (e) => {
        e.preventDefault();

        // Evitamos que se guarden entradas vacías.
        if (entries.some(entry => entry.trim() === '')) {
            alert('Por favor completa los 3 espacios para reflexionar adecuadamente.');
            return;
        }

        try {
            const dateId = getTodayDateId();
            const docId = `${currentUser.uid}_${dateId}`;

            await setDoc(doc(db, 'gratitude', docId), {
                userId: currentUser.uid,
                date: dateId,
                items: entries,
                timestamp: new Date().toISOString()
            });

            setIsCompleted(true);
        } catch (error) {
            console.error('Error guardando gratitud:', error);
            alert('No se pudo guardar. Revisa tu conexión.');
        }
    };

    if (loading) return null;

    // Vista de éxito tras guardar.
    if (isCompleted) {
        return (
            <div className="diario-container diario-completado">
                <CheckCircle size={48} className="icono-check" />
                <h3 className="titulo-completado">¡Mente Positiva!</h3>
                <p className="mensaje-positivo">
                    Has registrado tu gratitud de hoy. Este hábito cambia tu cerebro.
                </p>
            </div>
        );
    }

    // Formulario si aún no ha completado
    return (
        <div className="diario-container">
            <div className="diario-header">
                <BookHeart size={24} className="text-brand" />
                <h3 className="titulo-diario">Diario de Gratitud</h3>
            </div>

            <p className="diario-instruccion">
                Escribe 3 cosas por las que estás agradecido hoy:
            </p>

            <form onSubmit={handleSave} className="formulario-gratitud">
                {entries.map((entry, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`${index + 1}. Estoy agradecido por...`}
                        value={entry}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="input-gratitud"
                    />
                ))}

                <button type="submit" className="btn-guardar-diario">
                    <Save size={18} />
                    Guardar Hoy
                </button>
            </form>
        </div>
    );
};

export default DiarioGratitud;
