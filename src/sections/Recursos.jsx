import React, { useState } from 'react';
import { BookOpen, ChevronDown, Moon, Brain, Shield, Coffee, Smartphone, Flame, Wine, CupSoda, Gamepad2, Dices } from 'lucide-react';

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

const HABIT_SPECIFIC_RESOURCES = {
    porn: [{ icon: <Shield size={20} />, title: "Bloqueadores y Filtros", content: <><p>Hazlo difícil. Instala bloqueadores DNS o aplicaciones que filtren contenido adulto en tus dispositivos.</p><p>La fuerza de voluntad falla, pero las barreras físicas funcionan siempre.</p></> }],
    smoking: [{ icon: <Flame size={20} />, title: "Manejo de la Abstinencia", content: <><p>El deseo de fumar dura entre 3 y 5 minutos. Si superas ese pico, la ansiedad bajará.</p><p>Bebe agua fría a sorbos pequeños o mastica algo saludable y crujiente.</p></> }],
    socialmedia: [{ icon: <Smartphone size={20} />, title: "Desintoxicación Digital", content: <><p>Configura tu móvil en escala de grises. Esto lo hace mucho menos adictivo visualmente.</p><p>Desactiva todas las notificaciones que no sean de personas reales.</p></> }],
    sugar: [{ icon: <Coffee size={20} />, title: "El Ciclo de la Insulina", content: <><p>El azúcar genera un pico seguido de un bajón que te pide más azúcar. Rompe el ciclo con proteínas o grasas saludables.</p></> }],
    alcohol: [{ icon: <Wine size={20} />, title: "Reemplazo Social", content: <><p>En eventos sociales, pide agua con gas y limón o una bebida sin azúcar. Mantener algo en la mano reduce la presión social.</p><p>La sobriedad es el nuevo superpoder: recuerda todo y mantén el control.</p></> }],
    caffeine: [{ icon: <CupSoda size={20} />, title: "Higiene del Sueño", content: <><p>La cafeína bloquea los receptores de adenosina que te indican que estás cansado. Sustitúyela por infusiones o agua fría al despertar.</p></> }],
    gaming: [{ icon: <Gamepad2 size={20} />, title: "Productividad Real", content: <><p>Usa la técnica de gamificación en tu vida real: asigna puntos a tus tareas diarias y 'sube de nivel' con tus objetivos personales.</p></> }],
    gambling: [{ icon: <Dices size={20} />, title: "Control Financiero", content: <><p>Elimina tus datos de pago de sitios de apuestas y limita tus transferencias diarias. El tiempo es tu activo más valioso.</p></> }]
};

const Recursos = ({ habits = [] }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const safeHabits = Array.isArray(habits) ? habits : [];

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
    const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

    return (
        <div className="bg-bg-secondary w-full rounded-md p-6 mb-8 border border-border-default">
            <h3 className="text-lg mb-6 text-text-primary flex items-center justify-center gap-2.5 w-full">
                <BookOpen size={24} className="text-brand" />
                Caja de Herramientas
            </h3>

            <div className="grid gap-4">
                {resources.map((item, idx) => (
                    <div key={idx} className="bg-bg-primary/50 rounded-md overflow-hidden transition-all duration-300">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer select-none hover:bg-white/5"
                            onClick={() => toggle(idx)}
                        >
                            <div className="flex items-center gap-3 text-text-primary">
                                {item.icon}
                                <span className="font-semibold">{item.title}</span>
                            </div>
                            <ChevronDown
                                size={20}
                                className="text-text-secondary transition-transform duration-300"
                                style={{ transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0)' }}
                            />
                        </div>
                        {openIndex === idx && (
                            <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-4 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-3 [&>li]:mb-1">
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
