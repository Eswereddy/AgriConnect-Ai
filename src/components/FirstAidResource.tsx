import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Languages,
  AlertTriangle,
  Sun,
  ShieldAlert,
  Wrench,
  Activity,
  HeartPulse,
  Info,
  CheckCircle2,
  Sparkles,
  Filter,
  X
} from "lucide-react";

export interface EmergencyGuide {
  id?: string;
  title: string;
  description?: string;
  steps: string[];
  language: string;
  symptomsTitle?: string;
  symptoms?: string[];
  stepsTitle?: string;
  category?: "chemical" | "thermal" | "animal" | "machinery" | string;
  severity?: "High" | "Critical" | "Severe" | string;
}

// Default guides fallback populated from FarmerHealthWellness's multi-lingual emergency system
const defaultFirstAidTranslations: Record<string, {
  pesticide: Omit<EmergencyGuide, "language">;
  heatstroke: Omit<EmergencyGuide, "language">;
  snakebite: Omit<EmergencyGuide, "language">;
  eyeinjury: Omit<EmergencyGuide, "language">;
  machinery: Omit<EmergencyGuide, "language">;
}> = {
  English: {
    pesticide: {
      title: "⚠️ Pesticide Poisoning Emergency First-Aid",
      symptomsTitle: "Critical Poisoning Symptoms",
      category: "chemical",
      severity: "Critical",
      symptoms: [
        "Severe nausea, projectile vomiting, and acute abdominal cramps",
        "Extreme pupillary constriction ('pinpoint pupils') & blurred vision",
        "Excessive salivation, sweating, rapid muscle twitching, or breathing difficulty"
      ],
      stepsTitle: "Immediate Life-Saving Actions",
      steps: [
        "IMMEDIATELY move the patient to open fresh air, away from active chemical spraying.",
        "Remove all contaminated clothes, shoes, and safety gear immediately.",
        "Flush affected skin and eyes with clean running well water for a full 15-20 minutes.",
        "Keep the patient warm and lying on their side. Do NOT induce vomiting unless clinically instructed.",
        "Note the chemical brand name/active ingredient, dial 1800-412-2211, and rush to the nearest clinic."
      ]
    },
    heatstroke: {
      title: "☀️ Heat Stroke & Heat Exhaustion Core Management",
      symptomsTitle: "Heat Stroke Danger Signals",
      category: "thermal",
      severity: "Critical",
      symptoms: [
        "High body temperature (above 103°F / 39.4°C) with dry, hot, flushed skin",
        "Absence of sweat despite extreme thermal discomfort, or heavy sticky sweating",
        "Rapid pounding heart rate, severe throbbing headache, dizziness, sudden confusion, or fainting"
      ],
      stepsTitle: "Immediate Cooling Actions",
      steps: [
        "Move the worker immediately to a cool shaded grove, canopy, or air-ventilated cabin.",
        "Cool the body rapidly: wrap the torso in cold wet sheets or apply ice packs to head, neck, and armpits.",
        "If conscious and awake, give small sips of cool water containing ORS (Oral Rehydration Salts).",
        "Lay the patient flat with feet elevated to maximize blood flow back to the brain.",
        "Never leave the patient unattended. Call 108/102 immediately if consciousness fades."
      ]
    },
    snakebite: {
      title: "🐍 Snake Bite Emergency Field Response",
      symptomsTitle: "Snake Bite Danger Signals",
      category: "animal",
      severity: "Critical",
      symptoms: [
        "Two puncture fang marks, rapid swelling, and black/blue skin discoloration",
        "Intense burning pain, double vision, heavy drooping eyelids, or sweating",
        "Difficulty breathing, slurred speech, or sudden muscle paralysis"
      ],
      stepsTitle: "Immediate Emergency Steps",
      steps: [
        "Keep the patient calm and completely still. Movement spreads venom through the bloodstream faster.",
        "Do NOT slash the bite site, apply ice, or attempt to suck out the venom. These are dangerous myths!",
        "Remove any rings, tight bracelets, or watches near the bite, as swelling will occur rapidly.",
        "Gently wash the bite area with clean water. Immobilize the limb with a loose, comfortable splint at or below heart level.",
        "Transport the victim immediately to a hospital stocked with Snake Anti-Venom (SAV). Do NOT waste time with local mystics."
      ]
    },
    eyeinjury: {
      title: "👁️ Eye Exposure & Chemical Splash Guide",
      symptomsTitle: "Eye Exposure Symptoms",
      category: "chemical",
      severity: "Severe",
      symptoms: [
        "Burning sensation, intense redness, and continuous reflex tearing",
        "Inability to open the eyelid, extreme light sensitivity, or sudden blurred vision",
        "Visible dust, husk, or chemical splash particles trapped under the eyelid"
      ],
      stepsTitle: "Immediate Eye Salvage Steps",
      steps: [
        "Do NOT rub the affected eye under any circumstance. This can embed particles or spread the chemical.",
        "Hold the eyelid open with clean fingers and flush the eye continuously with clean, lukewarm water for 15 minutes.",
        "If a chemical splash occurred, let water run over the bridge of the nose and sweep outward to protect the uninjured eye.",
        "Cover the eye with a clean, soft gauze patch without applying pressure.",
        "Seek immediate ophthalmological review. Bring the label of the chemical if exposure was toxic."
      ]
    },
    machinery: {
      title: "🚜 Machinery Wound & Deep Laceration Care",
      symptomsTitle: "Severe Injury Indicators",
      category: "machinery",
      severity: "High",
      symptoms: [
        "Uncontrolled rapid arterial bleeding (spurting or bright red blood)",
        "Torn skin, deep flesh wounds, or visible underlying muscle/bone tissue",
        "Extreme sharp pain, shivering, dizziness, pale skin, or cold extremities"
      ],
      stepsTitle: "Immediate Trauma Care Steps",
      steps: [
        "Shut down the machinery immediately. Ensure the area is safe before approaching the patient.",
        "Apply direct, firm pressure on the wound using a clean cloth or sterile bandage to control heavy bleeding.",
        "Elevate the injured limb above heart level to reduce swelling and slow down the blood loss.",
        "Do NOT attempt to wash severe deep wounds or push exposed bones back. Bandage securely over them.",
        "Keep the patient warm and lying down to prevent shock. Rush to emergency surgery immediately."
      ]
    }
  },
  Hindi: {
    pesticide: {
      title: "⚠️ कीटनाशक विषाक्तता आपातकालीन प्राथमिक उपचार",
      symptomsTitle: "गंभीर विषाक्तता के लक्षण",
      category: "chemical",
      severity: "Critical",
      symptoms: [
        "गंभीर जी मिचलाना, उल्टी होना और पेट में तीव्र दर्द होना",
        "आँखों की पुतलियों का अत्यधिक सिकुड़ना ('पिनपॉइंट पुतलियाँ') और धुँधला दिखना",
        "अत्यधिक लार बहना, भारी पसीना आना, मांसपेशियों में कंपन या सांस लेने में गंभीर कठिनाई"
      ],
      stepsTitle: "तत्काल जीवन रक्षक उपाय",
      steps: [
        "मरीज को तुरंत कीटनाशक छिड़काव वाले क्षेत्र से दूर ताजी और खुली हवा में ले जाएं।",
        "रसायन से भीगे सभी दूषित कपड़ों, जूतों और सुरक्षा उपकरणों को तुरंत हटा दें।",
        "प्रभावित त्वचा या आंखों को कम से कम 15-20 मिनट तक साफ बहते पानी से अच्छी तरह धोएं।",
        "मरीज को गर्म रखें और करवट दिलाकर लिटाएं। बिना चिकित्सकीय सलाह के उल्टी करवाने का प्रयास न करें।",
        "कीटनाशक के डिब्बे या ब्रांड का नाम नोट करें, तुरंत 1800-412-2211 पर कॉल करें और नजदीकी प्राथमिक चिकित्सा केंद्र ले जाएं।"
      ]
    },
    heatstroke: {
      title: "☀️ लू लगना (हीट स्ट्रोक) और तीव्र शारीरिक थकान प्रबंधन",
      symptomsTitle: "लू लगने के खतरे के लक्षण",
      category: "thermal",
      severity: "Critical",
      symptoms: [
        "शरीर का अत्यधिक उच्च तापमान (103°F / 39.4°C से अधिक) और लाल, गर्म व सूखी त्वचा होना",
        "गंभीर गर्मी के बावजूद पसीना न आना, या अत्यधिक चिपचिपा पसीना बहना",
        "दिल की धड़कन तेज होना, सिर में तेज दर्द, चक्कर आना, अचानक भ्रम होना या बेहोशी आना"
      ],
      stepsTitle: "तत्काल शरीर को ठंडा करने के उपाय",
      steps: [
        "पीड़ित को तुरंत किसी ठंडे, घने पेड़ की छांव, तिरपाल के नीचे या हवादार कमरे में ले जाएं।",
        "शरीर को तेजी से ठंडा करें: गीली चादरों में लपेटें या सिर, गर्दन व बगल में ठंडे पानी की पट्टियां लगाएं।",
        "यदि मरीज सचेत और होश में है, तो ओआरएस (ORS) या ओआरएस घोल मिला हुआ ठंडा पानी धीरे-धीरे पिलाएं।",
        "मरीज को सीधा लिटाएं और पैरों को थोड़ा ऊपर उठाएं ताकि मस्तिष्क में रक्त प्रवाह बढ़ सके।"
      ]
    },
    snakebite: {
      title: "🐍 सर्पदंश आपातकालीन प्राथमिक चिकित्सा",
      symptomsTitle: "सांप के काटने के खतरे के लक्षण",
      category: "animal",
      severity: "Critical",
      symptoms: [
        "दंश के दो निशान, तेजी से सूजन आना, और त्वचा का काला/नीला पड़ना",
        "तीव्र जलन और दर्द होना, धुंधला या दो-दो दिखाई देना, पलकों का भारी होना या पसीना आना",
        "सांस लेने में कठिनाई, आवाज लड़खड़ाना, या अचानक मांसपेशियों में लकवा (पक्षाघात) होना"
      ],
      stepsTitle: "तत्काल आपातकालीन कदम",
      steps: [
        "मरीज को शांत रखें और बिल्कुल हिलने-डुलने न दें। हिलने-डुलने से जहर रक्तप्रवाह में तेजी से फैलता है।",
        "दंश वाली जगह पर चीरा न लगाएं, बर्फ न लगाएं, और न ही मुंह से जहर चूसने का प्रयास करें। ये खतरनाक भ्रम हैं!",
        "दंश के आसपास से अंगूठी, तंग कंगन या घड़ियां तुरंत हटा दें, क्योंकि सूजन बहुत तेजी से बढ़ेगी।",
        "दंश क्षेत्र को साफ पानी से धीरे से धोएं। अंग को दिल के स्तर पर या उससे नीचे रखते हुए एक ढीले, आरामदायक स्प्लिंट से स्थिर करें।",
        "मरीज को तुरंत ऐसे अस्पताल ले जाएं जहां स्नेक एंटी-वेनम (SAV) उपलब्ध हो। स्थानीय तांत्रिकों या झाड़-फूंक में समय बर्बाद न करें।"
      ]
    },
    eyeinjury: {
      title: "👁️ आंखों में संक्रमण और रासायनिक छिड़काव संबंधी बचाव",
      symptomsTitle: "आंँखों में रासायनिक प्रभाव के लक्षण",
      category: "chemical",
      severity: "Severe",
      symptoms: [
        "रसायन या धूल जाने के बाद आंखों में तेज जलन, अत्यधिक लाली आना और आंसू बहना",
        "आंख खोलने में भारी कठिनाई, प्रकाश के प्रति संवेदनशीलता, या अचानक धुंधलापन",
        "पलक के नीचे धूल के कण, भूसा या रासायनिक छिड़काव के महीन कणों का अटकना"
      ],
      stepsTitle: "तत्काल आंख बचाने के उपाय",
      steps: [
        "किसी भी परिस्थिति में प्रभावित आंख को न रगड़ें। रगड़ने से धूल के कण अंदर धंस सकते हैं या रसायन फैल सकता है।",
        "आंख की पलक को साफ उंगलियों से खुला रखें और कम से कम 15 मिनट तक साफ, गुनगुने पानी की लगातार धारा से धोएं।",
        "यदि रसायन का छिड़काव हुआ है, तो पानी को नाक के ऊपर से बहने दें ताकि वह दूसरी स्वस्थ आंख में न जा सके।",
        "आंख को बिना किसी दबाव के साफ, मुलायम सूती कपड़े या पट्टी से ढकें।",
        "तुरंत डॉक्टर से जांच करवाएं। यदि रासायनिक संपर्क हुआ है, तो रासायनिक डिब्बे का लेबल अपने साथ ले जाएं।"
      ]
    },
    machinery: {
      title: "🚜 कृषि उपकरण / मशीनरी से चोट लगना और गहरे घाव का उपचार",
      symptomsTitle: "गंभीर मशीनरी आघात के लक्षण",
      category: "machinery",
      severity: "High",
      symptoms: [
        "अनियंत्रित तेज रक्तस्राव (चमकीले लाल रंग के खून के फुहारे या तेजी से बहना)",
        "फटी हुई त्वचा, गहरा घाव या आंतरिक मांसपेशियों/हद्वियों का प्रत्यक्ष दिखाई देना",
        "असहनीय दर्द, कंपकंपी छूटना, चक्कर आना, पीली त्वचा या हाथ-पैरों का ठंडा पड़ना"
      ],
      stepsTitle: "तत्काल आघात प्रबंधन कदम",
      steps: [
        "मशीनरी को तुरंत बंद करें। मरीज के पास जाने से पहले सुनिश्चित करें कि वहां कोई खतरा न हो।",
        "भारी रक्तस्राव को नियंत्रित करने के लिए साफ कपड़े या बाँझ पट्टी का उपयोग करके घाव पर सीधा, मजबूत दबाव डालें।",
        "सूजन कम करने और रक्तस्राव को धीमा करने के लिए घायल अंग को दिल के स्तर से ऊपर उठाएं।",
        "गहरे घावों को धोने का प्रयास न करें और न ही दिखाई देने वाली हड्डियों को अंदर धकेलें। उनके ऊपर सुरक्षित रूप से पट्टी बांधें।",
        "सदमे (Shock) से बचाने के लिए मरीज को गर्म रखें और सीधा लिटाएं। तुरंत नजदीकी अस्पताल ले जाएं।"
      ]
    }
  },
  Telugu: {
    pesticide: {
      title: "⚠️ పురుగుల మందు విషప్రభావం - అత్యవసర ప్రథమ చికిత్స",
      symptomsTitle: "తీవ్రమైన విషప్రభావ లక్షణాలు",
      category: "chemical",
      severity: "Critical",
      symptoms: [
        "తీవ్రమైన కడుపులో తిప్పడం, వాంతులు మరియు విపరీతమైన కడుపు నొప్పి",
        "కంటిపాపలు బాగా చిన్నవిగా కావడం ('పిన్‌పాయింట్ ప్యూపిల్స్') మరియు చూపు మసకబారడం",
        "నోటి నుండి అధికంగా లాలాజలం ఊరడం, విపరీతమైన చెమటలు, కండరాల వణుకు లేదా శ్వాస తీసుకోవడంలో ఇబ్బంది"
      ],
      stepsTitle: "తక్షణ ప్రాణ రక్షణ చర్యలు",
      steps: [
        "బాధితుడిని వెంటనే పురుగుల మందు చల్లుతున్న ప్రాంతం నుండి దూరంగా, స్వచ్ఛమైన గాలి వచ్చే చోటికి తరలించండి.",
        "రసాయనం అంటుకున్న దుస్తులు, బూట్లు మరియు రక్షణ సాధనాలను వెంటనే తొలగించండి.",
        "బాధిత చర్మాన్ని మరియు కళ్లను కనీసం 15-20 నిమిషాల పాటు శుభ్రమైన నీటితో బాగా కడగాలి.",
        "బాధితుడికి వెచ్చదనం కల్పించి, పక్కకు తిప్పి పడుకోబెట్టండి. వైద్యుల సలహా లేకుండా వాంతులు చేయించవద్దు.",
        "పురుగుల మందు బ్రాండ్ పేరు లేదా రసాయనాన్ని గమనించి, 1800-412-2211 కి కాల్ చేసి వెంటనే ఆసుపత్రికి తరలించండి."
      ]
    },
    heatstroke: {
      title: "☀️ వడదెబ్బ (హీట్ స్ట్రోక్) తక్షణ నివారణ & ఉపశమన చర్యలు",
      symptomsTitle: "వడదెబ్బ ప్రమాద సూచికలు",
      category: "thermal",
      severity: "Critical",
      symptoms: [
        "విపరీతమైన జ్వరం (103°F / 39.4°C కంటే ఎక్కువ) మరియు ఎర్రబడి వేడిగా మారిన చర్మం",
        "తీవ్రమైన ఎండ ఉన్నప్పటికీ చెమట రాకపోవడం లేదా విపరీతంగా అంటుకునే చెమట పట్టడం",
        "గుండె వేగంగా కొట్టుకోవడం, తీవ్రమైన తలనొప్పి, కళ్లు తిరగడం, అకస్మాత్తుగా స్పృహ కోల్పోవడం"
      ],
      stepsTitle: "తక్షణ ఉపశమన చర్యలు",
      steps: [
        "బాధితుడిని వెంటనే చల్లని నీడ ఉన్న చెట్ల గుంపు కిందకు లేదా గాలి తగిలే గదిలోకి మార్చండి.",
        "శరీరాన్ని వేగంగా చల్లబరచండి: తడి గుడ్డతో శరీరాన్ని చుట్టడం లేదా తల, మెడ మరియు చంకలలో ఐస్ ప్యాక్‌లు ఉంచండి.",
        "బాధితుడు స్పృహలో ఉంటే, కొద్దికొద్దిగా ORS (ఓరల్ రీహైడ్రేషన్ సాల్ట్స్) కలిపిన చల్లని నీటిని తాగించండి.",
        "మెదడుకు రక్త ప్రసరణ పెంచడానికి బాధితుడిని వెల్లకిలా పడుకోబెట్టి కాళ్లను కొద్దిగా పైకి లేపండి.",
        "బాధితుడిని ఎట్టి పరిస్థితుల్లోనూ ఒంటరిగా వదిలేయవద్దు. పరిస్థితి విషమిస్తే వెంటనే 108/102 కి కాల్ చేయండి."
      ]
    },
    snakebite: {
      title: "🐍 పాము కాటు అత్యవసర ప్రథమ చికిత్స",
      symptomsTitle: "పాము కాటు ప్రమాద లక్షణాలు",
      category: "animal",
      severity: "Critical",
      symptoms: [
        "రెండు దంతాల గుర్తులు, వేగంగా వాపు రావడం, చర్మం నలుపు లేదా నీలం రంగులోకి మారడం",
        "విపరీతమైన మంటతో కూడిన నొప్పి, చూపు మసకబారడం, రెప్పలు వాలడం లేదా విపరీతంగా చెమట పట్టడం",
        "శ్వాస తీసుకోవడం కష్టమవడం, మాటలు తడబడడం లేదా కండరాలు అకస్మాత్తుగా పక్షవాతానికి గురికావడం"
      ],
      stepsTitle: "తక్షణ అత్యవసర చర్యలు",
      steps: [
        "బాధితుడిని ప్రశాంతంగా ఉంచి, అస్సలు కదలనివ్వకండి. కదలడం వల్ల విషం శరీరంలో త్వరగా వ్యాపిస్తుంది.",
        "కాటు వేసిన చోట బ్లేడుతో కోయడం, ఐస్ పెట్టడం లేదా నోటితో విషం పీల్చడం వంటి పనులు చేయవద్దు. ఇవి చాలా ప్రమాదకరం!",
        "వాపు వచ్చే అవకాశం ఉన్నందున చేతి వేళ్లకు ఉన్న ఉంగరాలు, గాజులు, గడియారాలను వెంటనే తొలగించండి.",
        "కాటు వేసిన చోట శుభ్రమైన నీటితో మెల్లగా కడగాలి. చేతిని లేదా కాలును గుండె కంటే తక్కువ ఎత్తులో ఉంచి కదలకుండా కట్టెతో సపోర్ట్ ఇవ్వండి.",
        "బాధితుడిని వెంటనే యాంటీ స్నేక్ వెనమ్ (SAV) అందుబాటులో ఉన్న ఆసుపత్రికి తరలించండి. నాటు వైద్యం కోసం సమయం వృధా చేయకండి."
      ]
    },
    eyeinjury: {
      title: "👁️ కంటి అలర్జీలు & రసాయన ప్రభావాల నివారణ",
      symptomsTitle: "కంటిలో రసాయన అలర్జీల లక్షణాలు",
      category: "chemical",
      severity: "Severe",
      symptoms: [
        "కంటిలో రసాయనాలు లేదా దుమ్ము పడినప్పుడు కళ్లు మండడం, తీవ్రమైన ఎరుపు మరియు విపరీతంగా కన్నీళ్లు కారడం",
        "కనురెప్పలు తెరవలేకపోవడం, వెలుతురు చూడలేకపోవడం లేదా అకస్మాత్తుగా చూపు మసకబారడం",
        "కనురెప్ప కింద దుమ్ము కణాలు, పొట్టు లేదా రసాయన చుక్కలు నిలిచిపోవడం"
      ],
      stepsTitle: "తక్షణ కంటి సంరక్షణ చర్యలు",
      steps: [
        "ఎట్టి పరిస్థితుల్లోనూ కంటిని నలపవద్దు. నలపడం వల్ల దుమ్ము కణాలు లోపలికి చొచ్చుకుపోతాయి లేదా రసాయనం వ్యాపిస్తుంది.",
        "కనురెప్పను శుభ్రమైన వేళ్లతో తెరిచి పట్టుకుని, కనీసం 15 నిమిషాల పాటు శుభ్రమైన, గోరువెచ్చని నీటితో కంటిని నిరంతరం కడగాలి.",
        "రసాయనం పడితే, నీటిని ముక్కు వైపు నుండి కంటి వెలుపలికి పోయేలా కడగాలి, దీనివల్ల మంచి కంటికి రసాయనం అంటుకోదు.",
        "ఎలాంటి ఒత్తిడి తగలకుండా కంటిని శుభ్రమైన, మెత్తటి గుడ్డతో మూసి ఉంచండి.",
        "వెంటనే కంటి వైద్యుడి వద్దకు తీసుకెళ్లండి. విషకూరిత రసాయనం పడి ఉంటే, ఆ రసాయన డబ్బా లేబుల్‌ను వెంట తీసుకెళ్లండి."
      ]
    },
    machinery: {
      title: "🚜 వ్యవసాయ యంత్రాల గాయాలు & తీవ్ర రక్తస్రావం ప్రథమ చికిత్స",
      symptomsTitle: "తీవ్రమైన యంత్ర గాయాల సూచికలు",
      category: "machinery",
      severity: "High",
      symptoms: [
        "నియంత్రించలేని వేగవంతమైన రక్తస్రావం (ప్రకాశవంతమైన ఎరుపు రంగు రక్తం ధారగా చిమ్మడం)",
        "చర్మం చీరుకుపోవడం, లోతైన గాయం కావడం లేదా లోపలి కండరాలు/ఎముకలు బయటకు కనిపించడం",
        "విపరీతమైన నొప్పి, వణుకు, కళ్లు తిరగడం, ముఖం తెల్లబారడం లేదా కాళ్ళు చేతులు చల్లబడడం"
      ],
      stepsTitle: "తక్షణ అత్యవసర గాయాల నివారణ",
      steps: [
        "యంత్రాన్ని వెంటనే ఆపివేయండి. బాధితుడి వద్దకు వెళ్లే ముందు ఆ ప్రాంతం సురక్షితంగా ఉందని నిర్ధారించుకోండి.",
        "రక్తస్రావాన్ని ఆపడానికి శుభ్రమైన గుడ్డ లేదా స్టెరైల్ బ్యాండేజీతో గాయంపై నేరుగా గట్టిగా నొక్కండి.",
        "వాపు తగ్గించడానికి మరియు రక్తస్రావాన్ని అరికట్టడానికి గాయపడిన చేతిని లేదా కాలును గుండె కంటే పైకి లేపండి.",
        "తీవ్రమైన లోతైన గాయాలను కడగడానికి ప్రయత్నించవద్దు లేదా బయటకు వచ్చిన ఎముకలను లోపలికి నెట్టవద్దు. వాటిపై మెల్లగా బ్యాండేజీ కట్టండి.",
        "బాధితుడు షాక్‌కు గురికాకుండా వెచ్చగా ఉంచి పడుకోబెట్టండి. వెంటనే అత్యవసర శస్త్రచికిత్స విభాగానికి తరలించండి."
      ]
    }
  },
  Punjabi: {
    pesticide: {
      title: "⚠️ ਕੀਟਨਾਸ਼ਕ ਜ਼ਹਿਰ ਚੜ੍ਹਨ 'ਤੇ ਐਮਰਜੈਂਸੀ ਮੁਢਲੀ ਸਹਾਇਤਾ",
      symptomsTitle: "ਗੰਭੀਰ ਜ਼ਹਿਰ ਦੇ ਲੱਛਣ",
      category: "chemical",
      severity: "Critical",
      symptoms: [
        "ਬਹੁਤ ਜ਼ਿਆਦਾ ਜੀਅ ਕੱਚਾ ਹੋਣਾ, ਉਲਟੀਆਂ ਅਤੇ ਪੇਟ ਵਿੱਚ ਤੇਜ਼ ਮਰੋੜ",
        "ਅੱਖਾਂ ਦੀਆਂ ਪੁਤਲੀਆਂ ਦਾ ਬਹੁਤ ਸੁੰਗੜਨਾ ਅਤੇ ਧੁੰਦਲਾ ਦਿਖਾਈ ਦੇਣਾ",
        "ਬਹੁਤ ਜ਼ਿਆਦਾ ਲਾਰ ਵਗਣਾ, ਪਸੀਨਾ ਆਉਣਾ, ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਕੰਬਣਾ ਜਾਂ ਸਾਹ ਲੈਣ ਵਿੱਚ ਭਾਰੀ ਤਕਲੀਫ਼"
      ],
      stepsTitle: "ਤੁਰੰਤ ਜਾਨ-ਬਚਾਊ ਕਦਮ",
      steps: [
        "ਮਰੀਜ਼ ਨੂੰ ਤੁਰੰਤ ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ ਵਾਲੇ ਖੇਤਰ ਤੋਂ ਦੂਰ ਖੁੱਲ੍ਹੀ ਅਤੇ ਤਾਜ਼ੀ ਹਵਾ ਵਿੱਚ ਲੈ ਜਾਓ।",
        "ਜ਼ਹਿਰੀਲੀ ਸਪਰੇਅ ਨਾਲ ਦੂਸ਼ਿਤ ਹੋਏ ਸਾਰੇ ਕੱਪੜੇ, ਜੁੱਤੇ ਅਤੇ ਸੁਰੱਖਿਆ ਗੀਅਰ ਤੁਰੰਤ ਉਤਾਰ ਦਿਓ।",
        "ਪ੍ਰਭਾਵਿਤ ਚਮੜੀ ਅਤੇ ਅੱਖਾਂ ਨੂੰ ਘੱਟੋ-ਘੱਟ 15-20 ਮਿੰਟ ਤੱਕ ਸਾਫ਼ ਪਾਣੀ ਦੀ ਤੇਜ਼ ਧਾਰ ਨਾਲ ਧੋਵੋ।",
        "ਮਰੀਜ਼ ਨੂੰ ਨਿੱਘਾ ਅਤੇ ਕਰਵਟ ਦਿਵਾ ਕੇ ਲਿਟਾਓ; ਬਿਨਾਂ ਡਾਕਟਰੀ ਸਲਾਹ ਦੇ ਉਲਟੀ ਨਾ ਕਰਵਾਓ।",
        "ਕੀਟਨਾਸ਼ਕ ਦੇ ਡੱਬੇ ਦੇ ਬ੍ਰਾਂਡ ਦਾ ਨਾਮ ਨੋਟ ਕਰੋ, ਤੁਰੰਤ 1800-412-2211 'ਤੇ ਫ਼ੋਨ ਕਰੋ ਅਤੇ ਨਜ਼ਦੀਕੀ ਕਲੀਨਿਕ ਲੈ ਜਾਓ।"
      ]
    },
    heatstroke: {
      title: "☀️ ਲੂ ਲੱਗਣ (ਹੀਟ ਸਟ੍ਰੋਕ) ਦਾ ਤੁਰੰਤ ਪ੍ਰਬੰਧਨ",
      symptomsTitle: "ਲੂ ਲੱਗਣ ਦੇ ਖ਼ਤਰਨਾਕ ਲੱਛਣ",
      category: "thermal",
      severity: "Critical",
      symptoms: [
        "ਸਰੀਰ ਦਾ ਤਾਪਮਾਨ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੋਣਾ (103°F / 39.4°C ਤੋਂ ਉੱਪਰ) ਅਤੇ ਲਾਲ, ਗਰਮ, ਖੁਸ਼ਕ ਚਮੜੀ",
        "ਤੇਜ਼ ਗਰਮੀ ਦੇ ਬਾਵਜੂਦ ਪਸੀਨਾ ਨਾ ਆਉਣਾ, ਜਾਂ ਬਹੁਤ ਚਿਪਚਿਪਾ ਪਸੀਨਾ ਆਉਣਾ",
        "ਤੇਜ਼ ਧੜਕਣ, ਤੇਜ਼ ਸਿਰਦਰਦ, ਚੱਕਰ ਆਉਣੇ, ਅਚਾਨਕ ਭੁਲੇਖਾ ਪੈਣਾ ਜਾਂ ਬੇਹੋਸ਼ ਹੋ ਜਾਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਠੰਢਕ ਪਹੁੰਚਾਉਣ ਦੇ ਤਰੀਕੇ",
      steps: [
        "ਪੀੜਤ ਨੂੰ ਤੁਰੰਤ ਕਿਸੇ ਠੰਢੇ, ਸੰਘਣੇ ਛਾਂਦਾਰ ਰੁੱਖ ਹੇਠਾਂ ਜਾਂ ਹਵਾਦਾਰ ਕਮਰੇ ਵਿੱਚ ਲੈ ਜਾਓ।",
        "ਸਰੀਰ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਠੰਢਾ ਕਰੋ: ਗਿੱਲੀਆਂ ਚਾਦਰਾਂ ਵਿੱਚ ਲਪੇਟੋ ਜਾਂ ਸਿਰ, ਗਰਦਨ ਅਤੇ ਕੱਛਾਂ ਵਿੱਚ ਬਰਫ਼ ਰੱਖੋ।",
        "ਜੇਕਰ ਮਰੀਜ਼ ਹੋਸ਼ ਵਿੱਚ ਹੋਵੇ, ਤਾਂ ਓ.ਆਰ.ਐੱਸ. (ORS) ਮਿਲਿਆ ਹੋਇਆ ਠੰਢਾ ਪਾਣੀ ਹੌਲੀ-ਹੌਲੀ ਪਿਲਾਓ।",
        "ਮਰੀਜ਼ ਨੂੰ ਸਿੱਧਾ ਲਿਟਾਓ ਅਤੇ ਪੈਰਾਂ ਨੂੰ ਥੋੜ੍ਹਾ ਉੱਪਰ ਚੁੱਕੋ ਤਾਂ ਜੋ ਦਿਮਾਗ ਤੱਕ ਖੂਨ ਦਾ ਦੌਰਾ ਸੁਚਾਰੂ ਰਹੇ।",
        "ਮਰੀਜ਼ ਨੂੰ ਕਦੇ ਵੀ ਇਕੱਲਾ ਨਾ ਛੱਡੋ। ਜੇਕਰ ਹਾਲਤ ਗੰਭੀਰ ਹੁੰਦੀ ਹੈ ਤਾਂ ਤੁਰੰਤ 108/102 'ਤੇ ਫ਼ੋਨ ਕਰੋ।"
      ]
    },
    snakebite: {
      title: "🐍 ਸੱਪ ਦੇ ਡੰਗਣ 'ਤੇ ਐਮਰਜੈਂਸੀ ਫੀਲਡ ਪ੍ਰਤੀਕਿਰਿਆ",
      symptomsTitle: "ਸੱਪ ਦੇ ਡੰਗਣ ਦੇ ਖ਼ਤਰਨਾਕ ਸੰਕੇਤ",
      category: "animal",
      severity: "Critical",
      symptoms: [
        "ਦੰਦਾਂ ਦੇ ਦੋ ਨਿਸ਼ਾਨ, ਤੇਜ਼ੀ ਨਾਲ ਸੋਜ ਆਉਣਾ, ਚਮੜੀ ਦਾ ਕਾਲਾ ਜਾਂ ਨੀλα ਰੰਗ ਬదਲਣਾ",
        "ਤੇਜ਼ ਜਲਣ ਵਾਲਾ ਦਰਦ, ਦੋਹਰਾ ਦਿਖਣਾ, ਪਲਕਾਂ ਦਾ ਭਾਰੀ ਹੋਣਾ ਜਾਂ ਪਸੀਨਾ ਆਉਣਾ",
        "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ, ਬੋਲਣ ਵਿੱਚ ਰੁਕਾਵਟ ਜਾਂ ਅਚਾਨਕ ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਅਧਰੰਗ ਹੋਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਲੋੜੀਂਦੇ ਕਦਮ",
      steps: [
        "ਮਰੀਜ਼ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖੋ ਅਤੇ ਬਿਲਕੁਲ ਹਿੱਲਣ-ਜੁੱਲਣ ਨਾ ਦਿਓ। ਹਰਕਤ ਕਰਨ ਨਾਲ ਜ਼ਹਿਰ ਸਰੀਰ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਦਾ ਹੈ।",
        "ਡੰਗ ਵਾਲੀ ਥਾਂ 'ਤੇ ਚੀਰਾ ਨਾ ਲਗਾਓ, ਬਰਫ਼ ਨਾ ਲਗਾਓ, ਅਤੇ ਨਾ ਹੀ ਮੂੰਹ ਨਾਲ ਜ਼ਹਿਰ ਚੂਸਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਇਹ ਖ਼ਤਰਨਾਕ ਅਫ਼ਵਾਹਾਂ ਹਨ!",
        "ਡੰਗ ਵਾਲੇ ਅੰਗ ਤੋਂ ਅੰਗੂਠੀ, ਕੜਾ ਜਾਂ ਘੜੀ ਤੁਰੰਤ ਉਤਾਰ ਦਿਓ ਕਿਉਂਕਿ ਸੋਜ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਆਵੇਗੀ।",
        "ਡੰਗ ਵਾਲੀ ਥਾਂ ਨੂੰ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ ਹੌਲੀ-ਹੌਲੀ ਸਾਫ਼ ਕਰੋ। ਪ੍ਰਭావਿਤ ਅੰਗ ਨੂੰ ਦਿਲ ਦੇ ਪੱਧਰ ਤੋਂ ਨੀਵਾਂ ਰੱਖੋ ਅਤੇ ਸਪਲਿੰਟ ਨਾਲ ਸਥਿਰ ਕਰੋ।",
        "ਮਰੀਜ਼ ਨੂੰ ਤੁਰੰਤ ਅਜਿਹే ਹਸਪਤਾਲ ਲੈ ਕੇ ਜਾਓ ਜਿੱਥੇ ਐਂਟੀ-ਸਨੇਕ ਵੈਨਮ (SAV) ਉਪਲਬਧ ਹੋਵੇ। ਝਾੜ-ਫੂਕ ਵਿੱਚ ਸਮਾਂ ਬਰਬਾਦ ਨਾ ਕਰੋ।"
      ]
    },
    eyeinjury: {
      title: "👁️ ਅੱਖ ਵਿੱਚ ਕੈਮੀਕਲ ਪੈਣ ਜਾਂ ਮਿੱਟੀ ਜਾਣ 'ਤੇ ਗਾਈਡ",
      symptomsTitle: "ਅੱਖਾਂ ਵਿੱਚ ਕੈਮੀਕਲ ਦੇ ਅਸਰ ਦੇ ਲੱਛਣ",
      category: "chemical",
      severity: "Severe",
      symptoms: [
        "ਕੈਮੀਕਲ ਜਾਂ ਮਿੱਟੀ ਜਾਣ ਤੋਂ ਬਾਅਦ ਅੱਖਾਂ ਵਿੱਚ ਤੇਜ਼ ਜਲਣ, ਲਾਲੀ, ਅਤੇ ਲਗਾਤਾਰ ਹੰਝూ ਆਉਣਾ",
        "ਅੱਖ ਖੋਲ੍ਹਣ ਵਿੱਚ ਭਾਰੀ ਮੁਸ਼ਕਲ, ਰੋਸ਼ਨੀ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ, ਜਾਂ ਅਚਾਨਕ ਧੁੰਦਲਾਪਣ",
        "ਪਲਕ ਦੇ ਹੇਠਾਂ ਮਿੱਟੀ ਦੇ ਕਣ, ਤੂੜੀ ਜਾਂ ਕੈਮੀਕਲ ਦੀਆਂ ਬੂੰਦਾਂ ਅਟਕ ਜਾਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਅੱਖ ਬਚਾਉਣ ਦੇ ਤਰੀਕੇ",
      steps: [
        "ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਪ੍ਰਭਾਵਿਤ ਅੱਖ ਨੂੰ ਨਾ ਰਗੜੋ। ਰਗੜਨ ਨਾਲ ਮਿੱਟੀ ਦੇ ਕਣ ਅੰਦਰ ਧੱਸ ਸਕਦੇ ਹਨ ਜਾਂ ਕੈਮੀਕਲ ਫੈਲ ਸਕਦਾ ਹੈ।",
        "ਅੱਖ ਦੀ ਪਲਕ ਨੂੰ ਸਾਫ਼ ਉਂਗਲਾਂ ਨਾਲ ਖੁੱਲ੍ਹਾ ਰੱਖੋ ਅਤੇ ਘੱਟੋ-ਘੱਟ 15 ਮਿੰਟ ਤੱਕ ਸਾਫ਼, ਕੋਸੇ ਪਾਣੀ ਦੀ ਲਗਾਤਾਰ ਧਾਰ ਨਾਲ ਧੋਵੋ।",
        "ਜੇਕਰ ਕੈਮੀਕਲ ਪਿਆ ਹੈ, ਤਾਂ ਪਾਣੀ ਨੂੰ ਨੱਕ ਦੇ ਉੱਪਰੋਂ ਵਹਿਣ ਦਿਓ ਤਾਂ ਜੋ ਦੂਜੀ ਤੰਦਰੁਸਤ ਅੱਖ ਬਚੀ ਰਹੇ।",
        "ਬਿਨਾਂ ਕੋਈ ਦਬਾਅ ਪਾਏ ਅੱਖ ਨੂੰ ਸਾਫ਼, ਨਰਮ ਪੱਟੀ ਨਾਲ ਢੱਕੋ।",
        "ਤੁਰੰਤ ਅੱਖਾਂ ਦੇ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ। ਜੇਕਰ ਕੈਮੀਕਲ ਜ਼ਹਿਰੀਲਾ ਸੀ, ਤਾਂ ਉਸ ਦਾ ਲੇਬਲ ਆਪਣੇ ਨਾਲ ਲੈ ਕੇ ਜਾਓ।"
      ]
    },
    machinery: {
      title: "🚜 ਖੇਤੀਬਾੜੀ ਮਸ਼ੀਨਰੀ ਨਾਲ ਸੱਟ ਲੱਗਣ 'ਤੇ ਮੁਢਲੀ ਸਹਾਇਤਾ",
      symptomsTitle: "ਗੰਭੀਰ ਮਸ਼ੀਨਰੀ ਸੱਟ ਦੇ ਲੱਛਣ",
      category: "machinery",
      severity: "High",
      symptoms: [
        "ਤੇਜ਼ ਅਤੇ ਬੇਕਾਬੂ ਖੂਨ ਵਹਿਣਾ (ਚਮਕਦਾਰ ਲਾਲ ਰੰਗ ਦੇ ਖੂਨ ਦੇ ਫੁਹਾਰੇ ਚੱਲਣਾ)",
        "ਪਾਟੀ ਹੋਈ ਚਮੜੀ, ਡੂੰਘਾ ਜ਼ਖ਼ਮ ਜਾਂ ਅੰਦਰੂਨੀ ਮਾਸਪੇਸ਼ੀਆਂ/ਹੱਡੀਆਂ ਦਾ ਦਿਖਾਈ ਦੇਣਾ",
        "ਅਸਹਿ ਦਰਦ, ਕੰਬਣੀ, ਚੱਕਰ ਆਉਣੇ, ਚਮੜੀ ਦਾ ਪੀਲਾ ਹੋਣਾ ਜਾਂ ਹੱਥ-ਪੈਰ ਠੰਢੇ ਹੋਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਟਰਾਮਾ ਕੇਅਰ ਕਦਮ",
      steps: [
        "ਮਸ਼ੀਨਰੀ ਨੂੰ ਤੁਰੰਤ ਬੰਦ ਕਰੋ। ਮਰੀਜ਼ ਕੋਲ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਉਹ ਥਾਂ ਸੁਰੱਖਿਅਤ ਹੈ।",
        "ਤੇਜ਼ ਖੂਨ ਵਗਣ ਨੂੰ ਰੋਕਣ ਲਈ ਸਾਫ਼ ਕੱਪੜੇ ਜਾਂ ਪੱਟੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਜ਼ਖ਼ਮ 'ਤੇ ਸਿੱਧਾ, ਮਜ਼ਬੂਤ ਦਬਾਅ ਪਾਓ।",
        "ਸੋਜ ਨੂੰ ਘੱਟ ਕਰਨ ਅਤੇ ਖੂਨ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਹੌਲੀ ਕਰਨ ਲਈ ਜ਼ਖ਼ਮੀ ਅੰਗ ਨੂੰ ਦਿਲ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਚੁੱਕੋ।",
        "ਡੂੰਘੇ ਜ਼ਖ਼ਮਾਂ ਨੂੰ ਧੋਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਨਾ ਕਰੋ ਅਤੇ ਨੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਹੱਡੀਆਂ ਨੂੰ ਅੰਦਰ ਧੱਕੋ। ਉਹਨਾਂ ਉੱਤੇ ਪੱਟੀ ਲਪੇਟੋ।",
        "ਸਦਮੇ (Shock) ਤੋਂ ਬਚਾਉਣ ਲਈ ਮਰੀਜ਼ ਨੂੰ ਨਿੱਘਾ ਰੱਖੋ ਅਤੇ ਸਿੱਧਾ ਲਿਟาਓ। ਤੁਰੰਤ ਹਸਪਤਾਲ ਲੈ ਕੇ ਜਾਓ।"
      ]
    }
  }
};

const flatDefaultGuides: EmergencyGuide[] = Object.entries(defaultFirstAidTranslations).flatMap(
  ([lang, langGuides]) =>
    Object.entries(langGuides).map(([key, val]) => ({
      ...val,
      id: `${lang.toLowerCase()}-${key}`,
      description: val.symptoms ? val.symptoms.join(". ") : "",
      language: lang
    }))
);

interface FirstAidResourceProps {
  guides?: EmergencyGuide[];
}

export const FirstAidResource: React.FC<FirstAidResourceProps> = ({
  guides = flatDefaultGuides
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

  // Extract all unique languages from the guides array
  const languages = useMemo(() => {
    const langs = new Set<string>();
    guides.forEach((g) => {
      if (g.language) langs.add(g.language);
    });
    // Ensure "English" comes first, then sort alphabetically
    const sorted = Array.from(langs).sort();
    if (sorted.includes("English")) {
      return ["English", ...sorted.filter((l) => l !== "English")];
    }
    return sorted;
  }, [guides]);

  // Handle auto-switching language when selectedLanguage is no longer in the guides list
  React.useEffect(() => {
    if (languages.length > 0 && !languages.includes(selectedLanguage)) {
      setSelectedLanguage(languages[0]);
    }
  }, [languages, selectedLanguage]);

  // Categories available based on actual data
  const categories = ["all", "chemical", "thermal", "animal", "machinery"];
  // Severities available
  const severities = ["all", "Critical", "Severe", "High"];

  // Pre-process guides to ensure they always have an ID and a description
  const processedGuides = useMemo(() => {
    return guides.map((g, index) => ({
      ...g,
      id: g.id || `${g.language.toLowerCase()}-${g.category || "cat"}-${index}`,
      description: g.description || (g.symptoms ? g.symptoms.join(". ") : "")
    }));
  }, [guides]);

  // Filter guides based on selected language, category, severity and search term
  const filteredGuides = useMemo(() => {
    return processedGuides.filter((g) => {
      // 1. Language Match
      if (g.language !== selectedLanguage) return false;

      // 2. Category Match
      if (selectedCategory !== "all" && g.category !== selectedCategory) return false;

      // 3. Severity Match
      if (selectedSeverity !== "all" && g.severity !== selectedSeverity) return false;

      // 4. Search text match (case-insensitive)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const inTitle = g.title.toLowerCase().includes(query);
        const inDescription = g.description ? g.description.toLowerCase().includes(query) : false;
        const inSymptomsTitle = g.symptomsTitle ? g.symptomsTitle.toLowerCase().includes(query) : false;
        const inStepsTitle = g.stepsTitle ? g.stepsTitle.toLowerCase().includes(query) : false;
        const inSymptoms = g.symptoms ? g.symptoms.some((s) => s.toLowerCase().includes(query)) : false;
        const inSteps = g.steps ? g.steps.some((s) => s.toLowerCase().includes(query)) : false;
        return inTitle || inDescription || inSymptomsTitle || inStepsTitle || inSymptoms || inSteps;
      }

      return true;
    });
  }, [processedGuides, selectedLanguage, selectedCategory, selectedSeverity, searchTerm]);

  // Dynamic colors and icon configurations
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "chemical":
        return {
          bg: "bg-rose-50/80 border-rose-200 hover:border-rose-300",
          accentText: "text-rose-900",
          iconColor: "text-rose-600",
          badge: "bg-rose-100 text-rose-800 border-rose-200",
          icon: AlertTriangle,
          themeColor: "rose"
        };
      case "thermal":
        return {
          bg: "bg-amber-50/80 border-amber-200 hover:border-amber-300",
          accentText: "text-amber-900",
          iconColor: "text-amber-600",
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Sun,
          themeColor: "amber"
        };
      case "animal":
        return {
          bg: "bg-purple-50/80 border-purple-200 hover:border-purple-300",
          accentText: "text-purple-900",
          iconColor: "text-purple-600",
          badge: "bg-purple-100 text-purple-800 border-purple-200",
          icon: ShieldAlert,
          themeColor: "purple"
        };
      case "machinery":
        return {
          bg: "bg-blue-50/80 border-blue-200 hover:border-blue-300",
          accentText: "text-blue-900",
          iconColor: "text-blue-600",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Wrench,
          themeColor: "blue"
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 hover:border-slate-300",
          accentText: "text-slate-900",
          iconColor: "text-slate-600",
          badge: "bg-slate-100 text-slate-800 border-slate-200",
          icon: Activity,
          themeColor: "slate"
        };
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white shadow-sm ring-1 ring-red-600/20";
      case "Severe":
        return "bg-amber-500 text-white shadow-sm ring-1 ring-amber-600/20";
      case "High":
        return "bg-blue-500 text-white shadow-sm ring-1 ring-blue-600/20";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSeverity("all");
  };

  return (
    <div className="w-full space-y-6" id="first-aid-resource-container">
      {/* Search & Filter Bar Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4" id="first-aid-filter-panel">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Left: Language Selection Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
              <Languages className="h-4 w-4 text-emerald-600" />
              <span>Language:</span>
            </div>
            <div className="relative">
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setExpandedCardIndex(null);
                }}
                className="appearance-none bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-2 pl-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all cursor-pointer shadow-sm"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Right: Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="first-aid-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guide, symptom, or treatment..."
              className="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category & Severity Badges Selectors */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Category:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`cat-btn-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All Emergency Types" : cat}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />

          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1">
            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
            <span>Severity:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {severities.map((sev) => (
              <button
                key={sev}
                id={`sev-btn-${sev}`}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSeverity === sev
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {sev === "all" ? "All Severities" : sev}
              </button>
            ))}
          </div>

          {(selectedCategory !== "all" || selectedSeverity !== "all" || searchTerm !== "") && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout of Emergency Guides */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        id="first-aid-guides-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredGuides.map((guide, index) => {
            const theme = getCategoryTheme(guide.category);
            const Icon = theme.icon;
            const isExpanded = expandedCardIndex === index;

            return (
              <motion.div
                key={`${guide.title}-${guide.language}`}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 ${theme.bg} text-slate-800 shadow-sm relative overflow-hidden`}
                id={`guide-card-${index}`}
              >
                {/* Visual Category Background Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full bg-current opacity-[0.03] ${theme.iconColor}`} />

                {/* Card Header */}
                <div className="flex items-start gap-3 pb-3 border-b border-black/[0.08] relative">
                  <div className={`p-2 rounded-xl bg-white shadow-sm ${theme.iconColor} shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${theme.badge}`}>
                        {guide.category || "general"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getSeverityBadge(guide.severity || "High")}`}>
                        {guide.severity || "High"}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug tracking-tight">
                      {guide.title}
                    </h4>
                  </div>
                </div>

                {/* Card Body - Symptoms or Description */}
                <div className="mt-4 space-y-1.5 flex-1 text-slate-800">
                  <div className="flex items-center gap-1">
                    <Info className={`h-3.5 w-3.5 ${theme.iconColor}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {guide.symptoms ? (guide.symptomsTitle || "Symptoms") : "Description"}
                    </span>
                  </div>
                  {guide.symptoms && guide.symptoms.length > 0 ? (
                    <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700 font-semibold leading-relaxed">
                      {guide.symptoms.map((sym, i) => (
                        <li key={i}>{sym}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed pl-1">
                      {guide.description}
                    </p>
                  )}
                </div>

                {/* Card Body - First Aid Steps */}
                <div className="mt-5 pt-4 border-t border-black/[0.08] space-y-2">
                  <div className="flex items-center gap-1">
                    <HeartPulse className={`h-3.5 w-3.5 ${theme.iconColor}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {guide.stepsTitle || "Treatment Steps"}
                    </span>
                  </div>
                  
                  {/* For mobile readability/expandability option, but showing all step items clearly */}
                  <ol className="space-y-2 pl-5 list-decimal text-xs text-slate-800 font-bold leading-relaxed">
                    {guide.steps.map((st, i) => (
                      <li key={i} className="pl-1">
                        <span className="text-slate-700 font-semibold">{st}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Language footer tag */}
                <div className="mt-4 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Languages className="h-3 w-3 text-slate-300" />
                    Language: {guide.language}
                  </span>
                  <span className="text-[9px] font-medium uppercase text-slate-300">
                    Always consult a doctor immediately
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State Screen */}
      {filteredGuides.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm text-center"
          id="first-aid-empty-state"
        >
          <div className="p-4 rounded-full bg-slate-50 border border-slate-100 text-slate-400 mb-4">
            <X className="h-8 w-8" />
          </div>
          <h4 className="text-base font-extrabold text-slate-800">No guides match your criteria</h4>
          <p className="text-xs text-slate-500 max-w-xs mt-1">
            Try resetting the search query or changing filters like category and severity.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </div>
  );
};
