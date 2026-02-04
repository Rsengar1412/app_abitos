import React, { useState } from 'react';
import {
    X, Heart, ShieldAlert, Droplets, Dumbbell, Phone,
    Footprints, Music, BookOpen, PenTool, Wind, Zap, Coffee, CheckSquare, Gamepad2
} from 'lucide-react';
// Importamos los estilos
import './BotonSOS.css';

// CONSEJOS: Lista de frases MANUALMENTE insertada por el usuario (INTACTA)
const CONSEJOS = [
    // ===== RESPIRACIÓN / URGENCIA =====
    "La urgencia es una ola: sube, rompe y baja. Aguanta 90 segundos.",
    "Respira 5 veces lento: inhala 4, exhala 6.",
    "Respira 10 veces. Sin móvil. Solo tú.",
    "Inhala 4s, mantén 4s, exhala 8s. Repite 5 veces.",
    "Pon una mano en el pecho y otra en el abdomen. Respira lento 1 minuto.",
    "Solo aguanta 1 minuto. Luego decides.",
    "No hagas nada durante 2 minutos. Solo siente el impulso.",
    "Esto es un impulso, no una necesidad real.",
    "No estás en peligro. Solo estás incómodo. Y puedes soportarlo.",
    "Cuenta respiraciones hasta 30.",
    "Cuenta hacia atrás del 50 al 1 sin saltarte ningún número.",
    "Mira un punto fijo 30 segundos. Vuelve al presente.",
    "Haz el método 5-4-3-2-1 (sentidos) ahora.",
    "Dite: 'Puedo sentir esto sin actuar'.",
    "Tu cerebro quiere dopamina rápida. Tú quieres una vida mejor.",
    "No negocies con el impulso. Respira y muévete.",
    "Este impulso pasará aunque no hagas nada.",
    "No es una orden. Es una sugerencia del cerebro.",
    "La mente grita, pero tú mandas.",
    "El deseo dura poco. El orgullo dura todo el día.",

    // ===== CAMBIO DE ENTORNO =====
    "Levántate YA y cambia de habitación.",
    "Sal al salón. No te quedes solo.",
    "Abre la ventana y respira aire frío 20 segundos.",
    "Ve a la cocina y bebe agua.",
    "Deja el móvil en otra habitación.",
    "Modo avión 15 minutos. Ahora.",
    "Cierra el portátil y aléjate 5 minutos.",
    "Ponte zapatos. Sí, solo eso. Cambia el estado mental.",
    "Si estás en la cama: levántate. La cama es para dormir.",
    "Si estás en el baño: sal ya. Sin móvil.",
    "Apaga las luces de tu habitación y sal.",
    "Ponte en un lugar donde haya gente (salón, terraza, calle).",
    "Sal a caminar 10 minutos sin música.",
    "Da una vuelta a la manzana. Rápido.",
    "Ve a un sitio público 15 minutos.",
    "Si estás solo en casa: sal a la calle 5 minutos.",
    "Cambia tu postura: espalda recta, hombros atrás.",
    "Cambia el escenario: mueve la silla a otro sitio.",
    "Ventila la habitación. Oxígeno = claridad.",
    "Pon la cama impecable. Cortas el patrón mental.",

    // ===== ACCIONES FÍSICAS RÁPIDAS =====
    "Haz 20 flexiones AHORA.",
    "Haz 30 sentadillas sin parar.",
    "Haz plancha 60 segundos.",
    "Haz 10 burpees. Sin pensar.",
    "Corre en el sitio 1 minuto.",
    "Saltos de tijera 60 segundos.",
    "Haz 50 abdominales (aunque sean en 2 tandas).",
    "Haz 100 pasos rápidos por casa.",
    "Estira cuello y espalda 2 minutos.",
    "Haz 10 flexiones + 10 sentadillas + 10 abdominales.",
    "Sube y baja escaleras 2 minutos.",
    "Haz 1 minuto de shadow boxing.",
    "Aguanta pared (wall sit) 45 segundos.",
    "Flexiones lentas: 10 repeticiones controladas.",
    "Camina mientras respiras profundo.",
    "Haz un sprint de 20 segundos (si puedes).",
    "Haz movilidad de cadera y hombros 3 minutos.",
    "Ducha fría 2 minutos. Ya.",
    "Agua fría en la cara 30 segundos.",
    "Aprieta puños 10 segundos, suelta. Repite 5 veces.",

    // ===== DISTRACTORES SANOS / MINI TAREAS =====
    "Ordena tu escritorio 5 minutos.",
    "Haz la cama. Perfecta.",
    "Lava 5 platos.",
    "Barre 5 minutos.",
    "Dobla ropa 5 minutos.",
    "Saca la basura.",
    "Limpia el baño 3 minutos.",
    "Organiza una carpeta del PC 5 minutos.",
    "Elimina 20 fotos o archivos basura.",
    "Responde 3 mensajes pendientes.",
    "Prepara una merienda sana.",
    "Haz un té o café y bébelo lento.",
    "Pon música y limpia 10 minutos.",
    "Pon un temporizador de 7 minutos y haz algo útil.",
    "Lee 5 páginas de tu libro.",
    "Lee 1 artículo educativo.",
    "Mira un vídeo de aprendizaje (no reels).",
    "Haz 10 minutos de estudio.",
    "Haz una lista de tareas para mañana.",
    "Escribe 5 cosas por las que estás agradecido.",

    // ===== FRASES CORTAS / “GOLPE” =====
    "No hoy.",
    "Ni una vez.",
    "Tú controlas.",
    "Eres más fuerte.",
    "El impulso miente.",
    "Corta ya.",
    "Ahora no.",
    "Respeta tu palabra.",
    "No te traiciones.",
    "Hazlo por ti.",
    "Hazlo por tu futuro.",
    "No vuelvas atrás.",
    "Sigue limpio.",
    "No te rindas.",
    "Eres capaz.",
    "Hoy ganas tú.",
    "Esto también pasará.",
    "Sé el hombre que prometiste ser.",
    "No eres esclavo.",
    "Disciplina > dopamina.",

    // ===== REFLEXIÓN / MENTALIDAD =====
    "Recuerda por qué empezaste.",
    "Recuerda lo que te quitó el porno.",
    "Recuerda tu energía cuando llevas días limpio.",
    "El placer rápido te roba el día entero.",
    "No cambies tu vida por 5 minutos.",
    "No tires tu progreso por un impulso.",
    "Cada NO te hace más fuerte.",
    "Hoy estás construyendo carácter.",
    "Hoy estás construyendo autoestima.",
    "La libertad se entrena.",
    "La mente busca fácil. Tú buscas mejor.",
    "El arrepentimiento dura más que el impulso.",
    "Esto es entrenamiento mental.",
    "La incomodidad es señal de crecimiento.",
    "No eres tu pensamiento. Eres tu decisión.",
    "Tu valor no depende de un impulso.",
    "Un día más limpio = un día más libre.",
    "No es amor propio si te destruyes.",
    "Si te respetas, actúas distinto.",
    "Tu futuro yo te está mirando.",

    // ===== TRIGGERS / PREVENCIÓN =====
    "Evita estar solo con el móvil.",
    "No te quedes en la cama con el teléfono.",
    "No uses redes sociales cuando estés débil.",
    "Elimina cuentas que te disparan el impulso.",
    "Deja de scrollear. Es una trampa.",
    "Si aparece un trigger: sal inmediatamente.",
    "No busques 'solo mirar'. Es mentira.",
    "Corta el estímulo antes de que crezca.",
    "Bloquea páginas. No dependas de fuerza de voluntad.",
    "Recuerda: el primer clic es la recaída.",
    "No te expongas a contenido sugerente.",
    "Evita TikTok/IG cuando estés aburrido.",
    "Evita el móvil después de las 23:00.",
    "Pon el móvil a cargar fuera del dormitorio.",
    "No te quedes solo en el baño con el móvil.",
    "Si estás cansado: duerme.",
    "Si estás estresado: camina.",
    "Si estás triste: habla con alguien.",
    "Si estás aburrido: crea algo.",
    "Si estás ansioso: respira y muévete.",

    // ===== CONEXIÓN SOCIAL =====
    "Llama a un amigo o familiar.",
    "Manda un audio a alguien: '¿Qué tal estás?'",
    "Sal a dar una vuelta con alguien.",
    "Ve a un sitio donde haya gente.",
    "Habla con alguien 5 minutos.",
    "Pide ayuda. No estás solo.",
    "Comparte tu avance con alguien de confianza.",
    "Escribe a alguien: 'Estoy teniendo un mal momento, ¿hablamos?'",
    "Haz una videollamada rápida.",
    "Conecta con personas reales, no con fantasías.",

    // ===== RETOS / GAMIFICACIÓN =====
    "Reto: aguanta 10 minutos. Solo 10.",
    "Reto: 25 flexiones en total hoy.",
    "Reto: 1 hora sin móvil.",
    "Reto: 30 minutos de limpieza.",
    "Reto: 15 minutos de lectura.",
    "Reto: 10 minutos de estudio.",
    "Reto: 20 minutos caminando.",
    "Reto: escribe 1 página de diario.",
    "Reto: haz 1 tarea pendiente importante.",
    "Reto: termina algo que empezaste.",
    "Reto: agua + ducha fría.",
    "Reto: cero pantallas 30 minutos.",
    "Reto: 5 minutos de meditación.",
    "Reto: 3 minutos de respiración.",
    "Reto: 10 minutos de estiramientos.",
    "Reto: organiza tu cuarto.",
    "Reto: prepara comida saludable.",
    "Reto: elimina 50 archivos basura.",
    "Reto: escribe tu objetivo en una nota.",
    "Reto: visualiza tu mejor versión 2 minutos.",

    // ===== RECORDATORIOS “DUROS” =====
    "Si recaes, mañana te sentirás vacío.",
    "No es placer, es un anzuelo.",
    "Te prometieron placer y te dieron ansiedad.",
    "No alimentes el monstruo.",
    "Cada recaída fortalece el hábito. Cada NO lo debilita.",
    "Esto no te da nada. Te lo quita todo.",
    "El porno te roba motivación.",
    "El porno te roba enfoque.",
    "El porno te roba confianza.",
    "El porno te roba tiempo.",
    "El porno te roba energía.",
    "No vuelvas a la jaula.",
    "No vuelvas al mismo agujero.",
    "Tu mente quiere excusas. Tú quieres resultados.",
    "No eres ese tipo de persona.",
    "Sé coherente.",
    "Sé fuerte aunque nadie te vea.",
    "La verdadera victoria es cuando estás solo.",
    "Que tu palabra valga.",
    "No te falles otra vez.",

    // ===== AUTOESTIMA / IDENTIDAD =====
    "Eres una persona disciplinada.",
    "Eres alguien que se respeta.",
    "Eres alguien que cumple lo que dice.",
    "Eres alguien que controla su mente.",
    "Eres alguien que mejora cada día.",
    "Tu identidad es más fuerte que el impulso.",
    "Tu autoestima se construye con decisiones.",
    "El control se entrena.",
    "La libertad se entrena.",
    "Hoy estás reprogramando tu cerebro.",
    "Tu mente se cura con tiempo y constancia.",
    "Tu dopamina se normaliza con hábitos reales.",
    "Lo difícil hoy es lo fácil mañana.",
    "El progreso es silencioso.",
    "No busques dopamina barata.",
    "Busca orgullo real.",
    "Busca paz real.",
    "Busca amor propio real.",
    "Busca vida real.",
    "Busca conexión real.",

    // ===== ENFOQUE EN METAS =====
    "Tu meta vale más que este momento.",
    "¿Qué quieres más: 5 minutos o una vida?",
    "Piensa en tus objetivos.",
    "Piensa en tu salud mental.",
    "Piensa en tu futuro trabajo/proyecto.",
    "Piensa en tu relación contigo mismo.",
    "Piensa en tu energía mañana.",
    "Piensa en tu claridad mental.",
    "Piensa en tu disciplina.",
    "Piensa en tu autoestima.",
    "No cambies lo grande por lo pequeño.",
    "No cambies tu futuro por tu impulso.",
    "Tu proyecto necesita tu enfoque.",
    "Tu mejor versión necesita tu disciplina.",
    "Tu vida real está fuera de la pantalla.",
    "Haz algo que te acerque a tu meta 5 minutos.",
    "Da un paso real hoy.",
    "Haz lo correcto aunque cueste.",
    "Tu vida mejora cuando tú mejoras.",
    "Sigue construyendo.",

    // ===== PLAN DE EMERGENCIA =====
    "PLAN: 1) levántate 2) agua 3) flexiones 4) sal fuera 5) respira.",
    "Corta internet 15 minutos.",
    "Bloquea el móvil en un cajón.",
    "Pon un temporizador de 15 minutos y sal de casa.",
    "Haz una llamada inmediata.",
    "Ducha fría + ropa limpia.",
    "Come algo sano si tienes hambre.",
    "Si es de noche: duerme.",
    "Si estás ansioso: camina.",
    "Si estás tenso: estira.",
    "Si estás triste: habla.",
    "Si estás aburrido: crea.",
    "Si estás solo: sal.",
    "Si estás cansado: descansa.",
    "Si estás frustrado: entrena.",
    "Si estás enfadado: respira.",
    "Si estás estresado: ordena.",
    "Si estás tentado: aléjate del estímulo.",
    "No lo pienses. Haz el plan.",
    "Haz lo siguiente correcto.",

    // ===== EXTRA VARIADOS =====
    "Toma 1 minuto y escribe: ¿qué estoy evitando sentir?",
    "¿Qué emoción hay debajo de este impulso?",
    "El porno es un parche, no una solución.",
    "No te anestesies. Afronta la vida.",
    "El impulso es temporal. Tu vida es real.",
    "Tu cuerpo quiere calma, no porno.",
    "Haz 1 cosa productiva. Solo 1.",
    "Elige dignidad.",
    "Elige paz.",
    "Elige control.",
    "Elige libertad.",
    "Eres más grande que esto.",
    "Vuelve a tu centro.",
    "Mira tus manos: tú decides qué haces con ellas.",
    "Haz una promesa: hoy no.",
    "Una decisión puede cambiar tu día.",
    "Hazlo aunque no tengas ganas.",
    "No esperes motivación. Actúa.",
    "La motivación viene después.",
    "Sigue adelante."
];

