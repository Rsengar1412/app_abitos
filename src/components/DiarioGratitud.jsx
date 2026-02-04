import React, { useState, useEffect } from 'react';
import { BookHeart, Save, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
// Importamos los estilos
import './DiarioGratitud.css';

// Componente: Diario de Gratitud
// Permite al usuario guardar 3 cosas positivas cada día
const DiarioGratitud = () => {
    // ESTADOS
    const [entries, setEntries] = useState(['', '', '']); // Las 3 líneas de texto
    const [isCompleted, setIsCompleted] = useState(false); // ¿Ya completó hoy?
    const [loading, setLoading] = useState(true); // ¿Cargando datos?

    // Usuario actual
    const { currentUser } = useAuth();

    // Obtener la fecha de HOY en formato YYYY-MM-DD para usar como ID
    const getTodayDateId = () => {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    };

    // EFECTO: Comprobar si ya escribí hoy al cargar
    useEffect(() => {
        if (!currentUser) return;

        const checkTodayEntry = async () => {
            try {
                const dateId = getTodayDateId();
                // Buscamos en la colección 'gratitude' el documento: userID_fecha
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

    // LÓGICA: Manejar cambios en los inputs de texto
    const handleInputChange = (index, value) => {
        const newEntries = [...entries];
        newEntries[index] = value;
        setEntries(newEntries);
    };

    // LÓGICA: Guardar en Firebase
    const handleSave = async (e) => {
        e.preventDefault();

        // Validar que no estén vacíos
        if (entries.some(entry => entry.trim() === '')) {
            alert('Por favor completa los 3 espacios.');
            return;
        }

        try {
            const dateId = getTodayDateId();
            const docId = `${currentUser.uid}_${dateId}`;

            // Guardamos: items (texto), fecha y timestamp
            await setDoc(doc(db, 'gratitude', docId), {
                userId: currentUser.uid,
                date: dateId,
                items: entries,
                timestamp: new Date().toISOString()
            });

            setIsCompleted(true);
        } catch (error) {
            console.error('Error guardando gratitud:', error);
            alert('Error al guardar. Intenta de nuevo.');
        }
    };

    if (loading) return null; // No mostrar nada mientras carga

    // Si ya completó hoy, mostramos mensaje de éxito
    if (isCompleted) {
        return (
            <div className="diario-container diario-completado">
                <CheckCircle size={48} className="icono-check" />
                <h3 className="titulo-completado">¡Gratitud Registrada!</h3>
                <p className="mensaje-positivo">
                    Has empezado el día con la mentalidad correcta.
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
