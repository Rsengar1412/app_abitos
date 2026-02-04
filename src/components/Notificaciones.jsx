import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import './Notificaciones.css';

// Componente: Gestor de Notificaciones
// Pide permiso y programa recordatorios locales
const Notificaciones = () => {
    // ESTADOS:
    // 'default' (sin preguntar), 'granted' (sí), 'denied' (no)
    const [permission, setPermission] = useState('default');
    const [enabled, setEnabled] = useState(false); // ¿Están activas en nuestra app?

    // EFECTO: Comprobar permisos al cargar
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            // Leemos de la memoria local si el usuario las activó antes
            setEnabled(localStorage.getItem('notificationsEnabled') === 'true');
        }
    }, []);

    // LÓGICA: Pedir permiso al navegador
    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert('Tu navegador no soporta notificaciones');
            return;
        }

        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            setEnabled(true);
            localStorage.setItem('notificationsEnabled', 'true');
            scheduleNotifications();

            // Enviamos una prueba
            new Notification('¡Notificaciones Activadas!', {
                body: 'Recibirás recordatorios diarios para mantenerte fuerte.',
                icon: '/icon.svg', // Icono de la app
                badge: '/icon.svg'
            });
        }
    };

    // LÓGICA: Desactivar (solo a nivel de nuestra app, no del navegador)
    const disableNotifications = () => {
        setEnabled(false);
        localStorage.setItem('notificationsEnabled', 'false');
    };

    // LÓGICA: Programar los avisos (simulación)
    // En una app web real sin servidor push, esto se basa en que la app esté abierta o use Service Workers
    // Aquí usamos un setTimeout simple que funcionará si la pestaña está abierta
    const scheduleNotifications = () => {
        // Recordatorio de la mañana (9:00 AM)
        scheduleDailyNotification(9, 0, {
            title: '💪 Buenos días, Guerrero',
            body: 'Hoy es un nuevo día. Tú decides quién eres.'
        });

        // Recordatorio de la noche (10:00 PM)
        scheduleDailyNotification(22, 0, {
            title: '🌙 Hora de descansar',
            body: 'Deja el móvil fuera del cuarto. Tu yo del mañana te lo agradecerá.'
        });
    };

    const scheduleDailyNotification = (hour, minute, options) => {
        const now = new Date();
        const scheduledTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            0
        );

        // Si ya pasó la hora hoy, programar para mañana
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilNotification = scheduledTime.getTime() - now.getTime();

        setTimeout(() => {
            // Solo enviar si siguen activadas
            if (localStorage.getItem('notificationsEnabled') === 'true') {
                new Notification(options.title, {
                    body: options.body,
                    icon: '/icon.svg',
                    badge: '/icon.svg',
                    requireInteraction: false
                });
            }

            // Reprogramar para el día siguiente (bucle)
            scheduleDailyNotification(hour, minute, options);
        }, timeUntilNotification);
    };

    // Si el navegador no tiene notificaciones, no renderizamos nada
    if (!('Notification' in window)) {
        return null;
    }

    return (
        <div className="notificaciones-container">
            <div className="info-notif">
                <div className="header-info-notif">
                    {enabled ? <Bell size={18} /> : <BellOff size={18} />}
                    <span className="titulo-notif">
                        Recordatorios Diarios
                    </span>
                </div>
                <p className="desc-notif">
                    {enabled
                        ? 'Recibirás motivación por la mañana y recordatorios por la noche'
                        : 'Activa para recibir apoyo en momentos clave'
                    }
                </p>
            </div>

            {!enabled ? (
                <button
                    onClick={requestPermission}
                    disabled={permission === 'denied'}
                    className="btn-activar-notif"
                    style={{
                        cursor: permission === 'denied' ? 'not-allowed' : 'pointer',
                        backgroundColor: permission === 'denied' ? 'var(--bg-primary)' : 'var(--brand-color)',
                        color: permission === 'denied' ? 'var(--text-secondary)' : 'white'
                    }}
                >
                    {permission === 'denied' ? 'Bloqueado' : 'Activar'}
                </button>
            ) : (
                <button
                    onClick={disableNotifications}
                    className="btn-desactivar-notif"
                >
                    Desactivar
                </button>
            )}
        </div>
    );
};

export default Notificaciones;
