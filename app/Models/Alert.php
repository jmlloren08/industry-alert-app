<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Alert extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'industry_alerts';

    protected $primaryKey = 'id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'number',
        'source_id',
        'incident_date',
        'description',
        'hyperlink_text',
        'hyperlink_url',
        'organization_id',
        'site_id',
        'type_id',
        'make_id',
        'model_id',
        'is_new',
        'is_reviewed',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'is_reviewed' => 'boolean',
    ];

    public function source()
    {
        return $this->belongsTo(Source::class, 'source_id');
    }

    public function regulations()
    {
        return $this->belongsToMany(Regulation::class, 'alerts_regulations', 'alert_id', 'regulation_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function site()
    {
        return $this->belongsTo(Site::class, 'site_id');
    }

    public function plantType()
    {
        return $this->belongsTo(PlantType::class, 'type_id');
    }

    public function plantMake()
    {
        return $this->belongsTo(PlantMake::class, 'make_id');
    }

    public function plantModel()
    {
        return $this->belongsTo(PlantModel::class, 'model_id');
    }

    public function hazards()
    {
        return $this->belongsToMany(Hazard::class, 'alerts_hazards', 'alert_id', 'hazard_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Helper methods for review workflow
    public function markAsReviewed($userId = null)
    {
        $this->update([
            'is_new' => false,
            'is_reviewed' => true,
            'reviewed_by' => $userId ?? Auth::id(),
            'reviewed_at' => now(),
        ]);
    }

    public function hasMissingRegulations()
    {
        return $this->regulations()->count() === 0;
    }

    public function hasMissingHazards()
    {
        return $this->hazards()->count() === 0;
    }

    public function hasIncompleteData()
    {
        return $this->hasMissingRegulations() || $this->hasMissingHazards();
    }
}
