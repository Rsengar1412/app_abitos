import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Autenticacion.css';

// Componente: Autenticación (Login / Registro / Recuperar)
/**
 * Autenticacion: Componente que gestiona el acceso de los usuarios.
 * Incluye tres modos: Login (Inicio), Register (Registro) y Recover (Recuperación).
 */
const Autenticacion = () => {
    // mode: Controla qué formulario se muestra al usuario.
    const [mode, setMode] = useState('login');

    // email / password: Estados locales para los campos del formulario.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // error / msg: Canales para comunicar fallos o éxitos al usuario.
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    // loading: Bloquea el botón de envío mientras se comunica con Firebase.
    const [loading, setLoading] = useState(false);

    // Obtenemos las funciones de autenticación del contexto global.
    const { login, register, resetPassword } = useAuth();

    /**
     * handleSubmit: Procesa el envío del formulario basándose en el modo activo (login/registro/recuperación).
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        try {
            if (mode === 'login') {
                // Intento de inicio de sesión estándar.
                await login(email, password);
            } else if (mode === 'register') {
                // Creación de cuenta nueva.
                await register(email, password);
                setMsg('¡Cuenta creada correctamente! Iniciando sesión...');
                // Retrasamos la entrada para que el usuario pueda leer el mensaje de éxito.
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (mode === 'recover') {
                // Envío de correo electrónico para cambio de contraseña.
                await resetPassword(email);
                setMsg('Te hemos enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
            }
        } catch (err) {
            console.error("Error en autenticación:", err);
            // Mapeo de errores de Firebase a mensajes legibles para el usuario.
            if (err.code === 'auth/wrong-password') {
                setError('La contraseña es incorrecta. Inténtalo de nuevo.');
            } else if (err.code === 'auth/user-not-found') {
                setError('No hay ninguna cuenta registrada con este correo.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Este correo electrónico ya está en uso por otra cuenta.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setError('Hubo un error al conectar con el servidor. Revisa tu internet.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="titulo-auth">
                {mode === 'login' && 'Bienvenido de nuevo'}
                {mode === 'register' && 'Únete a Libre'}
                {mode === 'recover' && 'Recuperar acceso'}
            </h2>

            {/* Visualización de errores si existen */}
            {error && <div className="error-auth">{error}</div>}

            {/* Visualización de mensajes de éxito */}
            {msg && (
                <div className="success-auth" style={{
                    color: '#22c55e',
                    marginBottom: '1rem',
                    padding: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-auth">
                <div className="grupo-input">
                    <label className="label-auth">Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        className="input-auth"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                    />
                </div>

                {/* La contraseña solo se pide en login y registro */}
                {mode !== 'recover' && (
                    <div className="grupo-input">
                        <label className="label-auth">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="input-auth"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-submit-auth"
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : (
                        mode === 'login' ? 'Entrar' :
                            mode === 'register' ? 'Registrarse' : 'Enviar Correo'
                    )}
                </button>
            </form>

            <div className="texto-cambiar-modo">
                {mode === 'login' && (
                    <>
                        <p>¿No tienes cuenta aún?</p>
                        <button onClick={() => setMode('register')} className="btn-link">
                            Crea una cuenta nueva
                        </button>
                        <br />
                        <button onClick={() => setMode('recover')} className="btn-link" style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '20px' }}>
                            ¿Has olvidado tu contraseña?
                        </button>
                    </>
                )}

                {mode === 'register' && (
                    <>
                        <p>¿Ya eres parte de Libre?</p>
                        <button onClick={() => setMode('login')} className="btn-link">
                            Inicia Sesión aquí
                        </button>
                    </>
                )}

                {mode === 'recover' && (
                    <button onClick={() => setMode('login')} className="btn-link">
                        ← Volver al inicio de sesión
                    </button>
                )}
            </div>
        </div>
    );
};

export default Autenticacion;
