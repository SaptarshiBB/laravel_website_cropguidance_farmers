<?php

namespace Database\Seeders;

use App\Models\Scheme;
use Illuminate\Database\Seeder;

class SchemeSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['PM-KISAN','Ministry of Agriculture and Farmers Welfare','Income support scheme providing direct benefit transfer to eligible farmer families.',['Rs. 6,000 per year','Direct bank transfer','Three equal installments'],'Eligible landholding farmer families with valid records, Aadhaar, and bank linkage.','https://pmkisan.gov.in',null,'https://images.unsplash.com/photo-1500382017468-9049fed747ef'],
            ['Pradhan Mantri Fasal Bima Yojana','Ministry of Agriculture and Farmers Welfare','Crop insurance against natural calamities, pests, and disease for notified crops.',['Low farmer premium','Coverage for yield loss','Localized calamity protection'],'Farmers growing notified crops in notified areas, including loanee and non-loanee farmers.','https://pmfby.gov.in',null,'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8'],
            ['PM Krishi Sinchai Yojana','Ministry of Jal Shakti','Irrigation and water-use efficiency initiative focused on Har Khet Ko Pani.',['Micro-irrigation support','Water conservation','Improved irrigation coverage'],'Farmers and groups adopting approved irrigation and water conservation interventions.','https://pmksy.gov.in',null,'https://images.unsplash.com/photo-1464226184884-fa280b87c399'],
            ['Kisan Credit Card','NABARD and Banking Partners','Short-term credit access for crop cultivation and allied activities.',['Flexible crop credit','Interest subvention','ATM enabled card'],'Farmers, tenant farmers, SHGs, and allied activity producers with KYC and crop details.','https://www.nabard.org',null,'https://images.unsplash.com/photo-1554224155-6726b3ff858f'],
            ['National Food Security Mission','Ministry of Agriculture and Farmers Welfare','Productivity enhancement for rice, wheat, pulses, coarse cereals, and nutri-cereals.',['Seed support','Demonstrations','Farm mechanization aid'],'Farmers in identified districts and crop clusters under state action plans.','https://nfsm.gov.in',null,'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'],
            ['Soil Health Card Scheme','Ministry of Agriculture and Farmers Welfare','Soil testing based nutrient recommendations for balanced fertilizer use.',['Soil nutrient report','Fertilizer recommendation','Micronutrient awareness'],'All farmers through state soil testing programs and sample collection drives.','https://soilhealth.dac.gov.in',null,'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0'],
            ['Rashtriya Krishi Vikas Yojana','Ministry of Agriculture and Farmers Welfare','State-led agriculture development program supporting innovation and infrastructure.',['State-specific projects','Infrastructure support','Innovation funding'],'Farmers and groups covered under approved state agriculture projects.','https://rkvy.nic.in',null,'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab'],
            ['eNAM','Ministry of Agriculture and Farmers Welfare','National Agriculture Market platform integrating APMC mandis for transparent trade.',['Online mandi access','Transparent price discovery','Quality based trading'],'Farmers registered through participating mandis or FPO channels.','https://www.enam.gov.in',null,'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39'],
        ];
        foreach ($rows as $r) {
            Scheme::updateOrCreate(['name' => $r[0]], ['ministry' => $r[1], 'description' => $r[2], 'benefits' => $r[3], 'eligibility' => $r[4], 'apply_url' => $r[5], 'deadline' => $r[6], 'is_active' => true, 'image_url' => $r[7]]);
        }
    }
}
