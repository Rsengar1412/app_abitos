import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Autenticacion = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register, resetPassword } = useAuth();

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
                setMsg('¡Cuenta creada correctamente! Iniciando sesión...');
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else if (mode === 'recover') {
                await resetPassword(email);
                setMsg('Te hemos enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
            }
        } catch (err) {
            console.error("Error en autenticación:", err);
            if (err.code === 'auth/wrong-password') setError('La contraseña es incorrecta. Inténtalo de nuevo.');
            else if (err.code === 'auth/user-not-found') setError('No hay ninguna cuenta registrada con este correo.');
            else if (err.code === 'auth/email-already-in-use') setError('Este correo electrónico ya está en uso por otra cuenta.');
            else if (err.code === 'auth/weak-password') setError('La contraseña debe tener al menos 6 caracteres.');
            else setError('Hubo un error al conectar con el servidor. Revisa tu internet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px] mx-auto px-4 py-8 sm:px-3 sm:py-6">
            <h2 className="text-xl font-medium text-center mb-8 text-text-primary uppercase tracking-widest sm:text-lg sm:mb-6">
                {mode === 'login' && 'Bienvenido de nuevo'}
                {mode === 'register' && 'Únete a Libre'}
                {mode === 'recover' && 'Recuperar acceso'}
            </h2>

            {error && (
                <div className="bg-red-500/10 text-marketing-red py-2.5 px-3 rounded-sm text-sm text-center mb-4">
                    {error}
                </div>
            )}

            {msg && (
                <div className="mb-4 py-3 px-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-600 font-bold text-center text-sm">
                    {msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-text-secondary font-medium">Correo Electrónico</label>
                    <input
                        type="email"
                        required
                        className="w-full py-3 px-3 rounded-sm border border-white/10 bg-bg-primary text-text-primary text-base outline-none transition-colors focus:border-brand sm:py-2.5 sm:px-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                    />
                </div>

                {mode !== 'recover' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary font-medium">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full py-3 px-3 rounded-sm border border-white/10 bg-bg-primary text-text-primary text-base outline-none transition-colors focus:border-brand sm:py-2.5 sm:px-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-3 rounded-sm bg-brand text-white text-base font-semibold cursor-pointer transition-opacity mt-4 disabled:opacity-70 disabled:cursor-not-allowed sm:py-2.5 sm:px-3"
                >
                    {loading ? 'Procesando...' : (mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrarse' : 'Enviar Correo')}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-secondary">
                {mode === 'login' && (
                    <>
                        <p>¿No tienes cuenta aún?</p>
                        <button type="button" onClick={() => setMode('register')} className="bg-transparent border-0 text-brand font-bold underline cursor-pointer ml-1">
                            Crea una cuenta nueva
                        </button>
                        <br />
                        <button type="button" onClick={() => setMode('recover')} className="bg-transparent border-0 text-brand font-bold underline cursor-pointer text-[0.85rem] opacity-70 mt-5">
                            ¿Has olvidado tu contraseña?
                        </button>
                    </>
                )}
                {mode === 'register' && (
                    <>
                        <p>¿Ya eres parte de Libre?</p>
                        <button type="button" onClick={() => setMode('login')} className="bg-transparent border-0 text-brand font-bold underline cursor-pointer ml-1">
                            Inicia Sesión aquí
                        </button>
                    </>
                )}
                {mode === 'recover' && (
                    <button type="button" onClick={() => setMode('login')} className="bg-transparent border-0 text-brand font-bold underline cursor-pointer">
                        ← Volver al inicio de sesión
                    </button>
                )}
            </div>
        </div>
    );
};

export default Autenticacion;
