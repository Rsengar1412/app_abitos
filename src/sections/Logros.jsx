import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

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
    const lastAchDays = ACHIEVEMENTS.filter(a => a.days <= currentMaxDays).pop()?.days || 0;
    const progressPercent = Math.min(100, Math.max(0, ((currentMaxDays - lastAchDays) / (nextAchievement.days - lastAchDays)) * 100));

    return (
        <div className="p-6 mt-8 sm:p-4">
            <h3 className="text-lg mb-6 text-text-primary flex items-center gap-2.5">
                <Award size={24} className="text-brand" />
                Tu Sala de Trofeos
            </h3>

            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {habits.map(h => (
                    <div
                        key={h.id}
                        className="bg-bg-secondary py-2.5 px-4 rounded-md flex flex-col items-center min-w-[90px] border border-white/5 sm:min-w-[80px]"
                    >
                        <span className="text-[0.65rem] text-text-secondary uppercase tracking-wider mb-0.5">{h.name}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-brand">{h.days}</span>
                            <span className="text-[0.65rem] text-text-secondary">días</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 justify-items-center sm:gap-3">
                {ACHIEVEMENTS.map((ach, idx) => {
                    const isUnlocked = currentMaxDays >= ach.days;
                    const unlockedBy = habits.filter(h => h.days >= ach.days);
                    return (
                        <div
                            key={idx}
                            className={`w-full p-4 rounded-md text-center opacity-30 grayscale transition-all duration-400 border border-transparent ${isUnlocked ? 'opacity-100 grayscale-0 bg-gradient-to-br from-bg-secondary to-brand/10 border-brand/20' : 'bg-[#616763]'}`}
                        >
                            <div className="relative text-4xl mb-3 inline-block">
                                <span role="img" aria-label={ach.title}>{ach.icon}</span>
                                {isUnlocked && <CheckCircle2 className="absolute -bottom-0.5 -right-1 bg-success text-white rounded-full p-0.5 border-2 border-bg-secondary" size={16} />}
                            </div>
                            <h4 className="text-sm font-bold mb-1 text-text-primary">{ach.title}</h4>
                            <p className="text-xs text-text-secondary leading-tight">{ach.desc}</p>
                            {unlockedBy.length > 0 && (
                                <div className="flex justify-center gap-1 mt-2.5">
                                    {unlockedBy.map(h => (
                                        <span key={h.id} className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: h.color }} title={h.name} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="bg-bg-secondary p-5 rounded-lg">
                <div className="flex justify-between text-sm font-semibold mb-2.5">
                    <span>Próximo: {nextAchievement.title}</span>
                    <span>{Math.floor(progressPercent)}%</span>
                </div>
                <div className="w-full h-2 bg-bg-primary rounded overflow-hidden">
                    <div
                        className="h-full bg-brand rounded transition-[width] duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <p className="text-xs mt-2 text-right text-text-secondary opacity-80">
                    {currentMaxDays} / {nextAchievement.days} días (Mejor racha)
                </p>
            </div>
        </div>
    );
};

export default Logros;
