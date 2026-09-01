import React, { useState, useEffect } from "react";
import {
  Heart,
  Activity,
  AlertTriangle,
  UserPlus,
  Shield,
  Phone,
  Droplet,
  Sun,
  Eye,
  Bookmark,
  Calendar,
  Sparkles,
  Award,
  Video,
  ChevronRight,
  Smile,
  BookOpen,
  Volume2,
  Clock,
  HeartCrack,
  Dumbbell,
  Compass,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  BookMarked,
  Info,
  CalendarDays,
  Flame,
  Check,
  Plus,
  Trash2,
  Apple,
  Wind,
  Thermometer
} from "lucide-react";
import { FirstAidResource } from "../FirstAidResource";

interface EmergencyGuide {
  title: string;
  symptomsTitle: string;
  symptoms: string[];
  stepsTitle: string;
  steps: string[];
  category: "chemical" | "thermal" | "animal" | "machinery";
  severity: "High" | "Critical" | "Severe";
}

// --- LOCALIZED TRANSLATION ENGINE ---
const firstAidTranslations: Record<string, {
  pesticide: EmergencyGuide;
  heatstroke: EmergencyGuide;
  snakebite: EmergencyGuide;
  eyeinjury: EmergencyGuide;
  machinery: EmergencyGuide;
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
        "फटी हुई त्वचा, गहरा घाव या आंतरिक मांसपेशियों/हड्डियों का प्रत्यक्ष दिखाई देना",
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
        "ਦੰਦਾਂ ਦੇ ਦੋ ਨਿਸ਼ਾਨ, ਤੇਜ਼ੀ ਨਾਲ ਸੋਜ ਆਉਣਾ, ਚਮੜੀ ਦਾ ਕਾਲਾ ਜਾਂ ਨੀਲਾ ਰੰਗ ਬਦਲਣਾ",
        "ਤੇਜ਼ ਜਲਣ ਵਾਲਾ ਦਰਦ, ਦੋਹਰਾ ਦਿਖਣਾ, ਪਲਕਾਂ ਦਾ ਭਾਰੀ ਹੋਣਾ ਜਾਂ ਪਸੀਨਾ ਆਉਣਾ",
        "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ, ਬੋਲਣ ਵਿੱਚ ਰੁਕਾਵਟ ਜਾਂ ਅਚਾਨਕ ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਅਧਰੰਗ ਹੋਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਲੋੜੀਂਦੇ ਕਦਮ",
      steps: [
        "ਮਰੀਜ਼ ਨੂੰ ਸ਼ਾਂਤ ਰੱਖੋ ਅਤੇ ਬਿਲਕੁਲ ਹਿੱਲਣ-ਜੁੱਲਣ ਨਾ ਦਿਓ। ਹਰਕਤ ਕਰਨ ਨਾਲ ਜ਼ਹਿਰ ਸਰੀਰ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਦਾ ਹੈ।",
        "ਡੰਗ ਵਾਲੀ ਥਾਂ 'ਤੇ ਚੀਰਾ ਨਾ ਲਗਾਓ, ਬਰਫ਼ ਨਾ ਲਗਾਓ, ਅਤੇ ਨਾ ਹੀ ਮੂੰਹ ਨਾਲ ਜ਼ਹਿਰ ਚੂਸਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਇਹ ਖ਼ਤਰਨਾਕ ਅਫ਼ਵਾਹਾਂ ਹਨ!",
        "ਡੰਗ ਵਾਲੇ ਅੰਗ ਤੋਂ ਅੰਗੂਠੀ, ਕੜਾ ਜਾਂ ਘੜੀ ਤੁਰੰਤ ਉਤਾਰ ਦਿਓ ਕਿਉਂਕਿ ਸੋਜ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਆਵੇਗੀ।",
        "ਡੰਗ ਵਾਲੀ ਥਾਂ ਨੂੰ ਸਾਫ਼ ਪਾਣੀ ਨਾਲ ਹੌਲੀ-ਹੌਲੀ ਸਾਫ਼ ਕਰੋ। ਪ੍ਰਭావਿਤ ਅੰਗ ਨੂੰ ਦਿਲ ਦੇ ਪੱਧਰ ਤੋਂ ਨੀਵਾਂ ਰੱਖੋ ਅਤੇ ਸਪਲਿੰਟ ਨਾਲ ਸਥਿਰ ਕਰੋ।",
        "ਮਰੀਜ਼ ਨੂੰ ਤੁਰੰਤ ਅਜਿਹੇ ਹਸਪਤਾਲ ਲੈ ਕੇ ਜਾਓ ਜਿੱਥే ਐਂਟੀ-ਸਨੇਕ ਵੈਨਮ (SAV) ਉਪਲਬਧ ਹੋਵੇ। ਝਾੜ-ਫੂਕ ਵਿੱਚ ਸਮਾਂ ਬਰਬਾਦ ਨਾ ਕਰੋ।"
      ]
    },
    eyeinjury: {
      title: "👁️ ਅੱਖ ਵਿੱਚ ਕੈਮੀਕਲ ਪੈਣ ਜਾਂ ਮਿੱਟੀ ਜਾਣ 'ਤੇ ਗਾਈਡ",
      symptomsTitle: "ਅੱਖਾਂ ਵਿੱਚ ਕੈਮੀਕਲ ਦੇ ਅਸਰ ਦੇ ਲੱਛਣ",
      category: "chemical",
      severity: "Severe",
      symptoms: [
        "ਕੈਮੀਕਲ ਜਾਂ ਮਿੱਟੀ ਜਾਣ ਤੋਂ ਬਾਅਦ ਅੱਖਾਂ ਵਿੱਚ ਤੇਜ਼ ਜਲਣ, ਲਾਲੀ, ਅਤੇ ਲਗਾਤਾਰ ਹੰਝੂ ਆਉਣਾ",
        "ਅੱਖ ਖੋਲ੍ਹਣ ਵਿੱਚ ਭਾਰੀ ਮੁਸ਼ਕਲ, ਰੋਸ਼ਨੀ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ, ਜਾਂ ਅਚਾਨਕ ਧੁੰਦਲਾਪਣ",
        "ਪਲਕ ਦੇ ਹੇਠਾਂ ਮਿੱਟੀ ਦੇ ਕਣ, ਤੂੜੀ ਜਾਂ ਕੈਮੀਕਲ ਦੀਆਂ ਬੂੰਦਾਂ ਅਟਕ ਜਾਣਾ"
      ],
      stepsTitle: "ਤੁਰੰਤ ਅੱਖ ਬਚਾਉਣ ਦੇ ਤਰੀਕੇ",
      steps: [
        "ਕਿਸੇ ਵੀ ਹਾਲਤ ਵਿੱਚ ਪ੍ਰਭਾਵਿਤ ਅੱਖ ਨੂੰ ਨਾ ਰਗੜੋ। ਰਗੜਨ ਨਾਲ ਮਿੱਟੀ ਦੇ ਕਣ ਅੰਦਰ ਧੱਸ ਸਕਦੇ ਹਨ ਜਾਂ ਕੈਮੀਕਲ ਫੈਲ ਸਕਦਾ ਹੈ।",
        "ਅੱਖ ਦੀ ਪਲਕ ਨੂੰ ਸਾਫ਼ ਉਂਗਲਾਂ ਨਾਲ ਖੁੱਲ੍ਹਾ ਰੱਖੋ ਅਤੇ ਘੱਟੋ-ਘੱਟ 15 ਮਿੰਟ ਤੱਕ ਸਾਫ਼, ਕੋਸੇ ਪਾਣੀ ਦੀ ਲਗਾਤਾਰ ਧਾਰ ਨਾਲ ਧੋਵੋ।",
        "ਜੇਕਰ ਕੈਮੀਕਲ ਪਿਆ ਹੈ, ਤਾਂ ਪਾਣੀ ਨੂੰ ਨੱਕ ਦੇ ਉੱਪਰੋਂ ਵਹਿਣ ਦਿਓ ਤਾਂ ਜੋ ਦੂਜੀ ਤੰਦਰੁਸਤ ਅੱਖ ਬਚੀ ਰਹే।",
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
      stepsTitle: "ਤੁਰੰਤ ਟਰਾਮา ਕੇਅਰ ਕਦਮ",
      steps: [
        "ਮਸ਼ੀਨਰੀ ਨੂੰ ਤੁਰੰਤ ਬੰਦ ਕਰੋ। ਮਰੀਜ਼ ਕੋਲ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਉਹ ਥਾਂ ਸੁਰੱਖਿਅਤ ਹੈ।",
        "ਤੇਜ਼ ਖੂਨ ਵਗਣ ਨੂੰ ਰੋਕਣ ਲਈ ਸਾਫ਼ ਕੱਪੜੇ ਜਾਂ ਪੱਟੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਜ਼ਖ਼ਮ 'ਤੇ ਸਿੱਧਾ, ਮਜ਼ਬੂਤ ਦਬਾਅ ਪਾਓ।",
        "ਸੋਜ ਨੂੰ ਘੱਟ ਕਰਨ ਅਤੇ ਖੂਨ ਦੇ ਨੁਕਸਾਨ ਨੂੰ ਹੌਲੀ ਕਰਨ ਲਈ ਜ਼ਖ਼ਮੀ ਅੰਗ ਨੂੰ ਦਿਲ ਦੇ ਪੱਧਰ ਤੋਂ ਉੱਪਰ ਚੁੱਕੋ।",
        "ਡੂੰਘੇ ਜ਼ਖ਼ਮਾਂ ਨੂੰ ਧੋਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਨਾ ਕਰੋ ਅਤੇ ਨੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀਆਂ ਹੱਡੀਆਂ ਨੂੰ ਅੰਦਰ ਧੱਕੋ। ਉਹਨਾਂ ਉੱਤੇ ਪੱਟੀ ਲਪੇਟੋ।",
        "ਸਦਮੇ (Shock) ਤੋਂ ਬਚਾਉਣ ਲਈ ਮਰੀਜ਼ ਨੂੰ ਨਿੱਘਾ ਰੱਖੋ ਅਤੇ ਸਿੱਧਾ ਲਿਟਾਓ। ਤੁਰੰਤ ਹਸਪਤਾਲ ਲੈ ਕੇ ਜਾਓ।"
      ]
    }
  }
};

