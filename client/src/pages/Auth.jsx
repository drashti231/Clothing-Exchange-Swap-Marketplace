import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Mail, Lock, User, AlertTriangle, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState('');
  const { user, login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { register: formRegister, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data) => {
    setAuthError('');
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        await register(data.name, data.email, data.password);
      }
      navigate('/dashboard');
    } catch (error) {
      setAuthError(error.response?.data?.message || error.message || 'Authentication failed. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setAuthError('');
    reset();
  };

  const inputClasses = "w-full pl-11 pr-4 py-3.5 bg-brand-light/40 border border-border-subtle rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-text-main transition-all font-medium";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted";

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-border-subtle bg-white max-w-6xl mx-auto my-8">

      {/* Left side: Hero / Branding */}
      <div className="md:w-5/12 bg-brand-dark p-10 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary rounded-full blur-3xl opacity-20 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-danger-tag rounded-full blur-3xl opacity-10 transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight mb-4 text-warm-cream">ReWear.</h1>
          <p className="text-brand-light text-lg font-medium leading-relaxed max-w-sm">
            Join the sustainable fashion movement. Swap clothes you no longer wear for something new to you.
          </p>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-primary mr-3" />
              <h3 className="font-bold text-xl text-warm-cream">Trusted Community</h3>
            </div>
            <p className="text-sm text-brand-light leading-relaxed">
              Every item is evaluated for fair swapping. Trade confidently with our verified user base and secure system.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-brand-dark mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-text-muted font-medium">
              {isLogin ? 'Enter your details to access your closet.' : 'Start swapping your clothes today.'}
            </p>
          </div>

          {authError && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 flex items-center font-medium shadow-sm">
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p className="text-sm">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className={iconClasses} />
                  <input
                    {...formRegister('name')}
                    className={`${inputClasses} ${errors.name ? 'border-danger focus:ring-danger' : ''}`}
                    placeholder="Alex Morgan"
                  />
                </div>
                {errors.name && <p className="text-danger text-xs font-bold mt-1.5 ml-1">{errors.name.message}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className={iconClasses} />
                <input
                  {...formRegister('email')}
                  type="email"
                  className={`${inputClasses} ${errors.email ? 'border-danger focus:ring-danger' : ''}`}
                  placeholder="alex@example.com"
                />
              </div>
              {errors.email && <p className="text-danger text-xs font-bold mt-1.5 ml-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className={iconClasses} />
                <input
                  {...formRegister('password')}
                  type="password"
                  className={`${inputClasses} ${errors.password ? 'border-danger focus:ring-danger' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-danger text-xs font-bold mt-1.5 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-dark text-white py-4 px-4 rounded-xl font-bold text-lg hover:bg-brand-primary transition-all duration-300 flex justify-center items-center shadow-lg hover:shadow-xl mt-6 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-text-muted font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-danger-tag font-bold hover:text-orange-600 hover:underline underline-offset-4 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}