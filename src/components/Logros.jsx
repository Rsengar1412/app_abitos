import React from 'react';
import { Award } from 'lucide-react';
// Importamos los estilos
import './Logros.css';

// Configuración de las medallas/logros
const ACHIEVEMENTS = [
    {
        days: 7,
        title: "Primera Semana",
        desc: "El comienzo de todo",
        img: "/src/assets/badges/7_days.png" // O generada dinámicamente
    },
    {
        days: 30,
        title: "Un Mes Fuerte",
        desc: "Disciplina establecida",
        img: "/src/assets/badges/30_days.png"
    },
    {
        days: 90,
        title: "Guerrero",
        desc: "Reinicio cerebral",
        img: "/src/assets/badges/90_days.png"
    },
    {
        days: 365,
        title: "Leyenda",
        desc: "Una nueva vida",
        img: "/src/assets/badges/365_days.png"
    }
];

// Componente: Logros y Medallas
const Logros = ({ currentDays }) => {
    // Calculamos el próximo logro para la barra de progreso
    const nextAchievement = ACHIEVEMENTS.find(a => a.days > currentDays) || ACHIEVEMENTS[ACHIEVEMENTS.length - 1];
    const prevAchievementDays = 0; // Podríamos buscar el anterior para calcular % relativo

    // Cálculo de porcentaje para la barra
    const totalRange = nextAchievement.days - prevAchievementDays;
    const progressInRange = currentDays - prevAchievementDays;
    const progressPercent = Math.min(100, Math.max(0, (progressInRange / nextAchievement.days) * 100));

    return (
        <div className="logros-container">
            <h3 className="titulo-logros">
                <Award size={24} className="text-brand" />
                Tu Sala de Trofeos
            </h3>

            <div className="grid-medallas">
                {ACHIEVEMENTS.map((ach, idx) => {
                    const isUnlocked = currentDays >= ach.days;

                    return (
                        <div
                            key={idx}
                            className={`medalla-card ${isUnlocked ? 'desbloqueada' : ''}`}
                        >
                            {/* Como no tenemos las imágenes reales aún, usamos un icono o placeholder */}
                            <div className="img-medalla" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                {isUnlocked ? '🏆' : '🔒'}
                            </div>

                            <h4 className="titulo-medalla">{ach.title}</h4>
                            <p className="desc-medalla">{ach.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* Barra de progreso hacia el siguiente nivel */}
            <div className="progreso-proximo-logro">
                <div className="texto-progreso">
                    <span>Progreso hacia Nivel {nextAchievement.title}</span>
                    <span>{Math.floor(progressPercent)}%</span>
                </div>
                <div className="barra-fondo">
                    <div
                        className="barra-relleno"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '4px', textAlign: 'right', opacity: 0.6 }}>
                    {currentDays} / {nextAchievement.days} días
                </p>
            </div>
        </div>
    );
};

export default Logros;
