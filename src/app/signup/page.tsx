'use client';

import { useAuth } from '@/app/context/auth-context';
import { AuthForm } from '@/app/components/auth/auth-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bot } from 'lucide-react';

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Bot className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm type="signup" />;
}
