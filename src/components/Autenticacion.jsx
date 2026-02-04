import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Autenticacion.css';

// Componente: Autenticación (Login / Registro / Recuperar)
const Autenticacion = () => {
    // ESTADOS
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'recover'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState(''); // Mensaje de éxito (para recuperación o registro)
    const [loading, setLoading] = useState(false);

    // Funciones del Contexto
    const { login, register, resetPassword } = useAuth();

    // LÓGICA: Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
            } else if (mode === 'register') {
                await register(email, password);
                // ÉXITO AL REGISTRAR
                setMsg('¡Cuenta creada correctamente! Iniciando sesión...');
                // Pequeña pausa para que el usuario lea antes de entrar
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (mode === 'recover') {
                await resetPassword(email);
                setMsg('Te hemos enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/wrong-password') {
                setError('Contraseña incorrecta');
            } else if (err.code === 'auth/user-not-found') {
                setError('No existe cuenta con este email');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres');
            } else {
                setError('Error al conectar. Verifica tus datos.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="titulo-auth">
                {mode === 'login' && 'Iniciar Sesión'}
                {mode === 'register' && 'Crear Cuenta'}
                {mode === 'recover' && 'Recuperar Contraseña'}
            </h2>

            {/* Mensaje de error */}
            {error && <div className="error-auth">{error}</div>}

            {/* Mensaje de ÉXITO (Verde) */}
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
                    <label className="label-auth">Email</label>
                    <input
                        type="email"
                        required
                        className="input-auth"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                    />
                </div>

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
                    {loading ? 'Cargando...' : (
                        mode === 'login' ? 'Entrar' :
                            mode === 'register' ? 'Registrarse' : 'Enviar Correo'
                    )}
                </button>
            </form>

            <div className="texto-cambiar-modo">
                {mode === 'login' && (
                    <>
                        <button onClick={() => setMode('register')} className="btn-link">
                            Crear cuenta nueva
                        </button>
                        <br />
                        <button onClick={() => setMode('recover')} className="btn-link" style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '10px' }}>
                            ¿Olvidaste tu contraseña?
                        </button>
                    </>
                )}

                {mode === 'register' && (
                    <>
                        ¿Ya tienes cuenta?
                        <button onClick={() => setMode('login')} className="btn-link">
                            Inicia Sesión
                        </button>
                    </>
                )}

                {mode === 'recover' && (
                    <button onClick={() => setMode('login')} className="btn-link">
                        ← Volver a Iniciar Sesión
                    </button>
                )}
            </div>
        </div>
    );
};

export default Autenticacion;
