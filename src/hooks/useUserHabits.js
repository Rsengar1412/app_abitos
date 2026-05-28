import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DEMO_HABITS = [
  {
    id: 'socialmedia',
    name: 'Redes Sociales',
    icon: 'Smartphone',
    color: '#9b59b6',
    startDate: new Date(Date.now() - 12 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'sugar',
    name: 'Azúcar/Dulces',
    icon: 'Coffee',
    color: '#f1c40f',
    startDate: new Date(Date.now() - 34 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'gaming',
    name: 'Videojuegos',
    icon: 'Gamepad2',
    color: '#2c3e50',
    startDate: new Date(Date.now() - 5 * MS_PER_DAY).toISOString(),
  },
];

export function useUserHabits(currentUser) {
  const [habits, setHabits] = useState([]);
  const [maxDays, setMaxDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.isDemo) return;
    if (!currentUser) return;

    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsub = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (docSnap) => {
        try {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const rawHabits = Array.isArray(data.habits) ? data.habits : [];

            const now = new Date();
            const processed = rawHabits.map((h) => {
              const startDate = h.startDate ? new Date(h.startDate) : new Date();
              const days = Math.floor((now - startDate) / MS_PER_DAY);
              return { ...h, days: isNaN(days) ? 0 : days };
            });

            setHabits(processed);
            setMaxDays(processed.length ? Math.max(...processed.map((h) => h.days)) : 0);
          } else {
            setHabits([]);
            setMaxDays(0);
          }
        } catch (err) {
          console.error('useUserHabits:', err);
        } finally {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      },
      (err) => {
        console.error('useUserHabits (listener error):', err);
        setHabits([]);
        setMaxDays(0);
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    );

    return () => {
      unsub();
      clearTimeout(safetyTimeout);
    };
  }, [currentUser]);

  if (currentUser?.isDemo) {
    const now = new Date();
    const habits = DEMO_HABITS.map((habit) => {
      const startDate = new Date(habit.startDate);
      const days = Math.floor((now - startDate) / MS_PER_DAY);
      return { ...habit, days: isNaN(days) ? 0 : days };
    });
    return {
      habits,
      maxDays: habits.length ? Math.max(...habits.map((h) => h.days)) : 0,
      loading: false,
    };
  }

  if (!currentUser) {
    return { habits: [], maxDays: 0, loading: false };
  }

  return { habits, maxDays, loading };
}
