<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SnapshotModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'shop_id',
        'quantity',
        'timestamp',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    /**
     * Get the item for the snapshot.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(ItemModel::class);
    }

    /**
     * Get the shop for the snapshot.
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(ShopModel::class);
    }
}
