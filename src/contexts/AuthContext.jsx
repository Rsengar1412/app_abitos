import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail // IMPORTADO
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

/**
 * AuthContext: Contexto global de React para manejar la autenticación del usuario.
 */
const AuthContext = createContext();

/**
 * useAuth: Hook personalizado para obtener los datos de autenticación de forma sencilla.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

/**
 * AuthProvider: Proveedor que envuelve la aplicación y gestiona el estado de Firebase Auth.
 */
export const AuthProvider = ({ children }) => {
    // currentUser: Almacena el objeto del usuario de Firebase cuando está logueado.
    const [currentUser, setCurrentUser] = useState(null);
    // loading: Controla que no se renderice la app hasta que Firebase confirme si hay sesión activa.
    const [loading, setLoading] = useState(true);

    /**
     * register: Crea un nuevo usuario con email y contraseña.
     */
    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    /**
     * login: Inicia sesión con credenciales existentes.
     */
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    /**
     * logout: Cierra la sesión activa.
     */
    const logout = () => {
        return signOut(auth);
    };

    /**
     * resetPassword: Envía un correo de recuperación si el usuario olvida su contraseña.
     */
    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    /**
     * EFECTO: Suscripción al estado de autenticación de Firebase.
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // Una vez que Firebase responde, dejamos de cargar.
        });

        // Cleanup al desmontar.
        return unsubscribe;
    }, []);

    // Valores que estarán disponibles para toda la app.
    const value = {
        currentUser,
        register,
        login,
        logout,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Solo renderizamos los hijos cuando Firebase ha terminado de verificar la sesión. */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
