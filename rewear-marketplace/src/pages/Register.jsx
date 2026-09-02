import { Link } from 'react-router-dom';
import { Shirt, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[var(--color-primary)] text-white p-3 rounded-xl shadow-md">
              <Shirt size={32} />
            </div>
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-[var(--color-text-main)]">
          Join ReWear
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
          Create an account to start swapping
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-[var(--color-border-main)]">
          <form className="space-y-6" action="#" method="POST">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-main)]">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="Drashti Vaghela"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-main)]">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-main)]">
                  Phone Number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium text-[var(--color-text-main)]">
                  City
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="Surat"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium text-[var(--color-text-main)]">
                  State
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="Gujarat"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-main)]">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-main)]">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[var(--color-border-main)] rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[var(--color-muted)]">
                I agree to the <a href="#" className="text-[var(--color-secondary)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--color-secondary)] hover:underline">Privacy Policy</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
              >
                Create Account <ArrowRight size={18} />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border-main)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[var(--color-muted)]">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border-2 border-[var(--color-border-main)] rounded-xl shadow-sm text-sm font-bold text-[var(--color-text-main)] bg-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
