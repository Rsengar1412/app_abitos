import React, { useState } from 'react';
import { BookOpen, ChevronDown, Moon, Brain, Shield } from 'lucide-react';
import './Recursos.css';

// DATOS: Categorías y contenido de recursos
const RECURSOS_DATA = [
    {
        icon: <Moon size={20} />,
        title: "Antes de Dormir",
        content: (
            <>
                <p>La noche es el momento más vulnerable. Protege tu descanso:</p>
                <ul>
                    <li>Deja el teléfono fuera de la habitación.</li>
                    <li>Lee un libro físico 20 minutos.</li>
                    <li>Agradece 3 cosas del día.</li>
                </ul>
            </>
        )
    },
    {
        icon: <Brain size={20} />,
        title: "Entiende tu Cerebro",
        content: (
            <>
                <p>La adicción secuestra tu sistema de dopamina. No eres tú deseándolo realmente, es tu cerebro pidiendo su dosis barata.</p>
                <p>Cuando sientas urgencia, di: "Esto es solo una señal química falsa".</p>
            </>
        )
    },
    {
        icon: <Shield size={20} />,
        title: "Bloqueadores y Filtros",
        content: (
            <>
                <p>Hazlo difícil. Instala bloqueadores DNS (como OpenDNS FamilyShield) en tu router o apps en tu móvil.</p>
                <p>La fuerza de voluntad se agota, las barreras funcionan siempre.</p>
            </>
        )
    }
];

// Componente: Lista de Recursos
const Recursos = () => {
    // Estado para saber cuál está abierto (índice, null si ninguno)
    const [openIndex, setOpenIndex] = useState(null);

    // Alternar abrir/cerrar
    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="recursos-container">
            <h3 className="titulo-recursos">
                <BookOpen size={24} className="text-brand" />
                Caja de Herramientas
            </h3>

            <div className="grid-recursos">
                {RECURSOS_DATA.map((item, idx) => (
                    <div key={idx} className="tarjeta-recurso">
                        <div
                            className="header-recurso"
                            onClick={() => toggle(idx)}
                        >
                            <div className="info-recurso">
                                {item.icon}
                                <span className="titulo-recurso-item">{item.title}</span>
                            </div>
                            <ChevronDown
                                size={20}
                                className={`icono-chevron ${openIndex === idx ? 'abierto' : ''}`}
                            />
                        </div>

                        {openIndex === idx && (
                            <div className="contenido-recurso">
                                {item.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recursos;
