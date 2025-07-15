import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";

interface SetupPasswordProps {
    user: {
        name: string;
        email: string;
    }
}

export default function SetupPassword({ user }: SetupPasswordProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sso.password.setup'), {
            onSuccess: () => {

            },
        });
    }

    return (
        <AuthLayout
            title="Set up your security password"
            description={`Hello ${user.name}, please set up an additional password for enhanced security.`}
        >
            <Head title="Set up Password" />

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

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        placeholder="Confirm your password"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Set up password
                </Button>
            </form>
        </AuthLayout>
    );
}