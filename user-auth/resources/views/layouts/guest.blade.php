<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Zenzloom Auth') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])

        <style>
            /* Dynamic Animated Background */
            body {
                background: linear-gradient(-45deg, #0f172a, #1e1b4b, #312e81, #1e293b);
                background-size: 400% 400%;
                animation: gradientBG 15s ease infinite;
                font-family: 'Inter', sans-serif;
            }
            @keyframes gradientBG {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            /* Glassmorphism utility */
            .glass-panel {
                background: rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
            }
        </style>
    </head>
    <body class="text-gray-200 antialiased relative overflow-x-hidden">
        <!-- Ambient Glowing Orbs -->
        <div class="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 relative z-10">
            <div class="mb-8">
                <a href="/" class="flex flex-col items-center gap-2 group">
                    <!-- Premium Logo treatment -->
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 transform group-hover:-translate-y-1">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                    </div>
                    <span class="text-2xl font-bold tracking-wider text-white">ZENZLOOM</span>
                </a>
            </div>

            <div class="w-full sm:max-w-md px-8 py-10 glass-panel sm:rounded-2xl transition-all duration-300 hover:border-white/10">
                {{ $slot }}
            </div>
            
            <div class="mt-8 text-sm text-gray-500">
                Secure Authentication Gateway
            </div>
        </div>
    </body>
</html>
