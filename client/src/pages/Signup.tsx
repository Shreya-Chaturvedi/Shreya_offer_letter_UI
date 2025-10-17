import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { FileText } from 'lucide-react';
import { saveUser, authenticateUser } from '@/utils/auth';
import { signupSchema } from '@shared/schema';

export default function Signup() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    username?: string; 
    password?: string; 
    confirmPassword?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ username, password, confirmPassword });

    if (!result.success) {
      const fieldErrors: { username?: string; password?: string; confirmPassword?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as 'username' | 'password' | 'confirmPassword';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const saved = await saveUser(username, password);
    if (saved) {
      await authenticateUser(username, password);
      setLocation('/home');
    } else {
      setErrors({ general: 'Username already exists. Please choose another.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-card p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 border border-card-border">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">Offer Letter</h1>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`
                  w-full h-12 px-4 rounded-lg border-2 bg-background
                  text-foreground placeholder:text-muted-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${errors.username ? 'border-destructive' : 'border-input'}
                `}
                placeholder="Choose a username"
                data-testid="input-username"
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`
                  w-full h-12 px-4 rounded-lg border-2 bg-background
                  text-foreground placeholder:text-muted-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${errors.password ? 'border-destructive' : 'border-input'}
                `}
                placeholder="Create a password"
                data-testid="input-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`
                  w-full h-12 px-4 rounded-lg border-2 bg-background
                  text-foreground placeholder:text-muted-foreground
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${errors.confirmPassword ? 'border-destructive' : 'border-input'}
                `}
                placeholder="Confirm your password"
                data-testid="input-confirm-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive" role="alert">
                <p className="text-sm text-destructive text-center">
                  {errors.general}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg transition-all duration-150 hover-elevate active-elevate-2"
              data-testid="button-signup"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium" data-testid="link-login">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
