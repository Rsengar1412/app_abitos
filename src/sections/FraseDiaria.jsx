import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';

const FRASES = [
    "No cambies lo que más quieres por lo que quieres ahora.",
    "El dolor de la disciplina es temporal. El orgullo es para siempre.",
    "Tu futuro se crea con lo que haces hoy, no mañana.",
    "La recaída no es el fin, es parte del aprendizaje.",
    "Eres más fuerte que tus impulsos.",
    "La libertad real es dominarte a ti mismo.",
    "No cuentes los días, haz que los días cuenten.",
    "Un día a la vez.",
    "La gratitud convierte lo que tenemos en suficiente.",
    "Si te cansas, aprende a descansar, no a renunciar."
];

const FraseDiaria = () => {
    const quote = useMemo(() => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return FRASES[dayOfYear % FRASES.length];
    }, []);

    return (
        <div className="relative bg-bg-secondary rounded-lg p-6 mb-8 text-center border border-border-default bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_70%)]">
            <Quote size={24} className="text-brand opacity-30 mb-4 mx-auto block" />
            <p className="font-light text-text-primary">"{quote}"</p>
            <div className="w-10 h-0.5 bg-brand opacity-50 mx-auto mt-4" />
        </div>
    );
};

export default FraseDiaria;
