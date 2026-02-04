import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';
import './FraseDiaria.css';

// LISTA DE FRASES (366 sería ideal, aquí una muestra)
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

// Componente: Frase Motivacional del Día
const FraseDiaria = () => {
    // Calculamos qué frase mostrar hoy
    // Usamos useMemo para que no cambie cada vez que se renderiza, solo si cambia el día
    const quote = useMemo(() => {
        // Obtenemos el día del año (0-365)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // Usamos el día del año como índice (módulo longitud del array)
        // Esto asegura que cada día sea una frase diferente pero consistente para todos
        return FRASES[dayOfYear % FRASES.length];
    }, []);

    return (
        <div className="frase-container">
            <Quote size={24} className="icono-comillas" />
            <p className="texto-frase">
                "{quote}"
            </p>
            <div className="linea-decorativa"></div>
        </div>
    );
};

export default FraseDiaria;
