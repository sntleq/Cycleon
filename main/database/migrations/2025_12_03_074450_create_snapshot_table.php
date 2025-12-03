<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('snapshot', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->timestamp('timestamp');
            $table->timestamps();

            $table->unique(['item_id', 'shop_id', 'timestamp']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('snapshots');
    }
};
