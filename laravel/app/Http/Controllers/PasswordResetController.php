<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRules;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Adresse e-mail non trouvée.'
            ]);
        }

        // Envoyer l'email de réinitialisation
        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with('success', 'Un lien de réinitialisation a été envoyé à votre adresse email.')
            : back()->withErrors(['email' => __($status)]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRules::defaults()],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator->errors());
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('success', 'Mot de passe réinitialisé avec succès.')
            : back()->withErrors(['email' => [__($status)]]);
    }
} 