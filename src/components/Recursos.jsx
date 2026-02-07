import React, { useState } from 'react';
import { BookOpen, ChevronDown, Moon, Brain, Shield, Coffee, Smartphone, Flame, Wine, CupSoda, Gamepad2, Dices } from 'lucide-react';
import './Recursos.css';

/**
 * GENERAL_RESOURCES: Consejos universales que sirven para cualquier hábito.
 */
const GENERAL_RESOURCES = [
    {
        id: 'sleep',
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
        id: 'brain',
        icon: <Brain size={20} />,
        title: "Entiende tu Cerebro",
        content: (
            <>
                <p>La adicción secuestra tu sistema de dopamina. No eres tú deseándolo realmente, es tu cerebro pidiendo una dosis rápida.</p>
                <p>Cuando sientas urgencia, di: "Esto es solo una señal química falsa, yo tengo el control".</p>
            </>
        )
    }
];

/**
 * HABIT_SPECIFIC_RESOURCES: Consejos específicos según el tipo de hábito que el usuario esté tratando.
 */
const HABIT_SPECIFIC_RESOURCES = {
    porn: [
        {
            icon: <Shield size={20} />,
            title: "Bloqueadores y Filtros",
            content: (
                <>
                    <p>Hazlo difícil. Instala bloqueadores DNS o aplicaciones que filtren contenido adulto en tus dispositivos.</p>
                    <p>La fuerza de voluntad falla, pero las barreras físicas funcionan siempre.</p>
                </>
            )
        }
    ],
    smoking: [
        {
            icon: <Flame size={20} />,
            title: "Manejo de la Abstinencia",
            content: (
                <>
                    <p>El deseo de fumar dura entre 3 y 5 minutos. Si superas ese pico, la ansiedad bajará.</p>
                    <p>Bebe agua fría a sorbos pequeños o mastica algo saludable y crujiente.</p>
                </>
            )
        }
    ],
    socialmedia: [
        {
            icon: <Smartphone size={20} />,
            title: "Desintoxicación Digital",
            content: (
                <>
                    <p>Configura tu móvil en escala de grises. Esto lo hace mucho menos adictivo visualmente.</p>
                    <p>Desactiva todas las notificaciones que no sean de personas reales.</p>
                </>
            )
        }
    ],
    sugar: [
        {
            icon: <Coffee size={20} />,
            title: "El Ciclo de la Insulina",
            content: (
                <>
                    <p>El azúcar genera un pico seguido de un bajón que te pide más azúcar. Rompe el ciclo con proteínas o grasas saludables.</p>
                </>
            )
        }
    ],
    alcohol: [
        {
            icon: <Wine size={20} />,
            title: "Reemplazo Social",
            content: (
                <>
                    <p>En eventos sociales, pide agua con gas y limón o una bebida sin azúcar. Mantener algo en la mano reduce la presión social.</p>
                    <p>La sobriedad es el nuevo superpoder: recuerda todo y mantén el control.</p>
                </>
            )
        }
    ],
    caffeine: [
        {
            icon: <CupSoda size={20} />,
            title: "Higiene del Sueño",
            content: (
                <>
                    <p>La cafeína bloquea los receptores de adenosina que te indican que estás cansado. Sustitúyela por infusiones o agua fría al despertar.</p>
                </>
            )
        }
    ],
    gaming: [
        {
            icon: <Gamepad2 size={20} />,
            title: "Productividad Real",
            content: (
                <>
                    <p>Usa la técnica de gamificación en tu vida real: asigna puntos a tus tareas diarias y 'sube de nivel' con tus objetivos personales.</p>
                </>
            )
        }
    ],
    gambling: [
        {
            icon: <Dices size={20} />,
            title: "Control Financiero",
            content: (
                <>
                    <p>Elimina tus datos de pago de sitios de apuestas y limita tus transferencias diarias. El tiempo es tu activo más valioso.</p>
                </>
            )
        }
    ]
};

/**
 * Recursos: Componente de acordeón que muestra consejos útiles.
 * Filtra los consejos basándose en los hábitos que el usuario tiene activos.
 */
const Recursos = ({ habits = [] }) => {
    // openIndex: Controla cuál tarjeta del acordeón está expandida.
    const [openIndex, setOpenIndex] = useState(null);

    // Aseguramos que habits sea un array para evitar errores.
    const safeHabits = Array.isArray(habits) ? habits : [];

    /**
     * getActiveResources: Combina los generales con los específicos de los hábitos actuales.
     */
    const getActiveResources = () => {
        let active = [...GENERAL_RESOURCES];
        safeHabits.forEach(h => {
            if (HABIT_SPECIFIC_RESOURCES[h.id]) {
                active = [...active, ...HABIT_SPECIFIC_RESOURCES[h.id]];
            }
        });
        return active;
    };

    const resources = getActiveResources();

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="recursos-container">
            <h3 className="titulo-recursos">
                <BookOpen size={24} color="var(--brand-color)" />
                Caja de Herramientas
            </h3>

            <div className="grid-recursos">
                {resources.map((item, idx) => (
                    <div key={idx} className="tarjeta-recurso">
                        <div
                            className="header-recurso"
                            onClick={() => toggle(idx)}
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}
                        >
                            <div className="info-recurso" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.icon}
                                <span className="titulo-recurso-item" style={{ fontWeight: '600' }}>{item.title}</span>
                            </div>
                            <ChevronDown
                                size={20}
                                style={{ transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}
                            />
                        </div>

                        {openIndex === idx && (
                            <div className="contenido-recurso" style={{ padding: '0 1rem 1rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
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
