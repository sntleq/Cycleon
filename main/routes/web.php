<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StockController;
use App\Http\Controllers\EventsController;

Route::get('/', function () {
    return redirect()->route('grow-a-garden');
})->name('home');

Route::get('grow-a-garden', function () {
    return Inertia::render('grow-a-garden', []);
})->name('grow-a-garden');

Route::get('plants-vs-brainrots', function () {
    return Inertia::render('plants-vs-brainrots', []);
})->name('plants-vs-brainrots');

Route::get('steal-a-brainrot', function () {
    return Inertia::render('steal-a-brainrot', []);
})->name('steal-a-brainrot');

// Stock endpoints
Route::get('/proxy/stock/grow-a-garden', [StockController::class, 'proxy'])->defaults('game', 'grow-a-garden');
Route::get('/proxy/stock', [StockController::class, 'proxy'])->defaults('game', 'grow-a-garden'); // Default
Route::get('/proxy/stock/plants-vs-brainrots', [StockController::class, 'proxy'])->defaults('game', 'plants-vs-brainrots');

// Events endpoints
Route::get('/proxy/events/grow-a-garden', [EventsController::class, 'proxy'])->defaults('game', 'grow-a-garden');
Route::get('/proxy/events', [EventsController::class, 'proxy'])->defaults('game', 'grow-a-garden'); // Default
Route::get('/proxy/events/plants-vs-brainrots', [EventsController::class, 'proxy'])->defaults('game', 'plants-vs-brainrots');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
