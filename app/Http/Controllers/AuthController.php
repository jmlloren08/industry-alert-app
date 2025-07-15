<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function redirectToMicrosoft()
    {
        try {

            return Socialite::driver('microsoft')
                ->redirect();
        } catch (\Exception $e) {
            Log::error('Microsoft redirect error: ' . $e->getMessage());
            return redirect()->route('login')->withErrors(['error' => 'Unable to redirect to Microsoft.']);
        }
    }

    public function handleMicrosoftCallback(Request $request)
    {
        try {

            if (!$request->has('code')) {
                Log::error('Microsoft callback missing authorization code');
                return redirect()->route('login')->withErrors(['error' => 'Authorization code missing from Microsoft callback']);
            }

            $microsoftUser = Socialite::driver('microsoft')->user();
            $email = $microsoftUser->getEmail();

            if (!str_ends_with($email, '@raion.com.au')) {
                return redirect()->route('login')->withErrors(['error' => 'Unauthorized email domain. Please use a @raion.com.au email address.']);
            }

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $microsoftUser->getName(),
                    'email_verified_at' => now(),
                    'password' => null,
                    'requires_sso_password_setup' => true,
                ],
            );

            session((['pending_sso_user_id' => $user->id]));

            if ($user->requires_sso_password_setup || !$user->sso_password) {
                return redirect()->route('sso.password.setup');
            }

            return redirect()->route('sso.password.verify');
        } catch (\Exception $e) {
            Log::error('Microsoft callback error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()->route('login')->withErrors(['error' => 'Authentication failed: ' . $e->getMessage()]);
        }
    }

    public function showPasswordSetup()
    {
        $userId = session('pending_sso_user_id');

        if (!$userId) {
            return redirect()->route('login')->withErrors(['error' => 'No pending user session found.']);
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login')->withErrors(['error' => 'User not found.']);
        }

        return Inertia::render('auth/setup-password', [
            'user' => $user->only(['name', 'email']),
        ]);
    }

    public function setupPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $userId = session('pending_sso_user_id');

        if (!$userId) {
            return redirect()->route('login')->withErrors(['error' => 'No pending user session found.']);
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login')->withErrors(['error' => 'User not found.']);
        }

        $user->update([
            'sso_password' => Hash::make($request->password),
            'requires_sso_password_setup' => false,
        ]);

        Auth::login($user);
        session()->forget('pending_sso_user_id');

        return redirect()->intended(route('dashboard'));
    }

    public function showPasswordVerify()
    {
        $userId = session('pending_sso_user_id');

        if (!$userId) {
            return redirect()->route('login')->withErrors(['error' => 'No pending user session found.']);
        }

        $user = User::find($userId);

        if (!$user) {
            return redirect()->route('login')->withErrors(['error' => 'User not found.']);
        }

        return Inertia::render('auth/verify-password', [
            'user' => $user->only(['name', 'email']),
        ]);
    }

    public function verifyPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $userId = session('pending_sso_user_id');

        if (!$userId) {
            return redirect()->route('login')->withErrors(['error' => 'No pending user session found.']);
        }

        $user = User::find($userId);

        if (!$user || !Hash::check($request->password, $user->sso_password)) {
            return back()->withErrors([
                'password' => 'The provided password is incorrect. Please try again.',
            ]);
        }

        Auth::login($user);
        session()->forget('pending_sso_user_id');

        return redirect()->intended(route('dashboard'));
    }
}
