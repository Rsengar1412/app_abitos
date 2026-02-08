import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Counter = ({ onDaysUpdate }) => {
    const [days, setDays] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        const loadHabitData = async () => {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setStartDate(data.habitStartDate);
                    calculateDays(data.habitStartDate);
                } else {
                    const now = new Date().toISOString();
                    await setDoc(docRef, { habitStartDate: now });
                    setStartDate(now);
                    setDays(0);
                    if (onDaysUpdate) onDaysUpdate(0);
                }
            } catch (error) {
                console.error('Error loading habit data:', error);
            }
        };
        loadHabitData();
    }, [currentUser]);

    const calculateDays = (start) => {
        const startDt = new Date(start);
        const now = new Date();
        const diffDays = Math.floor(Math.abs(now - startDt) / (1000 * 60 * 60 * 24));
        setDays(diffDays);
        if (onDaysUpdate) onDaysUpdate(diffDays);
    };

    const handleReset = async () => {
        if (window.confirm("¿Seguro que quieres reiniciar tu contador?")) {
            const now = new Date().toISOString();
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                await setDoc(docRef, { habitStartDate: now });
                setStartDate(now);
                setDays(0);
                if (onDaysUpdate) onDaysUpdate(0);
            } catch (error) {
                console.error('Error resetting counter:', error);
                alert('Error al reiniciar. Intenta de nuevo.');
            }
        }
    };

    const handleLogout = async () => {
        try { await logout(); } catch (error) { console.error('Error logging out:', error); }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center relative">
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 flex items-center gap-1.5 py-1.5 px-3 rounded-sm bg-bg-secondary text-text-secondary text-[0.85rem]"
            >
                <LogOut size={14} /> Salir
            </button>

            <div className="animate-fade-in">
                <p className="text-base text-text-secondary mb-2 uppercase tracking-wide">Días Libre</p>
                <div className="text-6xl font-extrabold leading-none text-brand mb-4">{days}</div>

                {days > 7 && (
                    <div className="flex items-center gap-2 text-accent mb-8">
                        <Trophy size={20} />
                        <span>¡Gran racha!</span>
                    </div>
                )}

                <button
                    onClick={handleReset}
                    className="mt-8 flex items-center gap-2 py-2 px-4 rounded-md bg-bg-secondary text-text-secondary text-sm"
                >
                    <RefreshCw size={16} /> Reiniciar
                </button>
            </div>
        </div>
    );
};

export default Counter;
