<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        if (!in_array($user->role->name, $roles, true)) {
            return response()->json([
                'message' => 'Forbidden. Anda tidak memiliki akses ke resource ini.',
            ], 403);
        }

        return $next($request);
    }
}