const firstAidGuides: EmergencyGuide[] = Object.entries(firstAidTranslations).flatMap(([lang, langGuides]) =>
  Object.entries(langGuides).map(([key, val]) => ({
    ...val,
    language: lang
  }))
);

// --- POSTURE EXERCISES DATABASES ---
interface PostureExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  benefits: string;
  poseTip: string;
}

const postureExercisesList: PostureExercise[] = [
  {
    id: "ex-1",
    name: "🧘 Lumbar Cat-Camel Stretch",
    description: "Alternating between arching and rounding your spine while on hands and knees.",
    duration: 30,
    benefits: "Mobilizes lumbar joints, relieves lower back strain from prolonged bending during sowing.",
    poseTip: "Move smoothly with breathing. Arch your back up like a camel, then sink it down like a cat."
  },
  {
    id: "ex-2",
    name: "🧍 Standing Thoracic Extension",
    description: "Support your lower hips with both hands and lean back gently, looking at the sky.",
    duration: 20,
    benefits: "Reverses the forward hunched posture caused by hand-harvesting crops.",
    poseTip: "Keep knees slightly bent and do not over-extend. Take 3 deep, calming breaths."
  },
  {
    id: "ex-3",
    name: "🛋️ Cobra Hip Re-aligner",
    description: "Lying flat on stomach, place hands under shoulders and lift chest gently while hips touch ground.",
    duration: 40,
    benefits: "Re-aligns spinal discs, reduces sciatic nerve compression from heavy weightlifting.",
    poseTip: "Keep shoulders relaxed and away from your ears. Breathe into your abdomen."
  }
];

// --- FARM NUTRITION INGREDIENTS ---
interface FoodItem {
  name: string;
  category: "Grain" | "Pulse" | "Green" | "Dairy" | "Fruit";
  serving: string;
  protein: number; // grams
  iron: number; // mg
  vitaminA: number; // % DV
  energy: number; // kcal
  farmBonus: string;
}

const farmFoodsRegistry: FoodItem[] = [
  { name: "Premium Basmati Rice", category: "Grain", serving: "1 Cup cooked", protein: 5, iron: 1.2, vitaminA: 0, energy: 205, farmBonus: "Pure carbs for sustained physical stamina during hot tillering shifts." },
  { name: "Yellow Soybean Flour", category: "Pulse", serving: "50g raw", protein: 18, iron: 4.5, vitaminA: 5, energy: 220, farmBonus: "Incredible biological protein source; essential for cellular muscle repair." },
  { name: "Fresh Mustard Greens (Sarson)", category: "Green", serving: "1 Cup chopped", protein: 3, iron: 3.2, vitaminA: 120, energy: 35, farmBonus: "Loaded with iron and Vitamin A to protect eye retina under blinding UV rays." },
  { name: "Organic Buffalo Milk", category: "Dairy", serving: "250ml glass", protein: 9, iron: 0.2, vitaminA: 15, energy: 190, farmBonus: "Rich in calcium for deep bone density and heat electrolyte replenishment." },
  { name: "Farm Fresh Papaya", category: "Fruit", serving: "100g slice", protein: 1, iron: 0.5, vitaminA: 80, energy: 42, farmBonus: "Enzymatic properties aid digestion; excellent Vitamin C source." }
];

export interface FarmerHealthWellnessProps {
  externalWeather?: {
    temp: number;
    humidity: number;
    windSpeed?: number;
    uvIndex?: number;
    source?: string;
  };
}

