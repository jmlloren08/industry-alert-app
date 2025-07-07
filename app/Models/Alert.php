<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'hazards',
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
}
