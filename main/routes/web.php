<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('grow-a-garden');
})->name('home');

Route::get('grow-a-garden', function () {
    return Inertia::render('grow-a-garden', []);
})->name('grow-a-garden');

Route::get('steal-a-brainrot', function () {
    return Inertia::render('steal-a-brainrot', []);
})->name('steal-a-brainrot');

Route::get('plants-vs-brainrots', function () {
    return Inertia::render('plants-vs-brainrots', []);
})->name('plants-vs-brainrots');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
