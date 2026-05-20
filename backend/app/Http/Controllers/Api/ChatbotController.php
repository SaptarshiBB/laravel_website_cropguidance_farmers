<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatbotService;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function __construct(private ChatbotService $chatbot) {}

    public function sendMessage(Request $request)
    {
        $validated = $request->validate(['message' => ['required', 'string', 'max:1000']]);
        return response()->json($this->chatbot->reply($validated['message']) + ['timestamp' => now()->toISOString()]);
    }
}
