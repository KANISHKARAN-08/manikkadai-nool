import { ReferenceEntry } from '../types';

export interface TraditionalTableItem {
  virarkadai: string;
  fractionalNumeric: number;
  tamilText: string;
  englishText: string;
  category: 'disease_manifestation' | 'critical_prognosis';
  pageNo: string;
  poemVerse?: string;
  poemVerseTitle?: string;
}

export const AUTHENTIC_MANUSCRIPT_TRANSCRIPTION: TraditionalTableItem[] = [
  // Page 368 - Disease Manifestations (நோயிநிலைகள்)
  {
    virarkadai: '10',
    fractionalNumeric: 10,
    tamilText: 'உடல் வெதும்பி, வாயுவினால் நெஞ்சு, கை, கால், குத்தல், உளைவு, வயிற்றில் வாயுத் திரட்சியும், குன்மமும் உண்டாகும்.',
    englishText: 'Body heat/flush; stabbing pain and aching in chest, hands and legs due to Vayu; flatulence/gaseous distension in abdomen; onset of Gunmam (peptic/gastric condition).',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '9 ¾',
    fractionalNumeric: 9.75,
    tamilText: 'அரையாப்பு, பிளவை, வரட்டு இருமல்.',
    englishText: 'Bubo / groin swelling (Araiyaappu), carbuncle/deep abscess (Pilavai), and persistent dry cough.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '9 ½',
    fractionalNumeric: 9.5,
    tamilText: 'உத்கரம், மேகம், விழிகாய்தல், சூலையுண்டாகும். உடல் வெதும்பி வீங்கும், அன்னத்தைத் தள்ளும்.',
    englishText: 'Internal feverishness, Mega conditions, eye burning/dryness, pricking/colic pain (Soolai); body flushes and swells, revulsion toward food / loss of appetite.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '9 ¼',
    fractionalNumeric: 9.25,
    tamilText: 'சிறுநீர் கடுப்பு, விழிகாய்தல், தூக்கமின்மை, பீனிசம் உண்டாகும்.',
    englishText: 'Dysuria / burning micturition, eye dryness/heat, insomnia / sleep deprivation, and rhinitis / sinusitis (Peenisam).',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '9',
    fractionalNumeric: 9.0,
    tamilText: 'செவிமந்தம், கண் புகைச்சல், தொடை, இடுப்பு வலி, நடக்க இயலாது.',
    englishText: 'Dullness of hearing / partial deafness, misty/smoky vision, acute thigh and hip/lumbar pain, inability to walk.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '8 ¾',
    fractionalNumeric: 8.75,
    tamilText: 'மூலவாயு, கண்க்காசம், பீனிசம், உடல் காயும் சில்லித்தால் குட்டம் உண்டாகும்.',
    englishText: 'Moola vayu (hemorrhoidal/ano-rectal vata), eye cataract/opacity, sinusitis; body feels parched, chills leading to Kuttam (chronic skin dermatosis).',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '8 ½',
    fractionalNumeric: 8.5,
    tamilText: 'குட்டம், சிலந்தி, சொறி, குடல்வாதம், வெட்டை, தாதுநட்டம், தேகம் வெதும்பும்.',
    englishText: 'Kuttam, carbuncle / furuncles, itchy scabies/pruritus, abdominal intestinal colic/enteritis, gonorrheal/burning heat, seminal debility, febrile body heat.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '8 ¼',
    fractionalNumeric: 8.25,
    tamilText: 'பீனிசம், வியர்வை, விஷ இளைப்புருமால் உடல் பருத்து வலித்து உலையும், தலைவர்ட்சி, வலி.',
    englishText: 'Severe rhinitis, profuse cold sweats, toxic emaciation with cough/spasms, generalized body soreness and aching, cephalic dryness, headache.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '8',
    fractionalNumeric: 8.0,
    tamilText: 'மேககாங்கை, வயிறு மந்தம் பொருமால், வாயு திரட்சி, அன்னம் செல்லாது, வேற்றுடம்படும்.',
    englishText: 'Internal constitutional burning heat (Mega-kaangai), dyspepsia and gastric flatulence, accumulation of intestinal gas, refusal of nourishment, constitutional wasting.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '7 ¾',
    fractionalNumeric: 7.75,
    tamilText: 'மூலவெடிப்பிக் கை கால் காந்தும் தலையிடிக்கும் மதத்திக்கும் இரண்டு வருடத்தில் கண்மாலையும், நாண்சொல்ல நாசியில் இரத்தமுமுண்டாகும்.',
    englishText: 'Fissures/bleeding piles with burning in hands and feet, throbbing headache, dizziness/delirium; within two years ocular opacity (Kanmaalai) and epistaxis (nasal bleeding).',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '7 ½',
    fractionalNumeric: 7.5,
    tamilText: 'எலும்புருக்கி, மேகம், விப்புருதி, வயிற்றுப்பொருமல், கைகால் சந்து உளைவு, கண் எரிச்சல், ஆறு நாளில் உடம்பில் காந்தல் உண்டாகும்.',
    englishText: 'Bone tuberculosis / osteo-cachexia (Elumburukki), deep internal abscess (Vippuruthi), abdominal bloating, severe joint arthralgia, ocular burning, generalized burning within 6 days.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '7 ¼',
    fractionalNumeric: 7.25,
    tamilText: 'இடுப்பில் வாயுப்புகுந்தது, வலி, பிடிப்பு, சிரசில் பித்தம், கண்வலி, பாண்டு, சோகை, கைகால் காந்தல், அதிநித்திரை.',
    englishText: 'Lumbago / entrapment of Vayu in pelvis, muscle spasms, cerebral pitta surge, ophthalmic pain, anemia/pallor (Paandu/Sogai), burning extremities, hypersomnia.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  {
    virarkadai: '7',
    fractionalNumeric: 7.0,
    tamilText: 'பித்தம் சிரசிலேறும், வாயால் இரத்தம் விழும், சயம், கை கால் காந்தல், சிலந்திப்புண் உண்டாகும் உஷ்ணமிகும், மலபந்தியும்.',
    englishText: 'Pitta surges to head, hemoptysis / hematemesis (vomiting/coughing blood), pulmonary phthisis (Sayam), burning extremities, necrotic carbuncles, severe hyperthermia, constipation.',
    category: 'disease_manifestation',
    pageNo: '368'
  },
  // Page 369 - Continued Disease Manifestations
  {
    virarkadai: '6 ¾',
    fractionalNumeric: 6.75,
    tamilText: 'அண்டவாயு, கண்வலி, மயக்கம், மூன்று வருடத்தில் நீராம்பல், கல்லடைப்பு, கைகால் காத்தல், வலி, உளைவு, முகத்தில் வியர்வை யுண்டாம்.',
    englishText: 'Scrotal hernia / hydrocele (Anda-vayu), eye pain, syncopal fainting; within 3 years ascites/edema (Neerambal), urolithiasis (kidney stones), burning extremities, facial diaphoresis.',
    category: 'disease_manifestation',
    pageNo: '369'
  },
  {
    virarkadai: '6 ½',
    fractionalNumeric: 6.5,
    tamilText: 'உடலில் வெதும்பும், குத்தல், தாகம், சூடு, அன்னத்துவேசம், வாதியுமுண்டாகும்.',
    englishText: 'Generalized hyperpyrexia, pricking pain, unquenchable thirst, internal morbid heat, intense anorexia / revulsion to meals, chronic emesis/vomiting.',
    category: 'disease_manifestation',
    pageNo: '369'
  },
  {
    virarkadai: '6 ¼',
    fractionalNumeric: 6.25,
    tamilText: 'மூலக்கிராணி, புளியேப்பம், சத்தி, தொடை வாழை, அரைச்சொறியால் கழிச்சலும் உண்டாகும்.',
    englishText: 'Chronic chronic dysentery/sprue (Moola-kiraani), acid regurgitation/sour eructation, projectile vomiting, inguinal adenitis (Thodai-vaazhai), severe eczema-associated diarrhea.',
    category: 'disease_manifestation',
    pageNo: '369'
  },
  // Pages 369 & 371 - Prognostic / Critical Signs (மரணக் குறிகுணங்கள்)
  {
    virarkadai: '6',
    fractionalNumeric: 6.0,
    tamilText: 'இளைப்பும், நெஞ்சிற் கபமுமுண்டாம் 20 நாளில் மரணமுண்டாகும்.',
    englishText: 'Progressive respiratory exhaustion and dense mucous phlegm blocking chest; critical prognosis indicated within 20 days.',
    category: 'critical_prognosis',
    pageNo: '369 & 371',
    poemVerseTitle: 'ஆறு (6 விரற்கடை)',
    poemVerse: '“ஆறாமாறுலமானதில் கண்டிடில்\nசோறுதலன்றியே சிலேற்பனம் நெஞ்சினில்\nஊறலே அடைத்திடு முள்ளமயங்கிடும்\nமாறும் வேறாகவே மரணம்வந்திடும்”'
  },
  {
    virarkadai: '5 ¾',
    fractionalNumeric: 5.75,
    tamilText: 'சன்னி, மயக்கம், மூர்ச்சையுண்டாகும். சூஞ்சியே கடித்தாலும் மரணம் நிச்சயமாம்.',
    englishText: 'Delirium / profound collapse (Sanni), dizzy stupor, loss of consciousness; critical terminal signs manifest.',
    category: 'critical_prognosis',
    pageNo: '369 & 371',
    poemVerseTitle: 'ஐந்தேகாலேகால் (5¾ விரற்கடை)',
    poemVerse: '“அஞ்சுடன் முக்கால் அளந்து பார்க்கையில்\nமிஞ்சியேசன்னி நோய் மிகுதியாகிடும்\nஅஞ்சவே மயக்கமும் அஸ்தியாகிடும்\nசுஞ்சியே கடித்திடில் காலன் போலுமே”'
  },
  {
    virarkadai: '5 ½',
    fractionalNumeric: 5.5,
    tamilText: 'பிணிகள் அதிகமாகி, விடம் சிரசிலேறி மூக்கு பஞ்சு பொரியும், பல் கறுப்பாகமாறிப் பத்து நாளில் சாவான்.',
    englishText: 'Complications aggravate, systemic toxicity reaches cerebral centers, nasal tip thins like teased cotton, teeth turn dark; grave terminal sign within 10 days.',
    category: 'critical_prognosis',
    pageNo: '369 & 371',
    poemVerseTitle: 'ஐந்தரை (5½ விரற்கடை)',
    poemVerse: '“அஞ்சரை காணுங்கையால் பார்த்ததோர் நோயெல்லாம்\nமிஞ்சியே சிரசினில் விஷமதாகிடும்\nபஞ்சுபோல் மூக்கும் வெண்பல் கருகிடும்\nதஞ்சமாம் பத்துநாள் சாவது திண்ணமே”'
  },
  {
    virarkadai: '5 ¼',
    fractionalNumeric: 5.25,
    tamilText: 'பாதமும் உடம்பும் குன்றிப் போய் தூங்குவது போலிருந்து மறுநாள் மரணம் உண்டாகும்.',
    englishText: 'Wasting of feet and body, comatose state resembling deep slumber; terminal prognosis next day.',
    category: 'critical_prognosis',
    pageNo: '371'
  },
  {
    virarkadai: '5',
    fractionalNumeric: 5.0,
    tamilText: 'உடல் வெளுத்துக் குளிர்ந்திடும், தொண்டையிற் கபமடைத்து, உடல்பற்றி மரணம் நிச்சயம்.',
    englishText: 'Body turns pale and cold as ice, dense tracheal rattle/mucus plugs throat; critical circulatory collapse.',
    category: 'critical_prognosis',
    pageNo: '371'
  },
  {
    virarkadai: '4 ¾',
    fractionalNumeric: 4.75,
    tamilText: 'உடலின் நிலைமையை நாம் அறிய முடியாதாகும். நாவறண்டு நடுக்க முண்டாகும். ஏழு நாளில் மரணம் நிச்சயம்.',
    englishText: 'Clinical condition becomes undetectable/inscrutable, dry parched tongue with tremors; critical state within 7 days.',
    category: 'critical_prognosis',
    pageNo: '371'
  },
  {
    virarkadai: '4 ½',
    fractionalNumeric: 4.5,
    tamilText: 'உடல் வீங்கும். கண் குழி விழும். ஒன்பது நாளில் சாவான்.',
    englishText: 'Anasarca / generalized edema, deep sunken eyes; critical terminal signs within 9 days.',
    category: 'critical_prognosis',
    pageNo: '371'
  },
  {
    virarkadai: '4 ¼',
    fractionalNumeric: 4.25,
    tamilText: 'நடுக்கமுண்டாகும் கரவுங்கையும் அசந்து போகும். முகங்கறுக்கும். நெடுமூச்சு வாங்கும். இரண்டு நாளில் மரணம்.',
    englishText: 'Severe involuntary tremors, limbs lose power and tone, facial cyanosis/darkening, agonal/Cheyne-Stokes breathing; terminal state within 2 days.',
    category: 'critical_prognosis',
    pageNo: '371'
  },
  {
    virarkadai: '4',
    fractionalNumeric: 4.0,
    tamilText: 'முகவாட்டம், மயக்கம், கால்களில் வீக்கம் ஐந்து நாளில் சாவது திண்ணமாம்.',
    englishText: 'Haggard sunken facies, deep coma, pedal edema; critical prognosis recorded within 5 days.',
    category: 'critical_prognosis',
    pageNo: '371',
    poemVerseTitle: 'நாலு (4 விரற்கடை)',
    poemVerse: '“தோட்டிய நாலு தட்டமாங் கண்டிடில்\nவாட்டிய முகத்தினில் மயங்கிடும் கண்சூழும்\nமீட்டிய காலுடன் வீக்கமும் முற்றிடும்\nதேட்டிய சாவது திண்ணமுமாஞ்சிவே”'
  }
];

