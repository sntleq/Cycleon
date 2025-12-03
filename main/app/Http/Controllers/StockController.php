<?php
// app/Http/Controllers/StockController.php
namespace app\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class StockController extends Controller
{
    public function proxy(string $game = 'grow-a-garden'): JsonResponse
    {
        $apiUrls = [
            'grow-a-garden' => 'https://alpha-v0-lama.3itx.tech/api/v1/stock',
            'plants-vs-brainrots' => 'https://alpha-v0-lama.3itx.tech/api/v1/plantvsbrainrot/stock',
        ];

        if (!isset($apiUrls[$game])) {
            return response()->json([
                'error' => 'Invalid game specified',
                'available_games' => array_keys($apiUrls)
            ], 400);
        }

        $url = $apiUrls[$game];
        $apiKey = 'a8aa7169-6483-4862-88c7-7932893fee2d';

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'x-api-key: ' . $apiKey,
                'Accept: application/json',
                'Cache-Control: no-cache, no-store',
                'Pragma: no-cache'
            ],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_FRESH_CONNECT => true,
        ]);

        $response = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Log the attempt
        Log::info('Stock API Call', [
            'game' => $game,
            'url' => $url,
            'http_code' => $httpCode,
            'curl_error' => $curlError,
            'has_response' => !empty($response),
            'timestamp' => now()->toISOString()
        ]);

        if ($response && !$curlError) {
            $data = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $data['_debug'] = [
                    'source' => 'curl',
                    'game' => $game,
                    'http_code' => $httpCode,
                    'timestamp' => now()->toISOString(),
                    'real_data' => true
                ];
                return response()->json($data);
            }
        }

        // Fallback to file_get_contents
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => implode("\r\n", [
                    'x-api-key: ' . $apiKey,
                    'Accept: application/json',
                    'Cache-Control: no-cache'
                ]),
                'timeout' => 10,
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ]
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response !== false) {
            $data = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                $data['_debug'] = [
                    'source' => 'file_get_contents',
                    'game' => $game,
                    'timestamp' => now()->toISOString(),
                    'real_data' => true
                ];
                return response()->json($data);
            }
        }

        // If everything fails, return fallback data
        return response()->json($this->getFallbackData($game, $curlError ?: 'API request failed', $httpCode));
    }

    private function getFallbackData(string $game, string $error = '', int $httpCode = 0): array
    {
        if ($game === 'plants-vs-brainrots') {
            return [
                'Seed_Stock' => [],
                'Gear_Stock' => [],
                'Season_stock' => [],
                'Christmas_stock' => [],
                'LastSeen' => [],
                '_debug' => [
                    'source' => 'error',
                    'game' => $game,
                    'error' => $error,
                    'http_code' => $httpCode,
                    'timestamp' => now()->toISOString(),
                    'real_data' => false,
                    'message' => 'API request failed. Check if the stock API is accessible.'
                ]
            ];
        }

        // Grow a Garden fallback
        return [
            'seed_stock' => [],
            'gear_stock' => [],
            'egg_stock' => [],
            'cosmetic_stock' => [],
            'Season_Stock' => [],
            '_debug' => [
                'source' => 'error',
                'game' => $game,
                'error' => $error,
                'http_code' => $httpCode,
                'timestamp' => now()->toISOString(),
                'real_data' => false,
                'message' => 'API request failed. Check if the stock API is accessible.'
            ]
        ];
    }
}
