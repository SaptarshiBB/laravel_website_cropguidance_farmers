<?php

namespace Database\Seeders;

use App\Models\Crop;
use Illuminate\Database\Seeder;

class CropSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['Wheat','rabi',['Loamy','Clay'],10,25,300,900,'NPK 120:60:40 kg/ha with FYM before sowing; split nitrogen at CRI and tillering.','18-24 quintals','Cool-season cereal suited for irrigated north and central India.','https://source.unsplash.com/featured/?wheat'],
            ['Rice','kharif',['Clay','Loamy'],20,35,900,2500,'NPK 100:50:50 kg/ha, zinc where deficient, avoid excess nitrogen.','20-30 quintals','Staple monsoon crop for puddled or transplanted fields.','https://source.unsplash.com/featured/?rice'],
            ['Cotton','kharif',['Black','Loamy'],21,38,500,1100,'NPK 80:40:40 kg/ha plus FYM; split N and K around square formation.','8-12 quintals kapas','Warm-season fibre crop suited to black cotton soils.','https://source.unsplash.com/featured/?cotton'],
            ['Sugarcane','kharif',['Loamy','Black'],20,38,1200,2500,'NPK 250:115:115 kg/ha with compost and micronutrients; prefer fertigation.','350-500 quintals','Long-duration high biomass crop with high water and nutrient need.','https://source.unsplash.com/featured/?sugarcane'],
            ['Maize','kharif',['Loamy','Sandy'],18,35,500,900,'NPK 120:60:40 kg/ha; top dress nitrogen at knee-high and tasseling.','22-35 quintals','Versatile cereal grown for grain, fodder, and silage.','https://source.unsplash.com/featured/?maize'],
            ['Bajra','kharif',['Sandy','Red'],24,40,250,600,'NPK 60:30:20 kg/ha with seed treatment and FYM.','8-14 quintals','Drought-tolerant millet suited for arid rainfed areas.','https://source.unsplash.com/featured/?bajra'],
            ['Jowar','kharif',['Black','Red'],22,38,350,800,'NPK 80:40:40 kg/ha; add sulphur in deficient soils.','10-18 quintals','Resilient sorghum for grain and fodder.','https://source.unsplash.com/featured/?jowar'],
            ['Mustard','rabi',['Loamy','Sandy'],10,28,250,500,'NPK 80:40:40 kg/ha plus sulphur 20 kg/ha.','6-10 quintals','Oilseed crop preferring cool dry weather.','https://source.unsplash.com/featured/?mustard'],
            ['Groundnut','kharif',['Sandy','Red'],22,35,500,1000,'NPK 20:40:40 kg/ha, gypsum at pegging, rhizobium seed treatment.','10-16 quintals pods','Legume oilseed requiring loose well-drained soil.','https://source.unsplash.com/featured/?groundnut'],
            ['Soybean','kharif',['Black','Loamy'],20,32,600,1100,'NPK 30:60:40 kg/ha; rhizobium and PSB seed inoculation.','8-14 quintals','Protein-rich oilseed suited for central India monsoon.','https://source.unsplash.com/featured/?soybean'],
            ['Tomato','zaid',['Loamy','Red'],18,32,400,800,'NPK 100:80:80 kg/ha through split fertigation; add calcium.','180-250 quintals','High-value vegetable needing staking and pest vigilance.','https://source.unsplash.com/featured/?tomato'],
            ['Onion','rabi',['Loamy','Black'],13,30,350,750,'NPK 100:50:50 kg/ha, sulphur, and potassium for bulb quality.','100-160 quintals','Bulb crop requiring careful nursery and irrigation.','https://source.unsplash.com/featured/?onion'],
            ['Potato','rabi',['Loamy','Sandy'],12,26,500,900,'NPK 150:80:100 kg/ha; split nitrogen and potash.','80-120 quintals','Cool-season tuber crop for loose fertile soils.','https://source.unsplash.com/featured/?potato'],
            ['Chilli','kharif',['Loamy','Red'],20,35,600,1200,'NPK 120:60:60 kg/ha, micronutrients, and compost.','25-45 quintals green','Spice crop needing drainage and vector management.','https://source.unsplash.com/featured/?chilli'],
            ['Turmeric','kharif',['Loamy','Laterite'],20,35,1000,2000,'FYM 10 t/acre, NPK 60:50:120 kg/ha in splits.','80-120 quintals fresh','Rhizome spice crop for humid regions.','https://source.unsplash.com/featured/?turmeric'],
            ['Gram','rabi',['Black','Loamy'],10,30,250,650,'NPK 20:40:20 kg/ha with rhizobium and PSB treatment.','6-12 quintals','Pulse crop suited to residual moisture.','https://source.unsplash.com/featured/?gram'],
            ['Arhar','kharif',['Loamy','Red'],20,35,600,1000,'NPK 20:50:20 kg/ha; rhizobium seed treatment.','7-12 quintals','Long-duration pigeon pea for rainfed systems.','https://source.unsplash.com/featured/?arhar'],
            ['Sunflower','zaid',['Loamy','Black'],18,32,350,700,'NPK 60:60:40 kg/ha plus boron where deficient.','6-10 quintals','Short-duration oilseed suitable for spring and summer.','https://source.unsplash.com/featured/?sunflower'],
            ['Barley','rabi',['Loamy','Sandy'],8,25,250,550,'NPK 60:30:20 kg/ha; avoid excess nitrogen for malt quality.','16-22 quintals','Hardy cereal for low-input rabi fields.','https://source.unsplash.com/featured/?barley'],
            ['Peas','rabi',['Loamy','Clay'],10,25,350,700,'NPK 25:60:40 kg/ha; rhizobium seed treatment.','25-45 quintals green pods','Cool-season vegetable pulse with good market demand.','https://source.unsplash.com/featured/?peas'],
        ];
        foreach ($rows as $r) {
            Crop::updateOrCreate(['name' => $r[0]], ['season' => $r[1], 'soil_types' => $r[2], 'min_temp' => $r[3], 'max_temp' => $r[4], 'min_rainfall' => $r[5], 'max_rainfall' => $r[6], 'fertilizer_recommendation' => $r[7], 'yield_per_acre' => $r[8], 'description' => $r[9], 'image_url' => $r[10]]);
        }
    }
}
