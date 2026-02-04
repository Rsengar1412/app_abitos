import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
                    // First time: Initialize
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
        const diffTime = Math.abs(now - startDt);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            position: 'relative'
        }}>
            <button
                onClick={handleLogout}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                }}
            >
                <LogOut size={14} />
                Salir
            </button>

            <div className="fade-in">
                <p style={{
                    fontSize: '1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Días Libre
                </p>
                <div style={{
                    fontSize: '6rem',
                    fontWeight: '800',
                    color: 'var(--brand-color)',
                    lineHeight: '1',
                    marginBottom: '1rem'
                }}>
                    {days}
                </div>

                {days > 7 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--accent-color)',
                        marginBottom: '2rem'
                    }}>
                        <Trophy size={20} />
                        <span>¡Gran racha!</span>
                    </div>
                )}

                <button
                    onClick={handleReset}
                    style={{
                        marginTop: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                    }}
                >
                    <RefreshCw size={16} />
                    Reiniciar
                </button>
            </div>
        </div>
    );
};

export default Counter;
