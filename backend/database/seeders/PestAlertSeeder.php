<?php

namespace Database\Seeders;

use App\Models\Crop;
use App\Models\PestAlert;
use Illuminate\Database\Seeder;

class PestAlertSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['Rice','Brown Plant Hopper','critical',['West Bengal','Odisha','Tamil Nadu','Andhra Pradesh'],'Circular hopper burn patches, yellowing, honeydew at plant base.','Avoid excess nitrogen, maintain spacing, drain field briefly, conserve spiders.','Contact agriculture officer and apply recommended systemic insecticide if ETL crossed.'],
            ['Cotton','White Fly','high',['Punjab','Haryana','Rajasthan','Gujarat'],'Leaf yellowing, curling, sticky honeydew and sooty mold.','Yellow sticky traps, remove weed hosts, rotate insecticide groups.','Spray recommended molecule against nymphs and report viral symptoms.'],
            ['Mustard','Aphids','medium',['Rajasthan','Madhya Pradesh','Uttar Pradesh','Punjab'],'Colonies on tender shoots and siliqua, curling, stunted flowers.','Early sowing, neem oil, conserve ladybird beetles.','Use recommended aphicide when colonies exceed threshold.'],
            ['Maize','Fall Army Worm','high',['Karnataka','Maharashtra','Telangana','Bihar'],'Window pane damage, frass in whorl, ragged leaves.','Pheromone traps, destroy egg masses, seed treatment.','Apply whorl-directed biopesticide or recommended insecticide immediately.'],
            ['Groundnut','Leaf Miner','medium',['Gujarat','Andhra Pradesh','Tamil Nadu'],'Mined leaves, webbing, drying leaflets.','Deep ploughing, light traps, avoid dense sowing.','Use recommended control if severe defoliation appears.'],
            ['Wheat','Rust','high',['Punjab','Haryana','Uttar Pradesh','Bihar'],'Orange or brown pustules on leaves, premature drying.','Resistant varieties, balanced fertilizer, field sanitation.','Apply recommended fungicide at first appearance and inform extension team.'],
            ['Tomato','Fruit Borer','high',['Maharashtra','Karnataka','Andhra Pradesh'],'Entry holes, frass, damaged fruits and flowers.','Pheromone traps, remove damaged fruits, marigold trap crop.','Spray HaNPV or recommended insecticide in evening.'],
            ['Sugarcane','Early Shoot Borer','medium',['Uttar Pradesh','Maharashtra','Karnataka'],'Dead hearts in young crop, bore holes near base.','Trash mulching, light earthing-up, release Trichogramma.','Rogue affected shoots and apply recommended granules.'],
            ['Bajra','Locusts','critical',['Rajasthan','Gujarat','Haryana'],'Rapid defoliation, moving swarms, clipped panicles.','Community surveillance, trenches for hoppers, report sightings.','Alert district control room for coordinated locust operation.'],
            ['Chilli','Thrips','high',['Andhra Pradesh','Telangana','Karnataka','Tamil Nadu'],'Leaf curling, silvering, flower drop, vector-borne leaf curl.','Blue sticky traps, remove infested tips, avoid excess nitrogen.','Use recommended insecticide rotation and protect new flush.'],
        ];
        foreach ($rows as $r) {
            $crop = Crop::where('name', $r[0])->first();
            if ($crop) PestAlert::updateOrCreate(['crop_id' => $crop->id, 'pest_name' => $r[1]], ['severity' => $r[2], 'affected_states' => $r[3], 'symptoms' => $r[4], 'prevention' => $r[5], 'emergency_action' => $r[6], 'is_active' => true]);
        }
    }
}