// CONSEJOS ESPECÍFICOS POR HÁBITO
const CONSEJOS_HABITOS = {
    porn: [
        "El porno es una fantasía pixelada, tú mereces una vida real.",
        "Tu cerebro se está curando, no interrumpas el proceso de reinicio neuronal.",
        "Recuerda la niebla mental que viene después. No vale la pena perder tu claridad.",
        "La dopamina artificial te roba la motivación para metas reales.",
        "Mira tus manos: tú decides qué haces con ellas en este momento."
    ],
    smoking: [
        "Tus pulmones se están limpiando ahora mismo. No des un paso atrás.",
        "Bebe un vaso de agua fría. El antojo de nicotina dura solo de 3 a 5 minutos.",
        "Toma 3 respiraciones profundas. Siente el aire entrar sin obstáculos.",
        "Fumar no quita el estrés, solo alivia la abstinencia que el mismo cigarro creó.",
        "Retrasa el primer cigarro. Solo 10 minutos más. Puedes hacerlo."
    ],
    socialmedia: [
        "Deja el móvil en otra habitación. Prueba 15 minutos de silencio real.",
        "El scroll infinito es una trampa de dopamina barata diseñada para atraparte.",
        "Mira a tu alrededor. El mundo real tiene más colores que tu pantalla.",
        "No te compares con la vida editada de los demás. Concéntrate en la tuya.",
        "Haz algo físico: toca madera, camina descalzo, siente el presente."
    ],
    sugar: [
        "Come una pieza de fruta o bebe agua. A veces el hambre de dulce es solo sed.",
        "El bajón de energía después del pico de azúcar será peor que este antojo.",
        "El azúcar es combustible, no un premio emocional.",
        "Tu cuerpo prefiere nutrientes reales. Dale lo que necesita, no lo que pide el impulso.",
        "Lávate los dientes ahora. El sabor a menta quita las ganas de dulce."
    ]
};

