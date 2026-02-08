import React from 'react';
import { Brain, Check, Lock } from 'lucide-react';

const MILESTONES = [
    { days: 7, title: "El Despertar", benefits: ["Aumento ligero de energía", "Menos niebla mental por la mañana", "Dificultad alta: 'El efecto rebote'"], color: '#f1c40f' },
    { days: 14, title: "Claridad Mental", benefits: ["Mejor concentración en tareas", "La dopamina empieza a regularse", "Menos ansiedad social leve"], color: '#9b59b6' },
    { days: 30, title: "Reinicio Hormonal", benefits: ["Pico de testosterona estabilizado", "Piel más clara y ojos brillantes", "Mayor confianza nural"], color: '#e67e22' },
    { days: 90, title: "El Nuevo Tú (Reboot)", benefits: ["Recableado neuronal completo", "Atracción real por personas reales", "Disciplina de acero instalada"], color: '#2ecc71' }
];

const ProgresoRecuperacion = ({ maxDays = 0 }) => {
    const safeMaxDays = isNaN(maxDays) ? 0 : maxDays;
    const isUnlocked = (days) => safeMaxDays >= days;

    return (
        <div className="bg-bg-secondary rounded-md p-6 mb-8 border border-border-default">
            <h3 className="text-lg mb-8 text-text-primary flex items-center gap-2.5">
                <Brain size={24} className="text-brand" />
                Tu Camino de Recuperación
            </h3>

            <div className="relative flex flex-col gap-0 border-l-2 border-bg-primary pl-6 ml-2">
                {MILESTONES.map((milestone, idx) => {
                    const unlocked = isUnlocked(milestone.days);
                    return (
                        <div
                            key={idx}
                            className={`flex gap-4 relative pb-8 opacity-50 transition-opacity last:pb-0 ${unlocked ? 'opacity-100' : ''}`}
                        >
                            <div className={`absolute left-[-9px] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm border-2 transition-all bg-bg-primary border-text-secondary text-text-secondary ${unlocked ? 'bg-success border-success text-white' : ''}`}>
                                {unlocked ? <Check size={16} /> : <Lock size={14} />}
                            </div>
                            <div className="flex-1 pt-0.5">
                                <div className="text-sm font-semibold text-text-secondary mb-1 uppercase tracking-wide">Día {milestone.days}</div>
                                <h4 className="text-lg font-bold mb-2 text-text-primary" style={{ color: unlocked ? milestone.color : 'inherit' }}>
                                    {milestone.title}
                                </h4>
                                <ul className="text-sm text-text-secondary leading-relaxed m-0 list-disc ml-4">
                                    {milestone.benefits.map((benefit, i) => (
                                        <li key={i} className="mb-1">{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgresoRecuperacion;
