<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'game_id',
    ];

    /**
     * Get the game that owns the shop.
     */
    public function game(): BelongsTo
    {
        return $this->belongsTo(GameModel::class);
    }

    /**
     * Get all snapshots for the shop.
     */
    public function snapshot(): HasMany
    {
        return $this->hasMany(SnapshotModel::class);
    }

    /**
     * Get all items through snapshots.
     */
    public function item()
    {
        return $this->hasManyThrough(ItemModel::class, SnapshotModel::class);
    }
}