// 25 Authentic Tabular Reference Entries extracted directly from Pages 368–371
export const TRANSCRIBED_BOOK_REFERENCES: ReferenceEntry[] = AUTHENTIC_MANUSCRIPT_TRANSCRIPTION.map((item, index) => {
  const padIndex = (index + 1).toString().padStart(2, '0');
  const cleanPage = item.pageNo.replace(/[^0-9]/g, '').slice(0, 3) || '368';
  const sourceId = `MN-${cleanPage}-${item.fractionalNumeric.toFixed(2).replace('.', '')}`;
  return {
    id: `ref-book-${padIndex}`,
    sourceId,
    minVal: item.fractionalNumeric,
    maxVal: item.fractionalNumeric,
    unit: 'virarkadai',
    traditionalVal: item.virarkadai,
    tamilText: item.tamilText,
    englishText: item.englishText,
    sourceBook: 'நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)',
    pageNo: item.pageNo,
    category: item.category,
    status: 'verified',
    reviewer: 'Academic Faculty Supervisor (Palayamkottai Ref Archive)',
    createdAt: '2026-10-13T19:00:00Z'
  };
});

export const INITIAL_VERIFIED_REFERENCES: ReferenceEntry[] = [
  ...TRANSCRIBED_BOOK_REFERENCES,
  {
    id: 'ref-study-01',
    sourceId: 'MN-STUDY-01',
    minVal: 17.1,
    maxVal: 19.0,
    unit: 'cm',
    traditionalVal: '9 - 10',
    tamilText: 'உடல் வெதும்பி, வாயுவினால் நெஞ்சு, கை, கால் குத்தல், உளைவு, வயிற்றில் வாயுத் திரட்சியும், குன்மமும் உண்டாகும். (2019 பாளையங்கோட்டை ஆய்வில் 9-10 விரற்கடை மிதமான நிலையென முன்மொழியப்பட்டது)',
    englishText: 'Body heat/flush; stabbing pain and aching in chest, hands and legs due to Vayu; flatulence/gaseous distension in abdomen; onset of Gunmam. (Approx. 9–10 virarkadai categorized as mild in 2019 exploratory study; not a diagnostic cut-off).',
    sourceBook: 'நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1) & 2019 Gunmam Study (JOCAMR 8(3))',
    pageNo: '368 & 1-11',
    category: 'disease_manifestation',
    status: 'verified',
    reviewer: 'Siddha Medical Faculty Supervisor (Palayamkottai Ref Archive)',
    createdAt: '2026-10-13T19:00:00Z'
  },
  {
    id: 'ref-study-02',
    sourceId: 'MN-STUDY-02',
    minVal: 14.7,
    maxVal: 16.6,
    unit: 'cm',
    traditionalVal: '7 ¾ - 8 ¾',
    tamilText: 'மூலவாயு, பீனிசம், உடல் காய்தல், எலும்புருக்கி, மேகம், வயிற்றுப்பொருமல், கை கால் காந்தல். (2019 பாளையங்கோட்டை ஆய்வில் 7¾-8¾ விரற்கடை நடுத்தர நிலையென முன்மொழியப்பட்டது)',
    englishText: 'Moola vayu, sinusitis, parched body, bone wasting, flatulence and burning extremities. (Approx. 7¾–8¾ virarkadai categorized as moderate in 2019 exploratory study; requires expert physician evaluation).',
    sourceBook: 'நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1) & 2019 Gunmam Study (JOCAMR 8(3))',
    pageNo: '368 & 1-11',
    category: 'disease_manifestation',
    status: 'verified',
    reviewer: 'Siddha Medical Faculty Supervisor (Palayamkottai Ref Archive)',
    createdAt: '2026-10-13T19:00:00Z'
  },
  {
    id: 'ref-study-03',
    sourceId: 'MN-STUDY-03',
    minVal: 11.9,
    maxVal: 14.3,
    unit: 'cm',
    traditionalVal: '6 ¼ - 7 ½',
    tamilText: 'எலும்புருக்கி, விப்புருதி, இடுப்பில் வாயு, சிரசில் பித்தம், இரத்தம் விழுதல், மூலக்கிராணி. (2019 பாளையங்கோட்டை ஆய்வில் 6¼-7½ விரற்கடை கடுமையான நிலையென முன்மொழியப்பட்டது)',
    englishText: 'Bone wasting, internal abscess, lumbago, cephalic pitta, hemoptysis, chronic sprue. (Approx. 6¼–7½ virarkadai categorized as severe in 2019 exploratory study; purely for educational reference, not clinical staging).',
    sourceBook: 'நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1) & 2019 Gunmam Study (JOCAMR 8(3))',
    pageNo: '368-369 & 1-11',
    category: 'disease_manifestation',
    status: 'verified',
    reviewer: 'Siddha Medical Faculty Supervisor (Palayamkottai Ref Archive)',
    createdAt: '2026-10-13T19:00:00Z'
  }
];

