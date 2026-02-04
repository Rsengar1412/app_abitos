import React from 'react';
import { Brain, Check, Lock } from 'lucide-react';
// Importamos los estilos
import './ProgresoRecuperacion.css';

// DATOS: Definición de los hitos y sus beneficios científicos
const MILESTONES = [
    {
        days: 7,
        title: "El Despertar",
        benefits: [
            "Aumento ligero de energía",
            "Menos niebla mental por la mañana",
            "Dificultad alta: 'El efecto rebote'"
        ],
        color: '#f1c40f' // Amarillo
    },
    {
        days: 14,
        title: "Claridad Mental",
        benefits: [
            "Mejor concentración en tareas",
            "La dopamina empieza a regularse",
            "Menos ansiedad social leve"
        ],
        color: '#9b59b6' // Morado
    },
    {
        days: 30,
        title: "Reinicio Hormonal",
        benefits: [
            "Pico de testosterona estabilizado",
            "Piel más clara y ojos brillantes",
            "Mayor confianza nural"
        ],
        color: '#e67e22' // Naranja
    },
    {
        days: 90,
        title: "El Nuevo Tú (Reboot)",
        benefits: [
            "Recableado neuronal completo",
            "Atracción real por personas reales",
            "Disciplina de acero instalada"
        ],
        color: '#2ecc71' // Verde
    }
];

// Componente: Timeline de Recuperación
// Muestra tu progreso y qué beneficios has desbloqueado
const ProgresoRecuperacion = ({ maxDays }) => {

    // Función auxiliar para saber si un hito está cumplido
    const isUnlocked = (days) => maxDays >= days;

    return (
        <div className="timeline-container">
            <h3 className="titulo-timeline">
                <Brain size={24} className="text-brand" />
                Tu Camino de Recuperación
            </h3>

            <div className="lista-hitos">
                {MILESTONES.map((milestone, idx) => {
                    const unlocked = isUnlocked(milestone.days);

                    return (
                        <div
                            key={idx}
                            className={`hito-item ${unlocked ? 'desbloqueado' : ''}`}
                        >
                            {/* Icono del Hito (Candado o Check) */}
                            <div className="hito-icono">
                                {unlocked ? <Check size={16} /> : <Lock size={14} />}
                            </div>

                            {/* Contenido del Hito */}
                            <div className="hito-contenido">
                                <div className="hito-dias">Día {milestone.days}</div>
                                <h4 className="hito-titulo" style={{ color: unlocked ? milestone.color : 'inherit' }}>
                                    {milestone.title}
                                </h4>
                                <ul className="hito-beneficios">
                                    {milestone.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
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
