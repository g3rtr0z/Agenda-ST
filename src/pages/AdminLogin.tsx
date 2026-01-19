import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '../firebase';
import { HiLockClosed, HiEnvelope, HiKey, HiArrowLeft, HiExclamationCircle } from 'react-icons/hi2';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Correo o contraseña incorrectos');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Demasiados intentos. Inténtalo más tarde.');
            } else {
                setError('Error al iniciar sesión. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-st-green relative items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
                        <span className="text-white font-bold text-4xl">ST</span>
                    </div>
                    <h1 className="text-white text-3xl font-bold mb-4">Santo Tomás</h1>
                    <p className="text-white/60 text-lg max-w-sm">
                        Sistema de gestión del directorio de contactos institucional
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="p-4 sm:p-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-500 hover:text-st-green transition-colors"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Volver al directorio</span>
                    </button>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="lg:hidden w-12 h-12 bg-st-green rounded-xl flex items-center justify-center mb-6">
                                <span className="text-white font-bold text-lg">ST</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Iniciar sesión
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Ingresa tus credenciales para acceder al panel de administración
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <HiExclamationCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="admin@santotomas.cl"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-st-green focus:ring-2 focus:ring-st-green/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <HiKey className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-st-green focus:ring-2 focus:ring-st-green/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-st-green border-gray-300 rounded focus:ring-st-green"
                                />
                                <label htmlFor="remember" className="ml-3 text-sm text-gray-600">
                                    Mantener sesión iniciada
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-st-green hover:bg-st-green-dark text-white font-semibold py-3.5 px-6 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Ingresando...
                                    </>
                                ) : (
                                    <>
                                        <HiLockClosed className="w-5 h-5" />
                                        Iniciar sesión
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-gray-400">
                            Acceso restringido a personal autorizado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
