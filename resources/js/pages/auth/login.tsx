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

// type LoginForm = {
//     email: string;
//     password: string;
//     remember: boolean;
// };

interface LoginProps {
    status?: string;
    // canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {

    // const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    //     email: '',
    //     password: '',
    //     remember: false,
    // });

    // const submit: FormEventHandler = (e) => {
    //     e.preventDefault();
    //     post(route('login'), {
    //         onFinish: () => reset('password'),
    //     });
    // }

    const [loading, setLoading] = useState(false);

    const handleMicrosoftLogin = () => {
        setLoading(true);
        window.location.href = '/auth/redirect';
    };

    return (
        <AuthLayout title="Log in to your account" description="using your Microsoft account to access Industry Alert App.">
            <Head title="Log in" />

            {/* <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>
            </form> */}

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
