import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";

interface VerifyPasswordProps {
    user: {
        name: string;
        email: string;
    }
}

export default function VerifyPassword({ user }: VerifyPasswordProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sso.password.verify'), {
            onSuccess: () => {

            }
        });
    }

    return (
        <AuthLayout
            title="Verify your password"
            description={`Welcome back ${user.name}, please verify your password to continue.`}
        >
            <Head title="Verify Password" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Enter your password"
                        autoFocus
                    />
                    <InputError message={errors.password} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Verify Password
                </Button>
            </form>
        </AuthLayout>
    );
}