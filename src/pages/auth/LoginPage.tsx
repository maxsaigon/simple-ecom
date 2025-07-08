import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { signInWithPassword } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await signInWithPassword(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-primary-foreground font-bold text-2xl">SB</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Social Boots</h1>
          <p className="text-muted-foreground mt-2">Professional Social Media Management</p>
        </div>

        <div className="shadow-lg border-0 bg-card/80 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6 pb-0">
            <div className="text-2xl font-semibold flex items-center justify-center gap-2">
              <LogIn size={24} />
              Welcome Back
            </div>
            <div className="text-muted-foreground mt-1 mb-2">
              Sign in to your account to continue
            </div>
          </div>
          <div className="p-6 pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 font-medium">
                  <Mail size={16} />
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 font-medium">
                  <Lock size={16} />
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-accent-light rounded-lg border border-accent/20">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>User:</strong> user@example.com / password</p>
                <p><strong>Admin:</strong> admin@example.com / password</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Secure authentication powered by Supabase</p>
        </div>
        <div className="text-center mt-4 text-sm">
          Don't have an account? <a href="/register" className="text-blue-600">Sign up</a>
        </div>
      </div>
    </div>
  );
}