export const RESEARCH_CITATIONS = [
  {
    id: 'cite-1',
    authors: 'Raveendran R, Rajarajeshwari A, Victoria S.',
    title: 'Validation of Siddha Diagnostic Procedure of Manikkadai Nool for Gunmam Patients at Government Siddha Medical College & Hospital, Palayamkottai.',
    journal: 'Journal of Complementary and Alternative Medical Research',
    year: '2019',
    volume: '8(3)',
    pages: '1–11',
    doi: '10.9734/jocamr/2019/v8i330121',
    url: 'https://doi.org/10.9734/jocamr/2019/v8i330121',
    description: 'Investigated wrist circumference thread measurement (Manikkadai Nool) in 50 clinically diagnosed Gunmam patients. Reported an observed inverse correlation between symptom duration/severity and measurement reading.'
  },
  {
    id: 'cite-2',
    authors: 'Raveendran R, Rajarajeshwari A, Victoria S.',
    title: 'Literature Review of Traditional Siddha Diagnostic Method of Manikkadai Nool.',
    journal: 'Journal of Complementary and Alternative Medical Research',
    year: '2019',
    volume: '7(4)',
    pages: '1–5',
    doi: '10.9734/jocamr/2019/v7i430108',
    url: 'https://doi.org/10.9734/jocamr/2019/v7i430108',
    description: 'Historic survey of ancient manuscripts describing Manikkadai Nool, linking procedures to Agasthiyar Soodamani Kajiru Soothiram within the Pathinen Siddhar Naadi Nool lineage.'
  },
  {
    id: 'cite-3',
    authors: 'Vinayak S, Sathiyarajeswaran P, Gayatri R, Priya BK.',
    title: 'Guidelines for Reporting Diagnostic Accuracy Studies of Siddha Anthropometric Tool Manikkadai Nool.',
    journal: 'International Journal of Health Sciences',
    year: '2022',
    volume: '6(S2)',
    pages: '6766–6774',
    doi: '10.53730/ijhs.v6nS2.6766',
    url: 'https://doi.org/10.53730/ijhs.v6nS2.6766',
    description: 'Establishes standardized reporting guidelines for evaluating traditional Siddha anthropometric diagnostic procedures, emphasizing rigorous reference standards, inter-rater reliability, and blinding.'
  },
  {
    id: 'cite-4',
    authors: 'Kabeena AK, Susimitha M, Revathi K.',
    title: 'A Literature Review on Manikkadai Nool a Traditional Diagnostic Tool in Siddha Medicine.',
    journal: 'International Journal of Research and Scientific Innovation',
    year: '2026',
    volume: '13(3)',
    pages: '1–4',
    doi: '10.51244/IJRSI.2026.130300001',
    url: 'https://doi.org/10.51244/IJRSI.2026.130300001',
    description: 'Recent academic synthesis examining classical verses and anthropometric measurement variations across Siddha clinical pedagogy. Emphasizes treating review literature as educational context rather than independent clinical validation.'
  }
];
