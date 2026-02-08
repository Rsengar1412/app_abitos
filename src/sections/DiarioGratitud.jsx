import React, { useState, useEffect } from 'react';
import { BookHeart, Save, CheckCircle } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const DiarioGratitud = () => {
    const [entries, setEntries] = useState(['', '', '']);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const getTodayDateId = () => {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    };

    useEffect(() => {
        if (!currentUser) return;
        const checkTodayEntry = async () => {
            try {
                const dateId = getTodayDateId();
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

    const handleInputChange = (index, value) => {
        const newEntries = [...entries];
        newEntries[index] = value;
        setEntries(newEntries);
    };

    const handleSave = async (e) => {
        e.preventDefault();
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

    if (isCompleted) {
        return (
            <div className="bg-bg-secondary rounded-md p-6 mb-8 border border-border-default text-center py-8 px-4 animate-fade-in">
                <CheckCircle size={48} className="text-success mb-4 mx-auto block" />
                <h3 className="text-lg font-semibold mb-2 text-text-primary">¡Mente Positiva!</h3>
                <p className="text-text-secondary text-sm">Has registrado tu gratitud de hoy. Este hábito cambia tu cerebro.</p>
            </div>
        );
    }

    return (
        <div className="bg-bg-secondary rounded-md p-6 mb-8 border border-border-default transition-all duration-300">
            <div className="flex items-center justify-center gap-2.5 mb-4 text-text-primary">
                <BookHeart size={24} className="text-brand" />
                <h3 className="text-lg font-semibold">Diario de Gratitud</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 text-center">Escribe 3 cosas por las que estás agradecido hoy:</p>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
                {entries.map((entry, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`${index + 1}. Estoy agradecido por...`}
                        value={entry}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="w-full py-2.5 px-3 rounded-sm border border-white/10 bg-bg-primary text-text-primary text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-text-secondary placeholder:opacity-60"
                    />
                ))}
                <button
                    type="submit"
                    className="mt-4 py-2.5 px-3 rounded-sm bg-brand text-white font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors hover:brightness-110"
                >
                    <Save size={18} /> Guardar Hoy
                </button>
            </form>
        </div>
    );
};

export default DiarioGratitud;