export default function FarmerHealthWellness({ externalWeather }: FarmerHealthWellnessProps = {}) {
  const [activeTab, setActiveTab] = useState<"safety" | "telemedicine" | "fitness" | "camps" | "nutrition">("safety");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
  // --- PERSONALIZED WEATHER SAFETY ALERTS STATES ---
  const [selectedRegion, setSelectedRegion] = useState<"punjab" | "andhra" | "rajasthan" | "kerala">("andhra");
  const [safetyTemp, setSafetyTemp] = useState<number>(35);
  const [safetyHumidity, setSafetyHumidity] = useState<number>(85);
  const [safetyWind, setSafetyWind] = useState<number>(14);
  const [safetyUV, setSafetyUV] = useState<number>(8);
  const [loggedWaterMl, setLoggedWaterMl] = useState<number>(500);
  const [isSyncingWeather, setIsSyncingWeather] = useState<boolean>(false);

  // Sync external weather data if provided
  useEffect(() => {
    if (externalWeather) {
      setSafetyTemp(externalWeather.temp);
      setSafetyHumidity(externalWeather.humidity);
      if (externalWeather.windSpeed !== undefined) {
        setSafetyWind(externalWeather.windSpeed);
      }
      if (externalWeather.uvIndex !== undefined) {
        setSafetyUV(externalWeather.uvIndex);
      }
      showToast(
        `Received live microclimate feeds: ${externalWeather.temp.toFixed(1)}°C, ${externalWeather.humidity.toFixed(0)}% Humidity (${externalWeather.source || "Station API"})`,
        "info"
      );
    }
  }, [externalWeather]);

  const syncWeatherAPI = () => {
    setIsSyncingWeather(true);
    showToast("Connecting to live microclimate station API...", "info");
    
    setTimeout(() => {
      let baseTemp = 35;
      let baseHumidity = 85;
      let baseWind = 14;
      let baseUV = 8;
      
      if (selectedRegion === "punjab") {
        baseTemp = 40; baseHumidity = 35; baseWind = 12; baseUV = 10;
      } else if (selectedRegion === "andhra") {
        baseTemp = 35; baseHumidity = 85; baseWind = 14; baseUV = 8;
      } else if (selectedRegion === "rajasthan") {
        baseTemp = 45; baseHumidity = 15; baseWind = 22; baseUV = 11;
      } else if (selectedRegion === "kerala") {
        baseTemp = 27; baseHumidity = 90; baseWind = 8; baseUV = 5;
      }

      const randTempAdj = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const randHumidAdj = Math.floor(Math.random() * 11) - 5; // -5 to +5
      const randWindAdj = Math.floor(Math.random() * 5) - 2; // -2 to +2
      const randUVAdj = Math.floor(Math.random() * 3) - 1; // -1 to +1

      setSafetyTemp(Math.max(15, Math.min(50, baseTemp + randTempAdj)));
      setSafetyHumidity(Math.max(10, Math.min(100, baseHumidity + randHumidAdj)));
      setSafetyWind(Math.max(0, Math.min(40, baseWind + randWindAdj)));
      setSafetyUV(Math.max(1, Math.min(12, baseUV + randUVAdj)));

      setIsSyncingWeather(false);
      showToast(`Weather data for ${selectedRegion.toUpperCase()} synced via simulated API!`, "success");
    }, 1500);
  };

  // Sync region selections to sliders automatically
  useEffect(() => {
    if (selectedRegion === "punjab") {
      setSafetyTemp(40);
      setSafetyHumidity(35);
      setSafetyWind(12);
      setSafetyUV(10);
    } else if (selectedRegion === "andhra") {
      setSafetyTemp(35);
      setSafetyHumidity(85);
      setSafetyWind(14);
      setSafetyUV(8);
    } else if (selectedRegion === "rajasthan") {
      setSafetyTemp(45);
      setSafetyHumidity(15);
      setSafetyWind(22);
      setSafetyUV(11);
    } else if (selectedRegion === "kerala") {
      setSafetyTemp(27);
      setSafetyHumidity(90);
      setSafetyWind(8);
      setSafetyUV(5);
    }
  }, [selectedRegion]);

  // Standard NOAA Heat Index formula in Celsius
  const currentHeatIndex = React.useMemo(() => {
    const T = (safetyTemp * 9/5) + 32;
    const R = safetyHumidity;
    
    if (T < 80) {
      const simpleHI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));
      return (simpleHI - 32) * 5/9;
    }

    const c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127, c4 = -0.22475541,
          c5 = -0.00683783, c6 = -0.05481717, c7 = 0.00122874, c8 = 0.00085282,
          c9 = -0.00000199;

    let hi = c1 + (c2 * T) + (c3 * R) + (c4 * T * R) + (c5 * T * T) + (c6 * R * R) +
             (c7 * T * T * R) + (c8 * T * R * R) + (c9 * T * T * R * R);

    if (R < 13 && T >= 80 && T <= 112) {
      const adj = ((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      hi -= adj;
    } else if (R > 85 && T >= 80 && T <= 87) {
      const adj = ((R - 85) / 10) * ((87 - T) / 5);
      hi += adj;
    }

    return (hi - 32) * 5/9;
  }, [safetyTemp, safetyHumidity]);

  // Wet Bulb Globe Temperature (WBGT) simplified approximation for outdoor sun
  const currentWBGT = React.useMemo(() => {
    const T = safetyTemp;
    const R = safetyHumidity;
    // Approximated Wet Bulb Temp (Tw)
    const Tw = T * Math.atan(0.151977 * Math.pow(R + 8.313596, 0.5)) +
               Math.atan(T + R) - Math.atan(R - 1.676331) +
               0.00391838 * Math.pow(R, 1.5) * Math.atan(0.023101 * R) - 4.686035;
    const solarOffset = safetyUV * 1.2;
    const Tg = T + solarOffset;
    return (0.7 * Tw) + (0.2 * Tg) + (0.1 * T);
  }, [safetyTemp, safetyHumidity, safetyUV]);

  // Determine danger level and custom safety alerts based on Heat Index
  const heatStressAssessment = React.useMemo(() => {
    const hi = currentHeatIndex;
    let level: "SAFE" | "CAUTION" | "EXTREME CAUTION" | "DANGER" | "EXTREME DANGER" = "SAFE";
    let color = "bg-emerald-50 text-emerald-900 border-emerald-200";
    let badgeColor = "bg-emerald-600 text-white";
    let waterHourlyMl = 300;
    let restCycle = "Regular farm work cycles. Take periodic hydration pauses.";
    let medicalWarning = "Comfortable conditions. Maintain baseline physical hydration.";

    if (hi >= 54) {
      level = "EXTREME DANGER";
      color = "bg-red-100 text-red-950 border-red-300";
      badgeColor = "bg-red-700 text-white animate-pulse";
      waterHourlyMl = 1200;
      restCycle = "CRITICAL: Stop all physical field labor! Mandatory stay in cool shade.";
      medicalWarning = "HEATSTROKE HIGHLY IMMINENT. Rapid metabolic temperature rise. Activate medical standby!";
    } else if (hi >= 41) {
      level = "DANGER";
      color = "bg-rose-50 text-rose-950 border-rose-200";
      badgeColor = "bg-rose-600 text-white animate-pulse";
      waterHourlyMl = 1000;
      restCycle = "Mandatory shade break: 30 minutes for every 30 minutes of labor.";
      medicalWarning = "High Heatstroke Risk. Drink cool ORS water continuously. Do NOT work alone!";
    } else if (hi >= 32) {
      level = "EXTREME CAUTION";
      color = "bg-amber-50 text-amber-950 border-amber-200";
      badgeColor = "bg-amber-600 text-white";
      waterHourlyMl = 750;
      restCycle = "Shade break: 15 minutes for every 45 minutes of labor. Shift heavy work to evening.";
      medicalWarning = "Severe Heat Exhaustion possible. Rapid salt depletion. Avoid mid-day sun.";
    } else if (hi >= 27) {
      level = "CAUTION";
      color = "bg-yellow-50 text-yellow-950 border-yellow-200";
      badgeColor = "bg-yellow-500 text-slate-900";
      waterHourlyMl = 500;
      restCycle = "Shade break: 10 minutes every hour of active cultivation.";
      medicalWarning = "Fatigue & muscle cramps possible with prolonged physical exertion.";
    }

    return { level, color, badgeColor, waterHourlyMl, restCycle, medicalWarning };
  }, [currentHeatIndex]);
  
  // --- TELEMEDICINE STATES ---
  const [consultationBooked, setConsultationBooked] = useState<boolean>(false);
  const [symptomInput, setSymptomInput] = useState<string>("");
  const [consultationTime, setConsultationTime] = useState<string>("Today, 3:00 PM");
  const [doctorName, setDoctorName] = useState<string>("Dr. Anjali Nair (General Physician & Toxicologist)");

  // --- CESSATION PROGRESS TRACKER ---
  const [smokeFreeDays, setSmokeFreeDays] = useState<number>(12);
  const [alcoholFreeDays, setAlcoholFreeDays] = useState<number>(25);
  const [userPledge, setUserPledge] = useState<string>("To protect my health so I can cultivate my family's future.");
  const [pledgeLocked, setPledgeLocked] = useState<boolean>(true);
  
  // --- WATER PURIFICATION STATES ---
  const [dirtyWaterTurbidity, setDirtyWaterTurbidity] = useState<number>(85); // NTU (Turbidity Unit)
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filteredWaterPurity, setFilteredWaterPurity] = useState<number>(1.2); // Low NTU is clean
  const [filterStep, setFilterStep] = useState<string>("Ready to Filter");

  // --- HEAT STROKE CALENDAR STATES ---
  const [selectedMonth, setSelectedMonth] = useState<"May" | "June" | "July" | "August">("June");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(14);

  // --- POSTURE TIMER STATES ---
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(postureExercisesList[0].duration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [exercisesCompletedCount, setExercisesCompletedCount] = useState<number>(4);

  // --- NUTRITION MEAL BUILDER ---
  const [selectedMealItems, setSelectedMealItems] = useState<string[]>(["Premium Basmati Rice", "Fresh Mustard Greens (Sarson)"]);

  // --- HEALTH CAMPS & NOTIFICATIONS ---
  const notifications = [
    {
      id: "notif-1",
      title: "🏥 Free Comprehensive Village Eye & Cardiological Camp",
      desc: "Comprehensive eye screening for farmers. Includes free UV-blocking sunglasses distribution & cataract diagnosis by Delhi Eye Care Trust.",
      date: "July 04, 2026",
      location: "Cooperative Warehouse Central Hub",
      time: "09:00 AM - 05:00 PM",
      sponsor: "Cooperative Federation Wellness Fund"
    },
    {
      id: "notif-2",
      title: "🛡️ Bundled Crop Health & Farmer Life Insurance Plan",
      desc: "An integrated policy that bundles physical emergency hospitalization coverage (up to ₹2,50,000) directly with crop yield insurance credits.",
      status: "Active Premium Covered",
      policyNo: "F-INS-2026-94812",
      renewalDate: "March 15, 2027",
      premiumPayer: "Auto-financed via NCDEX Basmati premium margin hedges"
    }
  ];

  // --- TIMER EFFECTS ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setExercisesCompletedCount(prev => prev + 1);
      showToast(`Well done! You completed: ${postureExercisesList[activeExerciseIndex].name}. Your muscles thank you!`, "success");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Reset timer on exercise switch
  const handleSelectExercise = (idx: number) => {
    setActiveExerciseIndex(idx);
    setTimeLeft(postureExercisesList[idx].duration);
    setIsTimerRunning(false);
  };

  // --- WATER FILTRATION ACTION ---
  const runWaterFilterSimulation = () => {
    setIsFiltering(true);
    setFilterStep("Layer 1: Gravel & Coarse Sand - straining organic mud debris...");
    
    setTimeout(() => {
      setFilterStep("Layer 2: Activated Charcoal - absorbing pesticide residues and chemical odor molecules...");
    }, 1800);

    setTimeout(() => {
      setFilterStep("Layer 3: Fine Clay Core - clarify and naturally cool purified water...");
    }, 3600);

    setTimeout(() => {
      setIsFiltering(false);
      setDirtyWaterTurbidity(4); // Cleared
      setFilteredWaterPurity(0.8); // Ultra safe drinking standard
      setFilterStep("Purification Successful! Water safe for drinking (Pesticides removed, Purity >99.2%).");
    }, 5400);
  };

  // --- HEAT STROKE CALENDAR MONTH DATA ---
  const monthData = {
    May: { avgTemp: "41°C", dangerHours: "10:30 AM - 04:30 PM", heatAlert: "HIGH HAZARD (Critical Heatstroke Risk)", daysCount: 31, riskPattern: [3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3] },
    June: { avgTemp: "38°C", dangerHours: "11:00 AM - 03:30 PM", heatAlert: "SEVERE HAZARD (Peak Summer Sowing)", daysCount: 30, riskPattern: [4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3] },
    July: { avgTemp: "33°C", dangerHours: "12:00 PM - 02:30 PM", heatAlert: "MONSOON HUMIDITY (Dehydration Risk)", daysCount: 31, riskPattern: [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3] },
    August: { avgTemp: "31°C", dangerHours: "12:30 PM - 02:00 PM", heatAlert: "MODERATE HAZARD (Intermittent Sun)", daysCount: 31, riskPattern: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2] }
  };

  const getRiskColor = (level: number) => {
    if (level === 4) return "bg-rose-500 text-white border-rose-600"; // Severe Extreme
    if (level === 3) return "bg-amber-500 text-white border-amber-600"; // High Risk
    if (level === 2) return "bg-yellow-400 text-slate-900 border-yellow-500"; // Moderate
    return "bg-emerald-500 text-white border-emerald-600"; // Safe/Low
  };

  // --- NUTRITIONAL VALUE CALCULATIONS ---
  const mealNutritionSummary = () => {
    let totalProt = 0;
    let totalIron = 0;
    let totalVitA = 0;
    let totalEnergy = 0;

    selectedMealItems.forEach(foodName => {
      const found = farmFoodsRegistry.find(item => item.name === foodName);
      if (found) {
        totalProt += found.protein;
        totalIron += found.iron;
        totalVitA += found.vitaminA;
        totalEnergy += found.energy;
      }
    });

    const isBalanced = totalProt >= 15 && totalIron >= 4 && totalVitA >= 50;

    return {
      protein: totalProt,
      iron: totalIron.toFixed(1),
      vitA: totalVitA,
      energy: totalEnergy,
      rating: isBalanced ? "EXCELLENTLY BALANCED MEAL" : "PARTIALLY BALANCED (Add high protein/greens)",
      color: isBalanced ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-amber-700 bg-amber-50 border-amber-200"
    };
  };

  const currentMealSummary = mealNutritionSummary();

  // Handle booking telemedicine consultation
  const handleBookTelemedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) {
      showToast("Please enter your current physical symptoms to direct the triage process.", "warning");
      return;
    }
    setConsultationBooked(true);
    showToast(`Success: Tele-consultation booked with ${doctorName}. SMS link sent to registered mobile.`, "success");
  };

  return (
    <div id="farmer-health-wellness" className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm space-y-6 relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 max-w-sm p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 flex items-center gap-2.5 ${
          toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" :
          toast.type === "error" ? "bg-rose-50 border-rose-200 text-rose-900" :
          toast.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-900" :
          "bg-blue-50 border-blue-200 text-blue-900"
        }`}>
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
          {toast.type === "error" && <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />}
          {toast.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
          {toast.type === "info" && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
          <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-[10px] font-black opacity-50 hover:opacity-100 ml-auto pl-2 cursor-pointer">✕</button>
        </div>
      )}

      {/* Title & Banner Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg">
              <Heart className="h-5 w-5 text-rose-600 animate-pulse" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              🏥 Farmer Health, Safety & Wellness Portal
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            Pesticide safety first-aid, localized clinical consultations, back ergonomic therapy, nutrition logs, & work-shift sun calendars
          </p>
        </div>

        {/* Translation Switcher */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
          <BookOpen className="h-4 w-4 text-slate-500" />
          <span className="text-[10px] font-black text-slate-500 uppercase">Emergency Guide Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border border-slate-250 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
          </select>
        </div>
      </div>

      {/* Wellness Dashboard Top Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Heat index reminder */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Work Heat Stress Alert</span>
            <Sun className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-lg font-black text-slate-800 font-mono flex items-baseline gap-1">
              {monthData[selectedMonth].avgTemp} <span className="text-xs text-slate-400 font-bold">Peak</span>
            </h4>
            <span className="text-[9px] text-amber-600 font-bold block">Break interval: every 45 mins</span>
          </div>
        </div>

        {/* Eye protection UV gauge */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Eye UV Strain Protection</span>
            <Eye className="h-4.5 w-4.5 text-indigo-600" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-lg font-black text-slate-800 font-mono">
              UV Index: 8 (High)
            </h4>
            <span className="text-[9px] text-indigo-600 font-bold block">Wear protective UV-glass & wide hat</span>
          </div>
        </div>

        {/* Dual Streak Tracker */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Farmers Cessation Streak</span>
            <Sparkles className="h-4.5 w-4.5 text-emerald-500 animate-bounce" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-lg font-black text-slate-800 font-mono">
              🚭 {smokeFreeDays} Days • 🍺 {alcoholFreeDays} Days
            </h4>
            <span className="text-[9px] text-emerald-600 font-bold block">Lung power & heart rate improving</span>
          </div>
        </div>

        {/* Back Stretch Count badge */}
        <div className="p-4 rounded-2xl border bg-slate-50 border-slate-150 shadow-inner flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">Ergonomic Stretch Routine</span>
            <Dumbbell className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="mt-2.5">
            <h4 className="text-lg font-black text-slate-800 font-mono">
              {exercisesCompletedCount} Done This Week
            </h4>
            <span className="text-[9px] text-rose-600 font-bold block">Spinal posture aligned & flexible</span>
          </div>
        </div>

      </div>

      {/* PERSONALIZED WEATHER-DRIVEN SAFETY ALERTS SECTION */}
      <div id="personalized-weather-safety-panel" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-150 pb-3">
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1.5 w-fit">
              <Sun className="h-3.5 w-3.5 animate-spin-slow text-rose-500" /> Weather-Based Personalized Safety Alerts
            </span>
            <h3 className="text-slate-800 text-sm font-black uppercase mt-1.5 flex items-center gap-1.5">
              ☀️ Localized Biometeorological Heat & Work-Safety Adviser
            </h3>
            <p className="text-slate-500 text-[10px] font-medium">
              Uses live or simulated local microclimate station metrics to calculate real-time Heat Index (HI), Wet-Bulb Globe Temp (WBGT), and crop-spraying hazard risk guidelines.
            </p>
          </div>

          {/* Region Picker Selector */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 shadow-2xs">
            <span className="text-slate-500 text-[9px] font-black uppercase pl-2 font-mono">Microclimate API:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="andhra">Guntur Delta, AP (Extremely Humid)</option>
              <option value="punjab">Amritsar Plains, PB (Hot & Dry)</option>
              <option value="rajasthan">Thar Desert, RJ (Extreme Scorching Dry)</option>
              <option value="kerala">Wayanad Hills, KL (Cool Monsoon)</option>
            </select>
            <button
              onClick={syncWeatherAPI}
              disabled={isSyncingWeather}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-1 border ${
                isSyncingWeather 
                  ? "bg-slate-100 text-slate-400 border-slate-200" 
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {isSyncingWeather ? (
                <>
                  <Activity className="h-3 w-3 animate-spin text-emerald-600" />
                  Syncing API...
                </>
              ) : (
                <>
                  <RotateCcw className="h-3 w-3 text-emerald-600 animate-spin-reverse" />
                  Sync API Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Responsive Grid for Controls, Metrics, and Dynamic Guidance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Col 1: Microclimate Fine-tuning Sliders (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-xl space-y-4">
            <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
              <span>Sensed Telemetry Tuning</span>
              <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Manual Controls</span>
            </h4>

            {/* Temp Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1">🌡️ Sensed Temperature</span>
                <span className="font-mono text-slate-800">{safetyTemp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="50"
                value={safetyTemp}
                onChange={(e) => {
                  setSafetyTemp(parseInt(e.target.value));
                }}
                className="w-full accent-rose-600 h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                <span>15°C Cool</span>
                <span>50°C Scorching</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="space-y-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1">💧 Relative Humidity</span>
                <span className="font-mono text-slate-800">{safetyHumidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={safetyHumidity}
                onChange={(e) => {
                  setSafetyHumidity(parseInt(e.target.value));
                }}
                className="w-full accent-blue-500 h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                <span>10% Arid</span>
                <span>100% Saturated</span>
              </div>
            </div>

            {/* Wind Speed Slider */}
            <div className="space-y-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1">💨 Local Wind Velocity</span>
                <span className="font-mono text-slate-800">{safetyWind} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={safetyWind}
                onChange={(e) => {
                  setSafetyWind(parseInt(e.target.value));
                }}
                className="w-full accent-emerald-500 h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                <span>Calm</span>
                <span>40 km/h Gusty</span>
              </div>
            </div>

            {/* UV Index Slider */}
            <div className="space-y-1 pt-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                <span className="flex items-center gap-1">🔆 Incident UV Index</span>
                <span className="font-mono text-slate-800">{safetyUV}</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={safetyUV}
                onChange={(e) => {
                  setSafetyUV(parseInt(e.target.value));
                }}
                className="w-full accent-indigo-500 h-1 bg-slate-150 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-400 font-medium">
                <span>0 Low</span>
                <span>12 Extreme</span>
              </div>
            </div>
          </div>

          {/* Col 2: Computed Biometeorological Indicators (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider border-b pb-1.5">
                Computed Labor Stress Levels
              </h4>
              
              {/* Heat Index Block */}
              <div className="mt-3 bg-slate-50 border border-slate-150 rounded-xl p-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Heat Index (Feels Like)</span>
                  <span className="text-slate-800 text-lg font-black font-mono leading-none">
                    {currentHeatIndex.toFixed(1)}°C
                  </span>
                  <span className="text-[8.5px] text-slate-400 block font-semibold">
                    ({((currentHeatIndex * 9/5) + 32).toFixed(1)}°F)
                  </span>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold border ${heatStressAssessment.color}`}>
                  {heatStressAssessment.level}
                </div>
              </div>

              {/* Wet Bulb Globe Temp Block */}
              <div className="mt-3 bg-slate-50 border border-slate-150 rounded-xl p-3 flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1 font-sans">
                    WBGT Assessment <Info className="h-3 w-3 text-slate-400" title="Wet Bulb Globe Temperature accounts for air temperature, humidity, wind, and solar radiation to assess heat stress on working muscles." />
                  </span>
                  <span className="text-slate-800 text-base font-black font-mono leading-none">
                    {currentWBGT.toFixed(1)}°C
                  </span>
                  <span className="text-[8.5px] text-slate-400 block font-semibold">
                    Global Environmental Standard
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-400 font-extrabold block">WORK LIMITS</span>
                  <span className="text-[10px] font-black text-slate-700">
                    {currentWBGT > 32 ? "CRITICAL RISK" : currentWBGT > 29 ? "HEAVY LIMITS" : "STANDARD DUTY"}
                  </span>
                </div>
              </div>

              {/* Chemical Spraying Hazards */}
              <div className="mt-3 p-3 rounded-xl border flex justify-between items-center bg-slate-50 border-slate-150">
                <div>
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Pesticide Spray Drift</span>
                  <span className="text-slate-800 text-xs font-bold font-mono">
                    {safetyWind > 15 ? "🚨 Drift Hazard: High" : "✅ Safe Spray Velocity"}
                  </span>
                </div>
                <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${safetyWind > 15 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {safetyWind > 15 ? "DO NOT SPRAY" : "SAFE WINDOW"}
                </div>
              </div>
            </div>

            {/* Quick Summary Warning Callout */}
            <div className={`p-3 rounded-xl border text-[9.5px] font-semibold leading-relaxed ${heatStressAssessment.color}`}>
              <strong>🩺 Medical Advisory:</strong> {heatStressAssessment.medicalWarning}
            </div>
          </div>

          {/* Col 3: Personalized Work Safety Advisory & Hydration Logger (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-4 shadow-md">
            <div>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-1.5 flex justify-between items-center">
                <span>Personalized Farm Action Plan</span>
                <span className="text-[8px] bg-rose-600/20 text-rose-400 border border-rose-900/40 px-1.5 py-0.2 rounded-full font-bold">Personalized</span>
              </h4>

              <div className="mt-3.5 space-y-3">
                {/* Hourly Hydration Target */}
                <div className="flex gap-2.5 items-start">
                  <span className="text-lg">🥤</span>
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block font-sans">Electrolyte Hydration Target</span>
                    <span className="text-[10.5px] font-bold text-slate-100">
                      Drink {heatStressAssessment.waterHourlyMl} mL of ORS/Water every hour
                    </span>
                  </div>
                </div>

                {/* Rest Intervals */}
                <div className="flex gap-2.5 items-start">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block font-sans">Cultivation Rest Cycle</span>
                    <span className="text-[10.5px] font-bold text-slate-100">
                      {heatStressAssessment.restCycle}
                    </span>
                  </div>
                </div>

                {/* Clothing & Protective Gear */}
                <div className="flex gap-2.5 items-start">
                  <span className="text-lg">👒</span>
                  <div>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase block font-sans">Work Apparel Recommendation</span>
                    <span className="text-[10.5px] font-bold text-slate-100">
                      {safetyUV >= 8 
                        ? "Zinc sunscreen, wide brim straw hat, long breathable cotton sleeves." 
                        : "Lightweight breathable cotton clothing, safety goggles, cap."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hydration Logger */}
            <div className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5 text-sky-400 animate-pulse" /> Hydration Intake Tracker
                </span>
                <span className="text-[9px] font-bold font-mono text-slate-300">
                  {loggedWaterMl} / {Math.round(2500 + Math.max(0, (currentHeatIndex - 25) * 150))} mL
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300" 
                  style={{ width: `${Math.min(100, (loggedWaterMl / (2500 + Math.max(0, (currentHeatIndex - 25) * 150))) * 100)}%` }}
                />
              </div>

              {/* Add Water Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoggedWaterMl(p => p + 250)}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white text-[9px] font-extrabold py-1 rounded-lg transition-all cursor-pointer text-center"
                >
                  +250ml Water
                </button>
                <button
                  type="button"
                  onClick={() => setLoggedWaterMl(p => p + 350)}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-[9px] font-extrabold py-1 rounded-lg transition-all cursor-pointer text-center"
                >
                  +350ml ORS
                </button>
                <button
                  type="button"
                  onClick={() => setLoggedWaterMl(500)}
                  className="bg-slate-700 hover:bg-slate-600 p-1.5 rounded-lg text-slate-300 cursor-pointer"
                  title="Reset Hydration Tracker"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Primary Category Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-150 pb-1">
        <button
          onClick={() => setActiveTab("safety")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "safety"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          ⚠️ Poisoning Safety & First-Aid Guides
        </button>
        <button
          onClick={() => setActiveTab("telemedicine")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "telemedicine"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          📞 Telemedicine & Cessation support
        </button>
        <button
          onClick={() => setActiveTab("fitness")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "fitness"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🧘 Spinal Stretching & Fitness Timer
        </button>
        <button
          onClick={() => setActiveTab("nutrition")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "nutrition"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🌾 Farm Produce Nutrition Builder
        </button>
        <button
          onClick={() => setActiveTab("camps")}
          className={`pb-2.5 px-4 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
            activeTab === "camps"
              ? "border-rose-600 text-rose-600 font-black"
              : "border-transparent text-slate-400 hover:text-slate-600 font-semibold"
          }`}
        >
          🏥 Free Camps & Bundled Health Insurance
          <span className="ml-1 px-1.5 py-0.2 text-[8px] font-black bg-rose-600 text-white rounded-full animate-pulse">2 NEW</span>
        </button>
      </div>

      {/* Main Dynamic View Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TAB 1: LOCALIZED POISONING & HEAT EMERGENCY GUIDES & WATER FILTER */}
        {activeTab === "safety" && (
          <>
            {/* Localized First Aid content (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              <FirstAidResource guides={firstAidGuides} />

              {/* INTERACTIVE WATER PURIFICATION SYSTEM */}
              <div className="p-5 bg-slate-900 text-white border border-slate-800 rounded-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-sky-400 animate-bounce" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                      Cooperative Clay-Sand-Charcoal Purification Hub
                    </h4>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-black font-mono border border-emerald-900">
                    DISEASE DEFENSE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  
                  {/* Schematic Interactive Filter Column (5 columns) */}
                  <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3 relative overflow-hidden">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Clay-Filter Bed Visual</span>
                    
                    {/* Layer 1: Sand */}
                    <div className="py-2.5 bg-yellow-600/35 border border-dashed border-yellow-600 rounded text-[9.5px] font-bold">
                      Layer 1: Gravel & Coarse Sand (Mud Silt filter)
                    </div>
                    {/* Down arrow */}
                    <div className="h-2 w-0.5 bg-slate-700 mx-auto" />
                    
                    {/* Layer 2: Charcoal */}
                    <div className="py-2.5 bg-neutral-800 border border-dashed border-neutral-700 rounded text-[9.5px] font-bold">
                      Layer 2: Activated Charcoal (Pesticide Toxin Absorb)
                    </div>
                    <div className="h-2 w-0.5 bg-slate-700 mx-auto" />

                    {/* Layer 3: Fine Sand Clay */}
                    <div className="py-2.5 bg-amber-800/40 border border-dashed border-amber-800 rounded text-[9.5px] font-bold">
                      Layer 3: Fine Sand & Clay Earthen Cooler
                    </div>

                    {/* Flow droplets */}
                    {isFiltering && (
                      <div className="absolute inset-0 bg-slate-950/85 flex flex-col justify-center items-center p-3">
                        <Activity className="h-8 w-8 text-sky-400 animate-spin mb-2" />
                        <span className="text-[10px] text-sky-300 font-black font-mono animate-pulse">{filterStep}</span>
                      </div>
                    )}
                  </div>

                  {/* Simulator Control Column (7 columns) */}
                  <div className="md:col-span-7 space-y-3">
                    <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
                      Well and canal waters contain biological pathogens and toxic organophosphate chemical residues from neighboring crop sprays. 
                      Utilize the community filtration model to generate absolute safe drinking water for your field workers.
                    </p>

                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Turbidity Units (NTU)</span>
                        <span className={`text-sm font-black ${dirtyWaterTurbidity > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                          {dirtyWaterTurbidity} NTU {dirtyWaterTurbidity > 10 ? "(UNSAFE)" : "(SAFE)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Chemical Toxicity Purity</span>
                        <span className="text-sm font-black text-emerald-400">
                          {filteredWaterPurity < 1.0 ? ">99.8% Pure" : "Untested / Poor"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={runWaterFilterSimulation}
                        disabled={isFiltering}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-black rounded-lg text-xs cursor-pointer transition-colors"
                      >
                        {isFiltering ? "Filtering Well Water..." : "Pour & Filter Muddy Well Water"}
                      </button>
                      
                      <button
                        onClick={() => {
                          setDirtyWaterTurbidity(85);
                          setFilteredWaterPurity(3.5);
                          setFilterStep("Ready to Filter");
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                        title="Reset Water Simulator"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Emergency Contacts & Heat Stroke Prevention Calendar (4 columns) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Emergency Dial Numbers */}
              <div className="p-5 bg-rose-950 text-rose-300 rounded-2xl space-y-4 border border-rose-900 shadow-md">
                <div className="flex items-center gap-1.5 pb-2 border-b border-rose-900">
                  <Phone className="h-4.5 w-4.5 text-rose-400 animate-bounce" />
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                    EMERGENCY MEDICAL DISPATCH
                  </h4>
                </div>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-rose-900/40 pb-1.5">
                    <span>Ambulance Service:</span>
                    <span className="text-white font-black">102 / 108</span>
                  </div>
                  <div className="flex justify-between border-b border-rose-900/40 pb-1.5">
                    <span>Block PHC Doctor:</span>
                    <span className="text-white font-black">9981-2244-10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chemical & Insecticide Poison Center:</span>
                    <span className="text-white font-black">1800-412-2211</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast("Initiating high-priority SOS emergency signal to localized village Asha wellness worker and primary care doctor.", "warning")}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Broadcast SOS Emergency
                </button>
              </div>

              {/* HEAT STROKE PREVENTION CALENDAR */}
              <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                      Heat-Stroke Calendar
                    </h4>
                  </div>
                  
                  {/* Month Selection */}
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value as any);
                      setSelectedDayIndex(1);
                    }}
                    className="bg-white border text-[10px] font-bold text-slate-700 rounded px-1.5 py-0.5"
                  >
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                  </select>
                </div>

                {/* Calendar Heat Risk Grid */}
                <div className="bg-white p-3 rounded-xl border space-y-2">
                  <div className="flex justify-between items-center text-[10px] border-b pb-1.5">
                    <span className="font-extrabold text-slate-700">Month Average: {monthData[selectedMonth].avgTemp}</span>
                    <span className="font-black text-rose-600 uppercase text-[8.5px]">{monthData[selectedMonth].heatAlert}</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 font-mono text-center">
                    {/* Days labels */}
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <span key={i} className="text-[8px] font-extrabold text-slate-400">{d}</span>
                    ))}

                    {/* Array of days */}
                    {Array.from({ length: monthData[selectedMonth].daysCount }).map((_, idx) => {
                      const dayNumber = idx + 1;
                      const riskLevel = monthData[selectedMonth].riskPattern[idx % monthData[selectedMonth].riskPattern.length];
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDayIndex(dayNumber)}
                          className={`aspect-square text-[9px] font-black rounded border flex items-center justify-center cursor-pointer transition-all ${
                            selectedDayIndex === dayNumber ? "ring-2 ring-indigo-600" : ""
                          } ${getRiskColor(riskLevel)}`}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Day details */}
                  <div className="p-2.5 bg-slate-50 border rounded-lg text-[10.5px] font-semibold space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase block">Selected: {selectedMonth} {selectedDayIndex}, 2026 Forecast</p>
                    <div className="flex justify-between">
                      <span>Extreme Exposure Peak:</span>
                      <span className="text-rose-600 font-extrabold">{monthData[selectedMonth].dangerHours}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 border-slate-200">
                      <span>Shade breaks:</span>
                      <span className="font-bold text-slate-800">Mandated hourly, 15m min</span>
                    </div>
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                  *Color index: <span className="text-emerald-600 font-black">Green = Safe</span>, <span className="text-yellow-500 font-black">Yellow = Moderate</span>, <span className="text-amber-500 font-black">Orange = High</span>, <span className="text-rose-600 font-black">Red = Severe Danger</span>. Plan chemical spraying and heavy tilling outside danger hours!
                </p>
              </div>

            </div>
          </>
        )}

        {/* TAB 2: TELEMEDICINE CONSULTATIONS & CESSATION PROGRAMS */}
        {activeTab === "telemedicine" && (
          <>
            {/* Telemedicine Intake triage (8 columns) */}
            <div className="lg:col-span-8 space-y-5">
              
              <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Video className="h-5 w-5 text-rose-600" />
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    24/7 Cooperative Telemedicine Clinic (Live General Triage & Toxicologist Router)
                  </h4>
                </div>

                {!consultationBooked ? (
                  <form onSubmit={handleBookTelemedicine} className="space-y-4">
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      Access verified clinical support. If you suffer from heat-stress headaches, retinal solar strains, chemical inhalations, or localized musculoskeletal backache, describe your exact condition. Our AI Triage routing matches you to standard village clinical professionals in real-time.
                    </p>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase">State Symptoms / Pain Areas</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="State physical issue, exposure details, and duration. e.g. Severe headache after spraying paddy crops for 4 hours without charcoal respirator, eyes itching..."
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        className="w-full bg-white border border-slate-250 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Cooperative Wellness ID</label>
                        <input
                          type="text"
                          placeholder="e.g. F-HLT-94812"
                          className="w-full bg-white border rounded-lg p-2 focus:outline-none font-mono focus:ring-1 focus:ring-rose-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Select Urgency Level</label>
                        <select className="w-full bg-white border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500">
                          <option value="routine">Routine consultation (Next 6 hours)</option>
                          <option value="high">Urgent Heat Exhaustion / Chemical exposure (Within 1 hour)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer transition-colors shadow-sm"
                    >
                      Initialize Clinical Triage Routing
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-white border border-dashed rounded-xl text-center space-y-3.5 shadow-inner">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-emerald-150 animate-bounce">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h5 className="text-sm font-extrabold text-slate-800">Your Consult Session is Confirmed & Route established!</h5>
                    
                    <div className="max-w-md mx-auto p-3.5 bg-slate-50 border rounded-xl text-left text-[11px] font-semibold space-y-1 font-mono">
                      <p className="text-slate-500"><span className="font-sans font-bold">Assigned Practitioner:</span> {doctorName}</p>
                      <p className="text-slate-500"><span className="font-sans font-bold">Scheduled Time Slot:</span> {consultationTime}</p>
                      <p className="text-slate-500"><span className="font-sans font-bold">Triage Category:</span> Chemical inhalation safety assessment</p>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-lg mx-auto">
                      A secured high-bandwidth video consultation link has been dispatched to your mobile. Please have your pesticide spray can/label handy if applicable.
                    </p>

                    <button
                      onClick={() => {
                        setConsultationBooked(false);
                        setSymptomInput("");
                      }}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
                    >
                      Submit New Symptoms Entry
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Smoking/Alcohol Cessation & Mental Strength Logs (4 columns) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Cessation trackers */}
              <div className="p-5 bg-white border border-slate-150 rounded-2xl space-y-4 shadow-sm text-[11px] font-semibold">
                <div className="flex items-center gap-1.5 pb-2 border-b">
                  <HeartCrack className="h-4.5 w-4.5 text-rose-600" />
                  <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
                    Cessation & Habit Strength Logs
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">🚭 Tobacco-Free Days Tracker</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-black text-[9.5px]">
                        {smokeFreeDays} Days
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSmokeFreeDays(prev => prev + 1);
                          showToast("Congratulations! One more day of pure lung recovery logged.", "success");
                        }}
                        className="px-2 py-1 bg-white border text-[10px] font-bold rounded cursor-pointer hover:bg-slate-100"
                      >
                        + Log Today
                      </button>
                      <button
                        onClick={() => setSmokeFreeDays(0)}
                        className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] rounded cursor-pointer hover:bg-rose-100"
                      >
                        Reset Slip
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">🍺 Alcohol-Free Days Tracker</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-black text-[9.5px]">
                        {alcoholFreeDays} Days
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setAlcoholFreeDays(prev => prev + 1);
                          showToast("Well done! Liver enzyme restoration on track.", "success");
                        }}
                        className="px-2 py-1 bg-white border text-[10px] font-bold rounded cursor-pointer hover:bg-slate-100"
                      >
                        + Log Today
                      </button>
                      <button
                        onClick={() => setAlcoholFreeDays(0)}
                        className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] rounded cursor-pointer hover:bg-rose-100"
                      >
                        Reset Slip
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mental health stress counselor info */}
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Smile className="h-4.5 w-4.5 text-rose-600" />
                    <span className="font-extrabold text-rose-900">24/7 Mental Strength Helpline</span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 leading-normal">
                    Suffering from financial crop stress, family anxiety, or depressive strain? Call confidential helpline <span className="font-bold text-rose-700">1800-599-0019</span> for real-time psychologist guidance.
                  </p>
                </div>

                {/* Lock Pledge */}
                <div className="space-y-1 pt-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">My Habit & Wellness Pledge</span>
                  {pledgeLocked ? (
                    <div className="flex justify-between items-start bg-slate-50 p-2.5 rounded-lg border border-dashed">
                      <p className="text-[10.5px] italic text-slate-600 leading-normal font-semibold">"{userPledge}"</p>
                      <button
                        onClick={() => setPledgeLocked(false)}
                        className="text-[9px] text-indigo-600 font-extrabold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={userPledge}
                        onChange={(e) => setUserPledge(e.target.value)}
                        className="w-full bg-white border p-1.5 text-xs font-semibold rounded"
                      />
                      <button
                        onClick={() => setPledgeLocked(true)}
                        className="px-2.5 py-0.5 bg-slate-900 text-white rounded text-[10px] font-black"
                      >
                        Save Pledge
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </>
        )}

        {/* TAB 3: SPINAL EXERCISES & POSTURE TIMER */}
        {activeTab === "fitness" && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-2 pb-2 border-b">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Dumbbell className="h-4.5 w-4.5 text-rose-600" />
                    Farmer Ergonomic Spine Care & Stretch Routines
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    Heavy rice transplantation and sugarcane harvesting causes severe stooping strain. Perform these clinical exercises to realign back joints.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Total Completed Challenges</span>
                  <span className="text-sm font-mono font-black text-emerald-600">{exercisesCompletedCount} routines this week</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Exercise selection list (5 columns) */}
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Select Spine Posture Exercise:</span>
                  
                  {postureExercisesList.map((ex, idx) => (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExercise(idx)}
                      className={`w-full p-4 rounded-xl border text-left flex justify-between items-center cursor-pointer transition-all ${
                        activeExerciseIndex === idx
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white border-slate-200 text-slate-800 hover:shadow-sm"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black block">{ex.name}</span>
                        <p className={`text-[10px] ${activeExerciseIndex === idx ? "text-indigo-200" : "text-slate-500"} leading-snug font-semibold`}>
                          {ex.benefits}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 ${activeExerciseIndex === idx ? "text-white" : "text-slate-400"}`} />
                    </button>
                  ))}
                </div>

                {/* Active Interactive Timer & Guide (7 columns) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                  
                  {/* Timer Circular visual/Details */}
                  <div className="space-y-3 flex-1">
                    <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest block">Active Spine Stretch Guide</span>
                    <h5 className="text-sm font-extrabold text-slate-800">
                      {postureExercisesList[activeExerciseIndex].name}
                    </h5>
                    
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      {postureExercisesList[activeExerciseIndex].description}
                    </p>

                    <div className="p-3 bg-amber-50 border border-amber-150 rounded-xl text-[10.5px] text-amber-800 font-semibold">
                      <span className="font-extrabold block uppercase text-[8px] tracking-wide mb-0.5">Clinical Pose Tip:</span>
                      {postureExercisesList[activeExerciseIndex].poseTip}
                    </div>
                  </div>

                  {/* Real clock countdown controls */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl text-center space-y-4 w-full md:w-52 border border-slate-800 shadow-md">
                    <span className="text-[9px] text-slate-500 block font-mono uppercase tracking-widest">Postural Hold Clock</span>
                    
                    <div className="text-4xl font-black font-mono text-emerald-400">
                      00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>

                    <div className="flex justify-center gap-2">
                      {!isTimerRunning ? (
                        <button
                          onClick={() => setIsTimerRunning(true)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black cursor-pointer flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" /> Start Pose
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsTimerRunning(false)}
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-black cursor-pointer flex items-center gap-1"
                        >
                          <Pause className="h-3 w-3" /> Pause
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimeLeft(postureExercisesList[activeExerciseIndex].duration);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded cursor-pointer"
                        title="Reset Pose Timer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <p className="text-[9px] text-slate-500">Hold posturing steady; breathe through the lumbar joints deeply.</p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: FARM PRODUCE NUTRITION BUILDER */}
        {activeTab === "nutrition" && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Apple className="h-5 w-5 text-emerald-600 animate-bounce" />
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Home-Grown Farm Produce Nutrition & Dietary Balance Builder
                </h4>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Maximize bodily physical strength directly from your harvested crops! Select different ingredients harvested on local plots to construct dietary plates, and gauge your bioavailable iron, structural protein, retina-defense vitamin reserves, and muscular energy values.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Ingredients inventory checklist (5 columns) */}
                <div className="lg:col-span-5 space-y-3">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Harvest Plots Food Stockpile:</span>
                  
                  <div className="space-y-2">
                    {farmFoodsRegistry.map(item => {
                      const isAdded = selectedMealItems.includes(item.name);
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            if (isAdded) {
                              setSelectedMealItems(prev => prev.filter(n => n !== item.name));
                            } else {
                              setSelectedMealItems(prev => [...prev, item.name]);
                            }
                          }}
                          className={`p-3 rounded-xl border text-left flex justify-between items-center cursor-pointer transition-all ${
                            isAdded ? "bg-emerald-50 border-emerald-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9.5px] px-1.5 py-0.2 font-black rounded uppercase font-mono bg-slate-100 text-slate-600">
                                {item.category}
                              </span>
                              <span className="text-xs font-extrabold text-slate-800">{item.name}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug font-semibold">{item.farmBonus}</p>
                            <span className="text-[9px] text-slate-400 font-mono">Portion: {item.serving}</span>
                          </div>
                          
                          <div className={`p-1 rounded ${isAdded ? "bg-emerald-600 text-white" : "border text-slate-300"}`}>
                            {isAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Active Plate Nutrition Metrics (7 columns) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border space-y-5 shadow-sm">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">Daily Harvest Nutritional Intake Sheet</span>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedMealItems.map(item => (
                      <span key={item} className="px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10.5px] rounded-full font-bold flex items-center gap-1">
                        {item}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMealItems(prev => prev.filter(n => n !== item));
                          }}
                          className="text-emerald-600 hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedMealItems.length === 0 && (
                      <span className="text-xs text-rose-500 font-semibold italic">Your nutritional farm plate is empty! Check items to add them.</span>
                    )}
                  </div>

                  {/* Core bioavailable nutrient indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
                    <div className="p-3 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Biological Protein</span>
                      <span className="text-lg font-black font-mono text-slate-800">{currentMealSummary.protein}g</span>
                      <span className="text-[8px] text-slate-400 block font-semibold">Goal: &gt;15g</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Bioavailable Iron</span>
                      <span className="text-lg font-black font-mono text-slate-800">{currentMealSummary.iron}mg</span>
                      <span className="text-[8px] text-slate-400 block font-semibold">Goal: &gt;4mg</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Retina Vit-A Shield</span>
                      <span className="text-lg font-black font-mono text-slate-800">{currentMealSummary.vitA}%</span>
                      <span className="text-[8px] text-slate-400 block font-semibold">Goal: &gt;50% DV</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border text-center">
                      <span className="text-[8px] text-slate-400 font-bold block uppercase">Muscular Energy</span>
                      <span className="text-lg font-black font-mono text-slate-800">{currentMealSummary.energy} kcal</span>
                      <span className="text-[8px] text-slate-400 block font-semibold">Sustained burn</span>
                    </div>
                  </div>

                  {/* Diet rating advisories */}
                  <div className={`p-4 rounded-xl border text-[11px] leading-relaxed font-semibold ${currentMealSummary.color}`}>
                    <span className="font-extrabold uppercase block text-[8px] tracking-wide mb-1">Plate Balance Grade:</span>
                    <p className="font-black text-slate-800 mb-1">{currentMealSummary.rating}</p>
                    {selectedMealItems.includes("Fresh Mustard Greens (Sarson)") ? (
                      <p className="text-slate-600">✓ Excellent addition of Iron-rich Sarson Greens. This highly protects retinal cells against solar UV radiation while transplanting high-reflective rice blocks.</p>
                    ) : (
                      <p className="text-slate-600">⚠️ Recommend adding 'Fresh Mustard Greens (Sarson)' to your plate to replenish eye pigment buffers and absorb solar UV stress more efficiently.</p>
                    )}
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 5: FREE VILLAGE HEALTH CAMPS & BUNDLED INSURANCE */}
        {activeTab === "camps" && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Bookmark className="h-5 w-5 text-indigo-600 animate-pulse" />
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Village Health Camps & Bundled Insurance Portfolios
                </h4>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Your cooperative coordinates completely free annual comprehensive clinical checkups, UV eye exams, and local healthcare camps. 
                Our bundled health policies automatically lock-in physical hospitalization cash benefits directly attached to active commodity margin transactions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {notifications.map(notif => (
                  <div key={notif.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 hover:shadow-md transition-all">
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{notif.title}</h4>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">{notif.desc}</p>
                    </div>

                    {notif.date && (
                      <div className="text-[11.5px] p-3 bg-slate-50 rounded-xl border border-slate-150 text-slate-600 space-y-1 font-semibold">
                        <p><span className="font-bold text-slate-700">Date/Time:</span> {notif.date} ({notif.time})</p>
                        <p><span className="font-bold text-slate-700">Location:</span> {notif.location}</p>
                        <p><span className="font-bold text-slate-700">Sponsoring Trust:</span> {notif.sponsor}</p>
                      </div>
                    )}

                    {notif.status && (
                      <div className="text-[11.5px] p-3 bg-emerald-50/50 rounded-xl border border-emerald-150 text-slate-600 space-y-1 font-semibold">
                        <p><span className="font-bold text-slate-700">Policy Status:</span> <span className="text-emerald-700 font-extrabold">{notif.status}</span></p>
                        <p><span className="font-bold text-slate-700">Policy Registry ID:</span> <span className="font-mono text-xs font-bold text-slate-800">{notif.policyNo}</span></p>
                        <p><span className="font-bold text-slate-700">Hospitalization Cover:</span> Up to ₹2,50,000 cashless cover at nearest PHC/District nodes</p>
                        <p><span className="font-bold text-slate-700">Renewal Logistics:</span> {notif.premiumPayer}</p>
                      </div>
                    )}

                    <button
                      onClick={() => showToast(`Registration details recorded! Confirmation code sent via registered SMS for: ${notif.title}.`, "success")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black cursor-pointer transition-colors shadow-sm"
                    >
                      Enroll & Set Calendar Reminder
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
