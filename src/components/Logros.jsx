import React from 'react';
import { Award, CheckCircle2, Circle } from 'lucide-react';
import './Logros.css';

const ACHIEVEMENTS = [
    { days: 1, title: "Primer Paso", desc: "El viaje de mil millas comienza aquí", icon: "🌱" },
    { days: 3, title: "Persistencia", desc: "Superando el inicio crítico", icon: "🔥" },
    { days: 7, title: "Primera Semana", desc: "Una victoria sólida", icon: "🎖️" },
    { days: 15, title: "Quincena de Hierro", desc: "Ya no eres el mismo", icon: "⚔️" },
    { days: 30, title: "Un Mes Fuerte", desc: "Disciplina establecida", icon: "🏆" },
    { days: 90, title: "Guerrero", desc: "Reinicio cerebral", icon: "🛡️" },
    { days: 365, title: "Leyenda", desc: "Una vida nueva", icon: "👑" }
];

const Logros = ({ habits = [], currentMaxDays = 0 }) => {
    const nextAchievement = ACHIEVEMENTS.find(a => a.days > currentMaxDays) || ACHIEVEMENTS[ACHIEVEMENTS.length - 1];

    // Calcular porcentaje hacia el siguiente logro
    const lastAchDays = ACHIEVEMENTS.filter(a => a.days <= currentMaxDays).pop()?.days || 0;
    const progressPercent = Math.min(100, Math.max(0, ((currentMaxDays - lastAchDays) / (nextAchievement.days - lastAchDays)) * 100));

    return (
        <div className="logros-container">
            <h3 className="titulo-logros">
                <Award size={24} className="text-brand" />
                Tu Sala de Trofeos
            </h3>

            {/* Resumen de hábitos y sus récords */}
            <div className="resumen-habitos-logros">
                {habits.map(h => (
                    <div key={h.id} className="habit-mini-logro">
                        <span className="habit-mini-name">{h.name}</span>
                        <div className="habit-mini-days">
                            <span className="days-num">{h.days}</span>
                            <span className="days-label">días</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid-medallas">
                {ACHIEVEMENTS.map((ach, idx) => {
                    const isUnlocked = currentMaxDays >= ach.days;
                    // Ver qué hábitos han desbloqueado este logro
                    const unlockedBy = habits.filter(h => h.days >= ach.days);

                    return (
                        <div key={idx} className={`medalla-card ${isUnlocked ? 'desbloqueada' : ''}`}>
                            <div className="img-medalla">
                                <span role="img" aria-label={ach.title}>{ach.icon}</span>
                                {isUnlocked && <CheckCircle2 className="unlocked-checkmark" size={16} />}
                            </div>

                            <h4 className="titulo-medalla">{ach.title}</h4>
                            <p className="desc-medalla">{ach.desc}</p>

                            {unlockedBy.length > 0 && (
                                <div className="unlocked-by-badges">
                                    {unlockedBy.map(h => (
                                        <span key={h.id} className="habit-dot" style={{ backgroundColor: h.color }} title={h.name} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Barra de progreso global */}
            <div className="progreso-proximo-logro">
                <div className="texto-progreso">
                    <span>Próximo: {nextAchievement.title}</span>
                    <span>{Math.floor(progressPercent)}%</span>
                </div>
                <div className="barra-fondo">
                    <div
                        className="barra-relleno"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="dias-faltantes">
                    {currentMaxDays} / {nextAchievement.days} días (Mejor racha)
                </p>
            </div>
        </div>
    );
};

export default Logros;
