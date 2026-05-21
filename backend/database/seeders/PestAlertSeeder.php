<?php

namespace Database\Seeders;

use App\Models\Crop;
use App\Models\PestAlert;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class PestAlertSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        PestAlert::truncate();
        Schema::enableForeignKeyConstraints();

        foreach ($this->alerts() as $alert) {
            $firstCrop = $alert['affected_crops'][0] ?? null;
            $crop = $firstCrop && $firstCrop !== 'All crops' ? Crop::where('name', 'like', "{$firstCrop}%")->first() : null;
            PestAlert::create($alert + ['crop_id' => $crop?->id]);
        }
    }

    private function alerts(): array
    {
        $date = Carbon::now()->subDays(5)->toDateString();
        $a = fn ($pest, $common, $crops, $states, $season, $severity, $symptoms, $organic, $chemical, $action, $risk, $source = 'ICAR Advisory') => [
            'pest_name' => $pest,
            'common_name' => $common,
            'affected_crops' => $crops,
            'affected_states' => $states,
            'season' => $season,
            'severity' => $severity,
            'symptoms' => $symptoms,
            'prevention_organic' => $organic,
            'prevention_chemical' => $chemical,
            'emergency_action' => $action,
            'risk_score' => $risk,
            'is_active' => true,
            'reported_date' => $date,
            'source' => $source,
        ];

        return [
            $a('Brown Plant Hopper', 'BPH', ['Rice/Paddy'], ['West Bengal','Odisha','Andhra Pradesh','Telangana','Kerala','Tamil Nadu','Assam'], 'kharif', 'high', ['Yellowing in circular patches','Hopper burn','Stunted plants'], ['Drain field periodically','Avoid excess nitrogen','Use light traps at dusk'], ['chemical_name' => 'Buprofezin 25% SC', 'dose' => '1ml/L', 'frequency' => 'Once at ETL, repeat after 10 days if needed'], 'Drain standing water and spray only on lower plant canopy after confirming hopper population.', 75),
            $a('Fall Army Worm', 'Spodoptera frugiperda', ['Maize/Corn','Jowar/Sorghum','Bajra/Millet'], ['Karnataka','Andhra Pradesh','Telangana','Tamil Nadu','Maharashtra','Kerala'], 'kharif', 'critical', ['Transparent windows on leaves','Ragged leaf edges','Frass in whorl'], ['Install pheromone traps','Intercrop with cowpea','Destroy egg masses'], ['chemical_name' => 'Spinetoram 11.7% SC', 'dose' => '0.5ml/L', 'frequency' => 'Whorl spray at early larval stage'], 'Treat whorls immediately and alert nearby maize growers for synchronized scouting.', 90),
            $a('Wheat Rust', 'Yellow Rust', ['Wheat'], ['Punjab','Haryana','Uttar Pradesh','Uttarakhand','Himachal Pradesh'], 'rabi', 'high', ['Yellow pustules in stripes on leaves','Pale green leaf background','Premature drying'], ['Use resistant varieties HD 3086 and PBW 550','Avoid late sowing','Remove volunteer wheat'], ['chemical_name' => 'Propiconazole 25% EC', 'dose' => '0.1%', 'frequency' => 'Spray at first stripe appearance'], 'Spray affected patches first and inspect downwind fields within 48 hours.', 80),
            $a('Cotton Bollworm', 'American Bollworm', ['Cotton'], ['Gujarat','Maharashtra','Telangana','Andhra Pradesh','Rajasthan','Punjab'], 'kharif', 'critical', ['Circular holes in bolls','Frass visible','Premature boll shedding'], ['Pheromone traps at 5 per acre','Intercrop with marigold','Destroy damaged bolls'], ['chemical_name' => 'Emamectin benzoate 5% SG', 'dose' => '0.4g/L', 'frequency' => 'Spray at ETL, rotate chemistry'], 'Remove damaged bolls and spray in evening to protect pollinators.', 88),
            $a('Aphids on Mustard', 'Mustard Aphid', ['Mustard/Canola'], ['Rajasthan','Uttar Pradesh','Haryana','Madhya Pradesh','Bihar'], 'rabi', 'medium', ['Curling leaves','Sticky honeydew','Black sooty mold'], ['Yellow sticky traps','Conserve ladybird beetles','Neem oil spray'], ['chemical_name' => 'Dimethoate 30% EC', 'dose' => '1ml/L', 'frequency' => 'One spray when colonies build up'], 'Spray border and infested patches before flowering intensity increases.', 60),
            $a('Red Hairy Caterpillar', 'Amsacta albistriga', ['Groundnut','Soybean'], ['Gujarat','Rajasthan','Madhya Pradesh'], 'kharif', 'high', ['Defoliation','Hairy caterpillars visible on soil','Skeletonized leaves'], ['Deep plough before sowing','Use light traps at night','Collect and destroy larvae'], ['chemical_name' => 'Chlorpyrifos 20% EC', 'dose' => '2.5ml/L', 'frequency' => 'Spot spray infested rows'], 'Organize community night trapping and treat young larvae quickly.', 72),
            $a('Stem Borer in Rice', 'Yellow Stem Borer', ['Rice/Paddy'], ['Punjab','Haryana','Uttar Pradesh','Bihar','West Bengal','Odisha'], 'kharif', 'high', ['Dead heart in young plants','White ear at panicle stage','Bore holes on tillers'], ['Clip and destroy infested tillers','Release Trichogramma','Avoid excessive nitrogen'], ['chemical_name' => 'Cartap hydrochloride 4G', 'dose' => '8kg/acre', 'frequency' => 'Apply at active tillering if ETL crossed'], 'Remove infested tillers and apply granules with adequate field moisture.', 78),
            $a('Thrips on Chilli', 'Chilli Thrips', ['Chilli','Tomato','Onion'], ['Andhra Pradesh','Telangana','Karnataka','Maharashtra'], 'kharif', 'medium', ['Silvery leaf curling','Black fecal spots','Deformed fruits'], ['Blue sticky traps','Reflective mulch','Neem seed kernel extract'], ['chemical_name' => 'Fipronil 5% SC', 'dose' => '1.5ml/L', 'frequency' => 'Spray at 7-10 day interval if severe'], 'Control weeds and spray undersides of leaves during early infestation.', 55),
            $a('Whitefly', 'Cotton/Tomato Whitefly', ['Cotton','Tomato','Okra'], ['Punjab','Haryana','Gujarat','Rajasthan','Andhra Pradesh'], 'kharif', 'high', ['Yellowing','Leaf curl virus spread','Sooty mold'], ['Yellow sticky traps','Neem oil spray 5ml/L','Remove alternate weed hosts'], ['chemical_name' => 'Imidacloprid 17.8% SL', 'dose' => '0.3ml/L', 'frequency' => 'Spray only at threshold'], 'Rogue virus-infected plants and avoid repeated neonicotinoid sprays.', 70),
            $a('Blast Disease', 'Rice Blast', ['Rice/Paddy'], ['West Bengal','Assam','Bihar','Odisha','Chhattisgarh','Jharkhand'], 'kharif', 'critical', ['Diamond-shaped lesions','Neck rot','Panicle death'], ['Use resistant varieties','Balanced nitrogen','Avoid dense planting'], ['chemical_name' => 'Tricyclazole 75% WP', 'dose' => '0.6g/L', 'frequency' => 'Spray at leaf blast and boot stage risk'], 'Stop top-dressing nitrogen and protect panicle stage immediately.', 85),
            $a('Locust Swarm', 'Desert Locust', ['All crops'], ['Rajasthan','Gujarat','Madhya Pradesh','Uttar Pradesh'], 'kharif', 'critical', ['Sudden complete defoliation','Large swarms visible','Rapid crop loss'], ['Early warning monitoring','Community scouting','Noise and trench barriers for hoppers'], ['chemical_name' => 'Malathion 96% ULV', 'dose' => 'Government aerial/vehicle spray', 'frequency' => 'As directed by plant protection team'], 'Report swarm movement to district agriculture office immediately.', 95, 'State Agri Dept'),
            $a('Powdery Mildew on Wheat', 'Wheat Powdery Mildew', ['Wheat'], ['Punjab','Haryana','Uttar Pradesh','Bihar'], 'rabi', 'medium', ['White powdery coating on leaves','Early senescence','Reduced tiller vigor'], ['Crop rotation','Remove infected debris','Use tolerant varieties'], ['chemical_name' => 'Sulfur 80% WP', 'dose' => '3g/L', 'frequency' => 'Spray at first appearance'], 'Improve airflow and protect flag leaf if disease spreads upward.', 50),
            $a('Jassid on Cotton', 'Leafhopper', ['Cotton'], ['Gujarat','Maharashtra','Rajasthan'], 'kharif', 'medium', ['Leaf margin yellowing','Cupped leaves','Hopper burn'], ['Use hairy/okra leaf varieties','Early sowing','Conserve predators'], ['chemical_name' => 'Acetamiprid 20% SP', 'dose' => '0.2g/L', 'frequency' => 'Spray after ETL'], 'Spray young crop before severe leaf curling reduces growth.', 58),
            $a('Bacterial Leaf Blight', 'Rice BLB', ['Rice/Paddy'], ['Punjab','Haryana','Uttar Pradesh','West Bengal','Andhra Pradesh'], 'kharif', 'high', ['Water-soaked leaf margins','Yellow stripes','Wilting in severe cases'], ['Use resistant varieties','Avoid flooding','Use balanced nitrogen'], ['chemical_name' => 'Copper oxychloride 50% WP', 'dose' => '3g/L', 'frequency' => 'Spray with recommended sticker if advised locally'], 'Avoid field movement when wet and stop nitrogen until disease stabilizes.', 73),
            $a('Mango Hoppers', 'Mango Hopper', ['Mango'], ['Uttar Pradesh','Bihar','Andhra Pradesh','Tamil Nadu','Karnataka','Maharashtra'], 'zaid', 'medium', ['Honeydew secretion','Sooty mold on fruits','Flower drop'], ['Dust sulfur at 2kg/tree','Prune dense canopy','Avoid excess irrigation during flowering'], ['chemical_name' => 'Imidacloprid', 'dose' => '0.005% spray', 'frequency' => 'At panicle emergence and fruit set if needed'], 'Protect flowering panicles and avoid spraying during active bee movement.', 60),
            $a('Cutworm', 'Agrotis spp.', ['Wheat','Tomato','Cabbage','Cauliflower'], ['Punjab','Haryana','Uttar Pradesh','Bihar','Madhya Pradesh'], 'rabi', 'medium', ['Seedlings cut at ground level','Larvae hide in soil','Patchy gaps'], ['Deep summer ploughing','Poison bait with bran and jaggery','Remove weeds'], ['chemical_name' => 'Chlorantraniliprole 18.5% SC', 'dose' => '0.3ml/L', 'frequency' => 'Drench around seedlings if severe'], 'Check fields at dusk and treat patchy seedling loss quickly.', 57),
            $a('Red Spider Mite', 'Tetranychus mite', ['Brinjal','Cotton','Chilli'], ['Karnataka','Maharashtra','Gujarat','Andhra Pradesh','Telangana'], 'kharif', 'medium', ['Fine webbing','Bronzing leaves','Leaf drop in dry weather'], ['Spray water to reduce dust','Neem oil','Conserve predatory mites'], ['chemical_name' => 'Propargite 57% EC', 'dose' => '2ml/L', 'frequency' => 'Spray lower leaf surface'], 'Increase humidity where possible and rotate acaricides.', 62),
            $a('Diamondback Moth', 'DBM', ['Cabbage','Cauliflower'], ['Himachal Pradesh','Uttarakhand','Karnataka','Tamil Nadu','West Bengal'], 'rabi', 'high', ['Windowing on leaves','Small green larvae','Holes in heads'], ['Pheromone traps','Bt spray','Remove crop residues'], ['chemical_name' => 'Emamectin benzoate 5% SG', 'dose' => '0.4g/L', 'frequency' => 'Spray at larval appearance'], 'Use Bt and chemical rotation to avoid resistance.', 74),
            $a('Root Knot Nematode', 'Meloidogyne spp.', ['Tomato','Chilli','Vegetables'], ['Karnataka','Tamil Nadu','Andhra Pradesh','Maharashtra','Kerala'], 'year-round', 'high', ['Root galls','Stunted plants','Wilting despite moisture'], ['Soil solarization','Marigold rotation','Neem cake application'], ['chemical_name' => 'Fluopyram 34.48% SC', 'dose' => 'As label recommendation', 'frequency' => 'Soil application before planting'], 'Uproot sample plants to confirm galls before replanting affected beds.', 68),
            $a('Fusarium Wilt', 'Wilt Disease', ['Tomato','Chilli'], ['Andhra Pradesh','Telangana','Karnataka','Maharashtra','Odisha'], 'kharif', 'high', ['One-sided yellowing','Vascular browning','Permanent wilt'], ['Use resistant varieties','Raised beds','Trichoderma enriched compost'], ['chemical_name' => 'Carbendazim 50% WP', 'dose' => '1g/L soil drench', 'frequency' => 'Drench nursery and affected patches'], 'Remove wilted plants with roots and drench adjoining plants.', 71),
            $a('Late Blight', 'Potato Late Blight', ['Potato'], ['Uttar Pradesh','West Bengal','Bihar','Punjab','Himachal Pradesh'], 'rabi', 'critical', ['Water-soaked leaf lesions','White fungal growth underside','Tuber rot'], ['Use disease-free seed','Destroy cull piles','Improve airflow'], ['chemical_name' => 'Mancozeb 75% WP', 'dose' => '2.5g/L', 'frequency' => 'Protective spray during humid weather'], 'Spray immediately before cool wet spell and remove severely infected foliage.', 86),
            $a('Downy Mildew', 'Cucurbit/Grape Downy Mildew', ['Cucumber','Grapes'], ['Maharashtra','Karnataka','Tamil Nadu','Andhra Pradesh','Gujarat'], 'zaid', 'high', ['Angular yellow leaf spots','Grey growth underside','Rapid defoliation'], ['Avoid overhead irrigation','Improve ventilation','Remove infected leaves'], ['chemical_name' => 'Metalaxyl + Mancozeb', 'dose' => '2g/L', 'frequency' => 'Spray at 7-10 day interval in high risk'], 'Start protectant spray before humid nights and morning dew periods.', 76),
            $a('Spotted Pod Borer', 'Maruca vitrata', ['Tur/Arhar'], ['Maharashtra','Karnataka','Uttar Pradesh','Madhya Pradesh','Gujarat'], 'kharif', 'high', ['Webbed flowers','Bored pods','Larvae feeding inside pods'], ['Pheromone traps','Neem seed kernel extract','Remove webbed flowers'], ['chemical_name' => 'Indoxacarb 14.5% SC', 'dose' => '0.5ml/L', 'frequency' => 'Spray at flowering and pod initiation if ETL crossed'], 'Target flowering stage before larvae enter pods.', 77),
            $a('Pod Fly', 'Soybean Pod Fly', ['Soybean'], ['Madhya Pradesh','Maharashtra','Rajasthan','Karnataka'], 'kharif', 'medium', ['Shriveled grains','Exit holes on pods','Larvae inside pods'], ['Timely sowing','Deep ploughing','Destroy crop residues'], ['chemical_name' => 'Thiamethoxam 25% WG', 'dose' => '0.25g/L', 'frequency' => 'Spray at pod formation if needed'], 'Scout pod stage and harvest timely to reduce carryover.', 59),
            $a('Sheath Blight', 'Rice Sheath Blight', ['Rice/Paddy'], ['West Bengal','Assam','Odisha','Andhra Pradesh','Telangana','Tamil Nadu'], 'kharif', 'high', ['Oval lesions on sheath','Lodging patches','Disease moves upward'], ['Wider spacing','Balanced nitrogen','Remove weeds on bunds'], ['chemical_name' => 'Hexaconazole 5% EC', 'dose' => '2ml/L', 'frequency' => 'Spray at early lesion spread'], 'Lower field humidity by draining briefly and treat spreading patches.', 79),
            $a('Jute Semilooper', 'Jute Defoliator', ['Jute'], ['West Bengal','Assam','Bihar','Odisha','Meghalaya'], 'kharif', 'medium', ['Irregular leaf feeding','Defoliation in patches','Larvae on underside'], ['Light traps','Handpick larvae','Neem-based spray'], ['chemical_name' => 'Quinalphos 25% EC', 'dose' => '2ml/L', 'frequency' => 'Spray if defoliation exceeds threshold'], 'Treat young crop patches before fibre yield is affected.', 56, 'State Agri Dept'),
        ];
    }
}