// LISTA GIGANTE DE ACCIONES CON ICONOS
// Para que siempre haya 3 opciones nuevas y visuales
/**
 * POOL_ACCIONES: Lista de todas las acciones positivas que el sistema puede sugerir.
 */
const POOL_ACCIONES = [
    // Físico Intenso
    { icon: <Dumbbell size={32} />, title: "20 Flexiones", desc: "Al fallo. Quema esa energía.", color: "#e67e22" },
    { icon: <Zap size={32} />, title: "Sprints", desc: "Corre en el sitio 1 min a tope.", color: "#f1c40f" },
    { icon: <Droplets size={32} />, title: "Agua Fría", desc: "Mójate la cara o dúchate.", color: "#3498db" },
    { icon: <Wind size={32} />, title: "Respiración Vim Hof", desc: "30 inhalaciones profundas.", color: "#1abc9c" },

    // Cambio Entorno / Mental
    { icon: <Footprints size={32} />, title: "Sal a Caminar", desc: "Sin rumbo. 10 minutos.", color: "#2ecc71" },
    { icon: <Phone size={32} />, title: "Llama a un Amigo", desc: "Habla con alguien real.", color: "#9b59b6" },
    { icon: <Music size={32} />, title: "Música Épica", desc: "Ponte tu canción favorita.", color: "#e74c3c" },
    { icon: <BookOpen size={32} />, title: "Lee 2 Páginas", desc: "Cualquier libro físico.", color: "#bdc3c7" },
    { icon: <PenTool size={32} />, title: "Diario", desc: "Escribe cómo te sientes.", color: "#8e44ad" },
    { icon: <Coffee size={32} />, title: "Infusión/Agua", desc: "Prepárate algo caliente.", color: "#d35400" },

    // Limpieza / Orden (Productividad)
    { icon: <CheckSquare size={32} />, title: "Ordena tu Cuarto", desc: "Haz la cama o limpia la mesa.", color: "#2c3e50" },
    { icon: <ShieldAlert size={32} />, title: "Modo Avión", desc: "Desconecta 15 minutos.", color: "#c0392b" },
    { icon: <Gamepad2 size={32} />, title: "Juega a algo", desc: "Tetris o Ajedrez rápido.", color: "#95a5a6" }
];

