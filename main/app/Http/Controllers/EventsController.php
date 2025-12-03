<?php
// app/Http/Controllers/EventsController.php
namespace app\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class EventsController extends Controller
{
    public function proxy(string $game = 'grow-a-garden'): JsonResponse
    {
        $apiUrls = [
            'grow-a-garden' => 'https://alpha-v0-lama.3itx.tech/api/v1/weather',
            'plants-vs-brainrots' => 'https://alpha-v0-lama.3itx.tech/api/v1/plantvsbrainrot/Events',
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

        if ($response && !$curlError) {
            $data = json_decode($response, true);
            if (json_last_error() === JSON_ERROR_NONE && $data) {
                // Transform Grow-a-Garden data to consistent format
                if ($game === 'grow-a-garden' && isset($data['weather'])) {
                    $transformedData = [
                        'events' => [],
                        'lastSeenEvents' => $this->transformGrowAGardenEvents($data['weather']),
                        'nextEvent' => null,
                        'timestamp' => $data['timestamp'] ?? now()->toISOString(),
                    ];
                    return response()->json($transformedData);
                }

                return response()->json($data);
            }
        }

        // Fallback
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
                // Transform Grow-a-Garden data
                if ($game === 'grow-a-garden' && isset($data['weather'])) {
                    $transformedData = [
                        'events' => [],
                        'lastSeenEvents' => $this->transformGrowAGardenEvents($data['weather']),
                        'nextEvent' => null,
                        'timestamp' => $data['timestamp'] ?? now()->toISOString(),
                    ];
                    return response()->json($transformedData);
                }

                return response()->json($data);
            }
        }

        // Fallback empty data
        return response()->json([
            'events' => [],
            'lastSeenEvents' => [],
            'nextEvent' => null,
            'timestamp' => now()->toISOString(),
        ]);
    }

    private function transformGrowAGardenEvents(array $weatherEvents): array
    {
        $transformed = [];

        foreach ($weatherEvents as $event) {
            $transformed[] = [
                'Name' => $event['weather'] ?? 'Unknown',
                'DisplayName' => $event['weather'] ?? 'Unknown',
                'Image' => $event['image'] ?? '',
                'Description' => $this->getGrowAGardenDescription($event['weather'] ?? ''),
                'LastSeen' => $event['start_timestamp_unix'] ?? time(),
                'start_timestamp_unix' => $event['start_timestamp_unix'] ?? time(),
                'end_timestamp_unix' => $event['end_timestamp_unix'] ?? time() + 600,
                'active' => $event['active'] ?? false,
                'duration' => $event['duration'] ?? 600,
            ];
        }

        return $transformed;
    }

    private function getGrowAGardenDescription(string $weather): string
    {
        $descriptions = [
            'SummerHarvest' => 'Harvest season is here! Crops grow faster and yield more.',
            'Rainy' => 'Rainy weather increases water retention in crops.',
            'Sunny' => 'Bright sunny days boost photosynthesis.',
            'Stormy' => 'Stormy weather can damage crops but provides extra water.',
            'Windy' => 'Wind helps with pollination but can damage delicate plants.',
        ];

        return $descriptions[$weather] ?? 'A weather event affecting your garden.';
    }
}
