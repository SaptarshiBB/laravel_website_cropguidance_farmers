<?php

namespace App\Services;

class ChatbotService
{
    private array $patterns;

    public function __construct()
    {
        $this->patterns = [
            'loamy|best crop|crop selection' => 'Loamy soil is excellent for wheat, maize, vegetables, pulses, and sugarcane. Match the final choice with season: rice/maize/soybean in kharif, wheat/gram/mustard in rabi, and vegetables in zaid.',
            'black soil|cotton' => 'Black soil retains moisture and suits cotton, soybean, sorghum, wheat, gram, and sugarcane. Use drainage channels during heavy rainfall.',
            'sandy soil' => 'Sandy soil needs organic matter and frequent light irrigation. Groundnut, bajra, watermelon, and pulses perform well with mulching.',
            'clay soil' => 'Clay soil suits paddy and wheat but needs good leveling and drainage to avoid root suffocation.',
            'red soil' => 'Red soil benefits from compost and lime where pH is low. Groundnut, millets, pulses, and cotton are practical choices.',
            'laterite' => 'Laterite soils need organic carbon improvement. Cashew, tea, coconut, paddy, and tubers can work depending on rainfall.',
            'fertilizer|npk' => 'Use soil test results first. A general cereal plan is basal phosphorus and potassium, split nitrogen at sowing, tillering, and flowering, plus compost before land preparation.',
            'urea' => 'Apply urea in splits and avoid broadcasting before heavy rain. Mix neem-coated urea or deep place where suitable to reduce losses.',
            'dap' => 'DAP is useful as basal phosphorus near sowing, but avoid direct seed contact. Balance it with potash and organic manure.',
            'potash|mop' => 'Potash improves drought tolerance, disease resistance, grain filling, and fruit quality. Deficiency often shows leaf edge scorching.',
            'zinc' => 'Zinc deficiency appears as stunted plants and pale bands. Use zinc sulphate based on soil test or local extension guidance.',
            'compost|organic' => 'Apply well-decomposed FYM or compost before sowing. It improves moisture holding, soil biology, and nutrient buffering.',
            'irrigation|water' => 'Irrigate early morning or evening. Use soil moisture, crop stage, and weather forecast; flowering and grain filling are critical stages for many crops.',
            'drip' => 'Drip irrigation saves water and supports fertigation. It is especially useful for vegetables, sugarcane, cotton, and orchards.',
            'sprinkler' => 'Sprinklers are useful for sandy soils, pulses, oilseeds, and undulating fields, but avoid use during strong wind.',
            'rain|weather' => 'Before rain, pause fertilizer and pesticide spraying. After rain, inspect drainage, fungal symptoms, and nutrient leaching.',
            'heat|temperature' => 'Heat stress can be reduced with mulching, timely irrigation, shade nets for nurseries, and potassium nutrition.',
            'frost|cold' => 'For frost risk, irrigate lightly in evening, use smoke where locally advised, and cover nurseries with low tunnels.',
            'pest|insect' => 'Scout weekly. Use pheromone traps, yellow sticky traps, resistant varieties, clean cultivation, and spray only when economic threshold is crossed.',
            'aphid' => 'Aphids curl leaves and transmit viruses. Encourage ladybird beetles, use neem oil early, and apply recommended insecticide if colonies exceed threshold.',
            'white fly|whitefly' => 'Whitefly causes yellowing and sooty mold. Use yellow sticky traps, remove infected leaves, and rotate insecticide groups.',
            'brown plant hopper|bph' => 'Brown plant hopper in paddy causes hopper burn. Avoid excess nitrogen, drain water briefly, and use recommended systemic control if needed.',
            'army worm|fall armyworm' => 'Fall armyworm damages maize whorls. Use pheromone traps, destroy egg masses, and apply biological or recommended chemical control early.',
            'locust' => 'For locust swarms, alert agriculture officers immediately. Community-level monitoring and coordinated control are essential.',
            'blast' => 'Rice blast favors humid weather. Use resistant varieties, balanced nitrogen, and fungicide only as recommended.',
            'blight' => 'Blight spreads fast under humid conditions. Remove infected debris, avoid overhead irrigation, and follow crop-specific fungicide advice.',
            'harvest' => 'Harvest when crop reaches physiological maturity and moisture is suitable. Delayed harvest increases shattering, lodging, and quality loss.',
            'wheat harvest' => 'Wheat is ready when grains harden and straw turns golden. Harvest at about 18-20 percent grain moisture, then dry safely.',
            'paddy harvest|rice harvest' => 'Paddy is generally ready when 80-85 percent grains in the panicle are mature and golden.',
            'pm-kisan|pm kisan' => 'PM-KISAN provides income support to eligible farmer families. Check eKYC, land record linkage, and payment status on the official PM-KISAN portal.',
            'fasal bima|insurance' => 'Pradhan Mantri Fasal Bima Yojana covers notified crops against natural calamities. Enroll before the seasonal deadline through bank, CSC, or portal.',
            'kcc|credit card|loan' => 'Kisan Credit Card provides short-term crop credit. Keep land documents, identity proof, crop details, and bank account ready.',
            'soil health card' => 'Soil Health Card gives nutrient status and fertilizer recommendations. Sample soil before fertilizer application for best results.',
            'enam|market' => 'eNAM connects mandis digitally. Check quality parameters, local mandi arrivals, and price trends before sale.',
            'mustard' => 'Mustard prefers rabi season, cool weather, and well-drained loamy soil. Avoid waterlogging and monitor aphids during flowering.',
            'rice|paddy' => 'Rice needs warm weather and good water supply. Use certified seed, proper spacing, and avoid excess nitrogen to reduce pest risk.',
            'wheat' => 'Wheat needs cool rabi weather, timely sowing, and irrigation at crown root initiation, tillering, flowering, and grain filling.',
            'cotton' => 'Cotton needs warm climate, black or alluvial soils, and careful sucking pest monitoring. Avoid excessive vegetative growth.',
            'sugarcane' => 'Sugarcane needs high nutrients and water. Use set treatment, trench planting where suitable, trash mulching, and drip fertigation.',
            'maize' => 'Maize needs good drainage and nitrogen management. Watch for fall armyworm from early whorl stage.',
            'tomato' => 'Tomato performs well with staking, drip irrigation, mulching, and preventive management of blight and fruit borer.',
            'onion' => 'Onion requires nursery care, balanced potassium, and careful irrigation before bulb maturity.',
            'potato' => 'Potato needs cool weather and loose soil. Earthing-up and late blight monitoring are important.',
            'turmeric' => 'Turmeric prefers warm humid climate, raised beds, mulching, and well-drained soil rich in organic matter.',
            'chilli' => 'Chilli needs drainage, staking where needed, and monitoring for thrips, mites, and leaf curl vectors.',
            'seed treatment' => 'Seed treatment reduces seed-borne disease. Use crop-specific fungicide or bio-agent and rhizobium/PSB for pulses where advised.',
            'mulch' => 'Mulching conserves moisture, suppresses weeds, moderates soil temperature, and improves fruit cleanliness in vegetables.',
            'weed' => 'Control weeds early, especially during the first 30-45 days. Combine stale seedbed, interculture, mulching, and suitable herbicide.',
            'nursery' => 'Use raised nursery beds, treated seed, light irrigation, and insect netting to reduce early disease and vector pressure.',
            'market price|mandi price' => 'Current market price here is mock guidance: compare nearby mandis, grade produce, avoid distress sales after glut, and store safely if feasible.',
            'hello|hi|namaste' => 'Namaste. I can help with crop selection, weather, pests, fertilizers, irrigation, schemes, soil health, and harvest planning.',
        ];
    }

    public function reply(string $message): array
    {
        $text = strtolower($message);
        foreach ($this->patterns as $pattern => $answer) {
            if (preg_match('/' . $pattern . '/i', $text)) {
                return ['reply' => $answer, 'confidence' => 0.92, 'topic' => $this->topic($pattern)];
            }
        }

        return [
            'reply' => 'I can help with crop choice, fertilizer dose, pest symptoms, weather decisions, government schemes, irrigation, harvest, and soil health. Share your crop, soil, state, season, and problem for a more precise answer.',
            'confidence' => 0.62,
            'topic' => 'general',
        ];
    }

    private function topic(string $pattern): string
    {
        if (str_contains($pattern, 'pest') || str_contains($pattern, 'aphid') || str_contains($pattern, 'fly')) return 'pests';
        if (str_contains($pattern, 'scheme') || str_contains($pattern, 'kisan') || str_contains($pattern, 'kcc')) return 'schemes';
        if (str_contains($pattern, 'fertilizer') || str_contains($pattern, 'npk')) return 'fertilizers';
        if (str_contains($pattern, 'weather') || str_contains($pattern, 'rain')) return 'weather';
        return 'crops';
    }
}
