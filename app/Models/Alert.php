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
        'reg_id',
        'organization_id',
        'site_id',
        'plant_type_id',
        'plant_make_id',
        'plant_model_id',
        'hazards',
    ];

    protected $casts = [
        'created_at' => 'timestamp',
        'updated_at' => 'timestamp',
        'deleted_at' => 'timestamp',
    ];

    public function source()
    {
        return $this->belongsTo(Source::class, 'source_id');
    }

    public function reg()
    {
        return $this->belongsTo(Reg::class, 'reg_id');
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
        return $this->belongsTo(PlantType::class, 'plant_type_id');
    }

    public function plantMake()
    {
        return $this->belongsTo(PlantMake::class, 'plant_make_id');
    }
    
    public function plantModel()
    {
        return $this->belongsTo(PlantModel::class, 'plant_model_id');
    }
}