/**
 * BotonSOS: Componente de emergencia que se activa cuando el usuario siente urgencia de recaer.
 * Ofrece frases motivacionales y 3 acciones aleatorias para distraer la mente.
 */
const BotonSOS = ({ habits = [] }) => {
    // Aseguramos que habits sea un array para evitar errores de renderizado.
    const safeHabits = Array.isArray(habits) ? habits : [];

    // ESTADOS
    const [isActive, setIsActive] = useState(false); // Si la pantalla de emergencia está visible.
    const [currentTip, setCurrentTip] = useState(""); // La frase motivacional actual.
    const [showActions, setShowActions] = useState(false); // Si estamos viendo la lista de 3 acciones.
    const [randomActions, setRandomActions] = useState([]); // Las 3 acciones seleccionadas al azar.

    /**
     * getRelevantTips: Filtra todos los consejos disponibles según los hábitos del usuario.
     */
    const getRelevantTips = () => {
        let pool = [...CONSEJOS]; // Empezamos con los consejos universales.

        safeHabits.forEach(h => {
            if (CONSEJOS_HABITOS[h.id]) {
                pool = [...pool, ...CONSEJOS_HABITOS[h.id]];
            }
        });

        return pool;
    };

    /**
     * pickRandomActions: Selecciona 3 ideas de distracción al azar.
     */
    const pickRandomActions = () => {
        const pool = [...POOL_ACCIONES];
        const shuffled = pool.sort(() => 0.5 - Math.random());
        setRandomActions(shuffled.slice(0, 3));
    };

    /**
     * activateSOS: Activa la pantalla de emergencia y carga el contenido inicial.
     */
    const activateSOS = () => {
        setIsActive(true);
        const tips = getRelevantTips();
        setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
        pickRandomActions();
        setShowActions(false);
    };

    /**
     * deactivateSOS: Cierra la pantalla de emergencia.
     */
    const deactivateSOS = () => {
        setIsActive(false);
        setShowActions(false);
    };

    if (isActive) {
        return (
            <div className="pantalla-emergencia">
                <button onClick={deactivateSOS} className="btn-cerrar">
                    <X size={28} />
                </button>

                {!showActions ? (
                    <>
                        <div className="circulo-respiracion">
                            <Heart size={64} fill="rgba(255,255,255,0.8)" stroke="none" />
                        </div>

                        <h2 className="titulo-respira">Respira</h2>
                        <p className="texto-consejo">"{currentTip}"</p>

                        <button
                            onClick={() => {
                                const tips = getRelevantTips();
                                setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
                            }}
                            className="btn-texto"
                        >
                            Otro consejo
                        </button>

                        <button
                            onClick={() => setShowActions(true)}
                            className="btn-ver-acciones"
                        >
                            Acciones de Emergencia →
                        </button>
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 300 }}>
                            Haz una de estas 3:
                        </h2>

                        <div className="grid-acciones">
                            {randomActions.map((action, idx) => (
                                <div
                                    key={idx}
                                    className="tarjeta-accion"
                                    style={{ borderColor: action.color }}
                                >
                                    <div className="icono-accion" style={{ color: action.color }}>
                                        {action.icon}
                                    </div>
                                    <h3 className="titulo-accion">{action.title}</h3>
                                    <p className="desc-accion">{action.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => setShowActions(false)}
                                className="btn-texto"
                                style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '50px', textDecoration: 'none' }}
                            >
                                ← Respirar
                            </button>

                            <button
                                onClick={pickRandomActions}
                                className="btn-texto"
                                style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '8px 16px', borderRadius: '50px', textDecoration: 'none', background: 'rgba(255,255,255,0.1)' }}
                            >
                                ↻ Otras ideas
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <button onClick={activateSOS} className="boton-sos-principal">
            <ShieldAlert size={24} />
            SOS / Emergencia
        </button>
    );
};

export default BotonSOS;
