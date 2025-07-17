import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {

    const [loading, setLoading] = useState(false);

    const handleMicrosoftLogin = () => {
        setLoading(true);
        window.location.href = route('microsoft.login');
    };

    return (
        <AuthLayout title="Log in to your account" description="using your Microsoft account to access Industry Alert App.">
            <Head title="Log in" />

            <div className='flex flex-col gap-6'>
                <div className='grid gap-6'>
                    <Button
                        onClick={handleMicrosoftLogin}
                        className='w-full'
                        disabled={loading}
                    >
                        {loading && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" />
                        </svg>
                        Sign in with Microsoft
                    </Button>
                </div>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
