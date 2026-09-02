import type { Misconception } from '@/domain/content/types';

/**
 * Named misconceptions.
 *
 * This is what makes "Mina misstag" concept-aware: a wrong answer is tagged
 * with *why* it is tempting, so the app can group mistakes by faulty mental
 * model rather than by question id.
 */
export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'linjetyper',
    label: 'Linjetyperna skiljs inte åt',
    description:
      'Mittlinje och varningslinje uppfattas som samma markering.',
    correction:
      'Mittlinje har korta streck och långa mellanrum. Varningslinje har långa streck och korta mellanrum.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'varningslinje-forbud',
    label: 'Varningslinjen läses som ett förbud',
    description:
      'De långa strecken tolkas som omkörningsförbud.',
    correction:
      'Varningslinjen får korsas. Den varnar för att sikten eller utrymmet är begränsat.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'kombinerad-linje-sida',
    label: 'Fel sida av den kombinerade linjen läses',
    description:
      'Man tittar på linjekombinationen som helhet i stället för på linjen närmast sig.',
    correction:
      'Linjen på din sida avgör. Är den heldragen får du inte korsa, även om den mötande får.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'sparromrade',
    label: 'Spärrområdet antas vara körbart',
    description:
      'Den snedstreckade ytan tas för ett extra körfält eller en ficka.',
    correction:
      'Spärrområdet ska hållas fritt. Det skiljer trafikströmmar åt.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'stopplinje-vs-vajningslinje',
    label: 'Stopplinje förväxlas med väjningslinje',
    description:
      'Trianglarna antas kräva stopp, eller den breda linjen antas räcka med att sakta ner.',
    correction:
      'Bred obruten linje: stanna helt. Trianglar: väjningsplikt, du får rulla vidare om vägen är fri.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'overgang-vs-cykelruta',
    label: 'Bandmarkering förväxlas med rutmarkering',
    description:
      'Övergångsställets band och cykelpassagens rutor uppfattas som samma sak.',
    correction:
      'Band betyder gående, rutor betyder cyklande — och skyldigheterna skiljer sig.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'markering-vs-marke',
    label: 'Rangordningen mellan märke och markering',
    description:
      'Man vet inte vilken som gäller när de säger olika saker.',
    correction:
      'Vägmärket står över vägmarkeringen i rangordningen.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'ledlinje',
    label: 'Ledlinjen misstolkas',
    description:
      'De täta korta strecken läses som väjningsplikt eller som att körfältet tar slut.',
    correction:
      'Ledlinjen visar var körfältet fortsätter genom en korsning.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'alkohol-variation',
    label: 'Promillehalten antas följa mängden',
    description:
      'Man tror att samma mängd alkohol alltid ger samma promillehalt.',
    correction:
      'Vikt, kön, hälsa, drickhastighet och matintag påverkar. Egna tumregler går inte att lita på.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'overinlarning',
    label: 'Nyttan med överinlärning missförstås',
    description:
      'Automatiserat handhavande antas handla om att kunna köra fortare eller klara provet.',
    correction:
      'Överinlärning frigör uppmärksamhet så att den kan läggas på trafiken i stället för på bilen.',
    subcategory: 'korstrategi',
  },
  {
    id: 'ytinlarning',
    label: 'Ytinlärning antas räcka',
    description:
      'Man lär sig utantill inför provet utan att förstå sammanhangen.',
    correction:
      'Ytinlärning glöms snabbt och hjälper inte i situationer som inte liknar frågorna.',
    subcategory: 'korstrategi',
  },
  {
    id: 'sannolikhetsinlarning',
    label: 'Erfarenhet tas för garanti',
    description:
      'Att något sällan händer på en plats tolkas som att det inte kan hända.',
    correction:
      'Sannolikhetsinlärning kan göra dig mer uppmärksam eller mindre. Erfarenhet är en hypotes, inte ett facit.',
    subcategory: 'korstrategi',
  },
  {
    id: 'imitationsinlarning',
    label: 'Imitation antas vara neutral',
    description:
      'Man tar efter en van förare utan att värdera vad som kopieras.',
    correction:
      'Imitation kopierar både goda och dåliga vanor. Vem du tar efter avgör.',
    subcategory: 'korstrategi',
  },
  {
    id: 'mognadsgrader',
    label: 'Regelföljsamhet tas för mognad',
    description:
      'Att följa reglerna antas vara samma sak som att köra moget.',
    correction:
      'Den mogna föraren hanterar även det reglerna inte täcker, lugnt och utan att hävda sin rätt.',
    subcategory: 'attityd-och-grupptryck',
  },
  {
    id: 'unga-forare-risk',
    label: 'Risken antas sjunka direkt med erfarenhet',
    description:
      'Man tror att risktagandet minskar stadigt efter körkortet.',
    correction:
      'Risktagandet ökar ofta efter några år, när självsäkerheten växer snabbare än erfarenheten.',
    subcategory: 'attityd-och-grupptryck',
  },
  {
    id: 'grupptryck',
    label: 'Grupptryckets verkan underskattas',
    description:
      'Man tror att passagerarnas oro inte påverkar den egna körningen.',
    correction:
      'Tidspress i gruppen översätts till fart och krympta marginaler utan att någon ber om det.',
    subcategory: 'attityd-och-grupptryck',
  },
  {
    id: 'passagerarrollen',
    label: 'Passageraren antas böra vara tyst',
    description:
      'Man tror att en invändning stressar föraren och gör körningen sämre.',
    correction:
      'Att säga ifrån lugnt minskar oftast pressen. Att skoja om farten kan tvärtom uppfattas som en uppmaning.',
    subcategory: 'attityd-och-grupptryck',
  },
  {
    id: 'fragan-regler',
    label: 'Att frångå reglerna missförstås',
    description:
      'Antingen antas reglerna aldrig få frångås, eller så tas det som ett fritt val.',
    correction:
      'Det kan vara gott omdöme — men bara när helheten tjänar på det, alla förstår, och du är den som ger.',
    subcategory: 'korstrategi',
  },
  {
    id: 'stressniva',
    label: 'Sambandet mellan stress och prestation',
    description:
      'Man tror att noll stress eller mycket stress ger bäst körning.',
    correction:
      'Måttlig stress höjer prestationen. Hög stress är farligast.',
    subcategory: 'stress-och-kanslor',
  },
  {
    id: 'hog-stress-foljder',
    label: 'Följderna av hög stress underskattas',
    description:
      'Hög stress antas ge skärpa i stället för försämrat omdöme.',
    correction:
      'Hög stress kan ge panik, blackout, uppgivenhet, stirrighet eller tanketröghet.',
    subcategory: 'stress-och-kanslor',
  },
  {
    id: 'minska-stress',
    label: 'Fel åtgärd mot stress',
    description:
      'Man försöker lösa tidspress med fart i stället för med marginal.',
    correction:
      'Gott om tid, utvilad förare och defensiv körning tar bort orsaken.',
    subcategory: 'stress-och-kanslor',
  },
  {
    id: 'kanslor-korning',
    label: 'Känslornas påverkan förnekas',
    description:
      'Man tror att starka känslor inte påverkar körförmågan.',
    correction:
      'Starka känslor tar uppmärksamhet och sänker tröskeln för impulsiva beslut.',
    subcategory: 'stress-och-kanslor',
  },
  {
    id: 'alkohol-tidig-effekt',
    label: 'Tidig alkoholpåverkan underskattas',
    description:
      'Man tror att påverkan börjar först när berusningen känns.',
    correction:
      'Redan vid 0,1-0,4 promille släpper spärrar, förmågan överskattas och reaktionstiden försämras.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'alkohol-myter',
    label: 'Myter om att nyktra till',
    description:
      'Kaffe, dusch eller bastu antas påskynda nedbrytningen.',
    correction:
      'Förbränningen går inte att påverka. Bara tiden nyktrar till.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'dagen-efter',
    label: 'Noll promille tas för återställd',
    description:
      'Man antar att man är opåverkad så snart alkoholen lämnat blodet.',
    correction:
      'Trötthet och sämre koncentration finns ofta kvar dagen efter, utan att synas i ett utandningsprov.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'medhjalp-rattfylleri',
    label: 'Ansvaret antas ligga bara på föraren',
    description:
      'Man tror att den som lånar ut bilen eller bjuder på alkohol står utanför.',
    correction:
      'Att låna ut bilen till någon du vet är påverkad kan vara straffbar medhjälp.',
    subcategory: 'alkohol-gransvarden',
  },
  {
    id: 'rattfylleri-plats',
    label: 'Rattfyllerilagens räckvidd begränsas',
    description:
      'Lagen antas gälla bara på allmän väg.',
    correction:
      'Den gäller överallt, även på privat mark och inom inhägnat område, och för alla motordrivna fordon.',
    subcategory: 'alkohol-gransvarden',
  },
  {
    id: 'lakemedel-ansvar',
    label: 'Receptet antas fria från ansvar',
    description:
      'Man tror att utskriven medicin gör körningen tillåten oavsett påverkan.',
    correction:
      'Det är ditt ansvar att bedöma om läkemedlet gör dig trafikfarlig. Receptet ändrar inte det.',
    subcategory: 'droger-lakemedel',
  },
  {
    id: 'narkotika-grans',
    label: 'Gränsen för narkotika i trafiken',
    description:
      'Man antar att det finns ett gränsvärde som för alkohol.',
    correction:
      'Nolltolerans gäller. Undantaget är narkotikaklassade läkemedel som läkare skrivit ut.',
    subcategory: 'droger-lakemedel',
  },
  {
    id: 'vakenhetshojande',
    label: 'Vakenhetshöjande droger antas motverka trötthet',
    description:
      'Man tror att tröttheten försvinner i stället för att förträngas.',
    correction:
      'Tröttheten finns kvar under ytan och föraren kan somna utan förvarning.',
    subcategory: 'droger-lakemedel',
  },
  {
    id: 'kombination-alkohol-lakemedel',
    label: 'Kombinationseffekter underskattas',
    description:
      'Man tror att små mängder alkohol och medicin tar ut varandra eller kan räknas var för sig.',
    correction:
      'Effekterna kan förstärka varandra så att påverkan blir större än summan av delarna.',
    subcategory: 'droger-lakemedel',
  },
  {
    id: 'somnbrist-alkohol',
    label: 'Sömnbristens effekt underskattas',
    description:
      'Man jämför inte sömnbrist med alkoholpåverkan.',
    correction:
      'En natt utan sömn ger en reaktionstid i klass med en rattfull förare.',
    subcategory: 'trotthet',
  },
  {
    id: 'monotoni',
    label: 'Monotoni som trötthetsorsak missas',
    description:
      'Den lättaste vägtypen antas vara den minst tröttande.',
    correction:
      'Breda, långa och raka vägar utan avbrott ökar risken för trötthet mest.',
    subcategory: 'trotthet',
  },
  {
    id: 'trotthetssignaler',
    label: 'Trötthetssignaler känns inte igen',
    description:
      'Man väntar på att bli sömnig i stället för att läsa de tidiga tecknen.',
    correction:
      'Ojämn hastighet, suddig blick, gäspningar, torr mun och frusenhet kommer före mikrosömnen.',
    subcategory: 'trotthet',
  },
  {
    id: 'mikrosomn',
    label: 'Mikrosömn tolkas som ouppmärksamhet',
    description:
      'Minneshålet efteråt uppfattas inte som sömn.',
    correction:
      'Mikrosömn är sekunder av bortkoppling. I 110 km/h är fem sekunder över 150 meter utan förare.',
    subcategory: 'trotthet',
  },
  {
    id: 'barns-sinnen',
    label: 'Barns sinnen antas fungera som vuxnas',
    description:
      'Man förväntar sig vuxen reaktionstid och ljudlokalisering.',
    correction:
      'Barn växlar långsammare mellan när- och fjärrseende och har svårare att avgöra varifrån ett ljud kommer.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'barns-riskbedomning',
    label: 'Barns förmåga att bedöma fart överskattas',
    description:
      'Man tror att ett barn uppfattar skillnaden mellan en snabb och en långsam bil.',
    correction:
      'Ett barn bedömer en långsam och en snabb bil ungefär likadant.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'barn-skymd',
    label: 'Barn bakom parkerade fordon',
    description:
      'Man utgår från att en gående syns över eller bredvid en parkerad bil.',
    correction:
      'Ett barn kan döljas helt, så det finns ingen förvarning innan det står i gatan.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'barn-buss',
    label: 'Risken vid en stillastående buss placeras fel',
    description:
      'Man tittar bakom bussen i stället för framför den.',
    correction:
      'Framför bussen är sikten sämst åt båda håll, och det är där någon kliver ut.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'vilt-tidpunkt',
    label: 'Viltrisken tidsbestäms fel',
    description:
      'Man tror att risken är jämn över dygnet.',
    correction:
      'Gryning och skymning är värst, liksom maj-juni och september-oktober.',
    subcategory: 'djur-pa-vagen',
  },
  {
    id: 'alg-undanmanover',
    label: 'Fel undanmanöver vid älg',
    description:
      'Man styr framför älgen i tron att den vänder tillbaka.',
    correction:
      'En älg som börjat gå över fortsätter oftast över. Sikta bakom den.',
    subcategory: 'djur-pa-vagen',
  },
  {
    id: 'viltolycka-atgard',
    label: 'Skyldigheterna efter en viltolycka',
    description:
      'Man tror att ett djur som sprang i väg inte behöver anmälas.',
    correction:
      'Märk ut platsen och kontakta polisen, så att jägare kan spåra det skadade djuret.',
    subcategory: 'djur-pa-vagen',
  },
  {
    id: 'riskkompensation',
    label: 'Säkerhetsvinsten antas bli kvar',
    description:
      'Bättre däck och system antas ge motsvarande större marginal.',
    correction:
      'Vinsten äts ofta upp av högre fart. Den blir verklig först om körsättet är oförändrat.',
    subcategory: 'riskbedomning',
  },
  {
    id: 'utfall-vs-beslut',
    label: 'Utfallet tas som bevis för beslutet',
    description:
      'Att det gick bra tolkas som att marginalen var tillräcklig.',
    correction:
      'Ett bra utfall bevisar inte ett bra beslut. Ibland avgjorde turen.',
    subcategory: 'riskbedomning',
  },
  {
    id: 'rutin-uppmarksamhet',
    label: 'Rutin antas göra körningen säkrare',
    description:
      'Man tror att en välkänd sträcka kräver mindre uppmärksamhet.',
    correction:
      'Förväntan styr vad vi ser. På en känd sträcka missas det ovanliga lättare.',
    subcategory: 'riskbedomning',
  },
  {
    id: 'handsfree',
    label: 'Handsfree antas ta bort risken',
    description:
      'Risken antas sitta i handen snarare än i uppmärksamheten.',
    correction:
      'Samtalet tar kognitiv kapacitet. Blicken kan vara riktad framåt utan att informationen bearbetas.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'blicktid-strackan',
    label: 'Blicktid räknas inte om till sträcka',
    description:
      'Några sekunders blick nedåt uppfattas som en kort stund.',
    correction:
      'Räkna om: 90 km/h är 25 meter i sekunden, så två sekunder är femtio meter blint.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'utryckning-reaktion',
    label: 'Fel reaktion på utryckningsfordon',
    description:
      'Man tvärstannar, kör mot rött eller ökar farten i stället för att lämna plats säkert.',
    correction:
      'Lämna fri väg så snart det kan ske säkert — men bryt aldrig mot rött ljus för att göra det.',
    subcategory: 'vagens-anvandning',
  },
  {
    id: 'gult-ljus',
    label: 'Gult ljus tolkas som en uppmaning att skynda',
    description:
      'Man accelererar för att hinna igenom, eller tror att gult saknar verkan.',
    correction:
      'Gult betyder stanna, om det kan ske utan fara.',
    subcategory: 'trafiksignaler',
  },
  {
    id: 'mittlinje-kantlinje',
    label: 'Mittlinje och kantlinje blandas ihop',
    description:
      'Linjernas funktion antas bero på om de är heldragna eller streckade.',
    correction:
      'Mittlinjen skiljer körriktningar. Kantlinjen markerar var körbanan slutar.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'rattfylleri-grans',
    label: 'Gränsen för grovt rattfylleri',
    description:
      'Gränsen för grovt rattfylleri blandas ihop med gränsen för rattfylleri.',
    correction:
      'Rattfylleri fran 0,2 promille. Grovt rattfylleri fran 1,0 promille.',
    subcategory: 'alkohol-gransvarden',
  },
  {
    id: 'halvljus-nar',
    label: 'Kravet på halvljus begränsas till mörker',
    description:
      'Man tror att halvljus behövs först när det är helt mörkt.',
    correction:
      'Halvljus krävs i mörker, gryning, skymning och vid nedsatt sikt.',
    subcategory: 'ljusanvandning',
  },
  {
    id: 'tio-meter-regeln',
    label: 'Tiometersregeln missas eller tillämpas åt fel håll',
    description:
      'Avståndet glöms, eller antas gälla även efter övergångsstället.',
    correction:
      'Tio meter före övergångsställe, korsande cykelbana och vägkorsning.',
    subcategory: 'stannande-forbud',
  },
  {
    id: 'motorvag-forbud',
    label: 'Motorvägens förbud blandas ihop',
    description:
      'Omkörning eller körfältsbyte antas vara förbjudet på motorväg.',
    correction:
      'Förbjudet är att backa, vända, stanna och gå på vägbanan.',
    subcategory: 'motorvag-regler',
  },
  {
    id: 'p-skylt',
    label: 'Parkeringsmärket misstolkas',
    description:
      'Den blå P-skylten läses som förbud eller som en avgiftsanvisning.',
    correction:
      'Blå fyrkant med P betyder tillåten parkering. Tilläggstavlorna sätter villkoren.',
    subcategory: 'parkeringsregler',
  },
  {
    id: 'flera-marken-stolpe',
    label: 'Flera märken på samma stolpe läses inte ihop',
    description:
      'Bara det översta märket registreras, eller märkena tillskrivs fel innebörd.',
    correction:
      'Läs stolpen uppifrån och ner: hastighet, företräde och orientering är olika besked.',
    subcategory: 'hastighetsgranser',
  },
  {
    id: 'avfart-hastighet',
    label: 'Avfartens hastighet tillämpas fel',
    description:
      'Skylten vid avfarten antas gälla motorvägen, eller först längre fram.',
    correction:
      'Avfartens hastighetsskylt gäller avfarten. Sänk farten i retardationsfältet.',
    subcategory: 'pafart-avfart',
  },
  {
    id: 'gron-bla-vagvisning',
    label: 'Grön och blå vägvisning blandas ihop',
    description:
      'Färgen på vägvisaren antas sakna betydelse.',
    correction:
      'Grön botten visar den fortsatta motorvägsfärden, blå det du når via avfarten.',
    subcategory: 'anvisningsmarken',
  },
  {
    id: 'kryssmarke',
    label: 'Kryssmärket misstolkas',
    description:
      'Märket läses som stoppkrav eller som en avstängning.',
    correction:
      'Kryssmärket markerar att järnvägen korsar vägen. Signalen och sikten avgör om du ska stanna.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'pabud-vs-rekommendation',
    label: 'Påbudsmärket tas för en rekommendation',
    description:
      'Den blå runda skylten läses som ett förslag eller en upplysning.',
    correction:
      'Rund blå skylt är ett påbud. Fyrkantig blå skylt är en upplysning.',
    subcategory: 'pabudsmarken',
  },
  {
    id: 'vagvisare-anvandning',
    label: 'Vägvisaren används för sent',
    description:
      'Tavlan läses först i korsningen, när körfältsvalet redan är gjort.',
    correction:
      'Vägvisaren finns för att du ska välja körfält i god tid.',
    subcategory: 'anvisningsmarken',
  },
  {
    id: 'stillastaende-vagren',
    label: 'Stillastående fordon på vägrenen underskattas',
    description:
      'Fordonet antas ofarligt eftersom det står utanför körbanan.',
    correction:
      'Räkna med människor utanför bilen. Öka sidoavståndet i stället för att bromsa hårt.',
    subcategory: 'motorvag-regler',
  },
  {
    id: 'sammanvavning',
    label: 'Sammanvävning antas ha en företrädesregel',
    description:
      'Man tror att det genomgående körfältet, eller den som kommer först, har företräde.',
    correction:
      'Vid vävning har ingen företräde. Båda ska anpassa farten och underlätta för varandra.',
    subcategory: 'pafart-avfart',
  },
  {
    id: 'omkorning-sikt',
    label: 'Siktkravet vid omkörning underskattas',
    description:
      'Sikten räknas fram till fordonet framför i stället för hela omkörningsförloppet.',
    correction:
      'Sikten måste räcka för att köra om och komma tillbaka in med marginal.',
    subcategory: 'omkorningsregler',
  },
  {
    id: 'vagkant-risk',
    label: 'Den lösa vägkantens risk missförstås',
    description:
      'Vägkanten antas vara en säkerhetsmarginal snarare än en risk.',
    correction:
      'En lös kant ger efter under hjulet. Placera dig en bit in i körfältet.',
    subcategory: 'landsvag',
  },
  {
    id: 'tillfalliga-anvisningar',
    label: 'Tillfälliga anvisningar rangordnas fel',
    description:
      'De permanenta märkena antas gälla före de tillfälliga vid vägarbete.',
    correction:
      'Tillfälliga anvisningar vid vägarbete gäller före de ordinarie märkena.',
    subcategory: 'korfalt-och-sving',
  },
  {
    id: 'buss-risk',
    label: 'Risken vid en stillastående buss missbedöms',
    description:
      'Man fokuserar på bussens egen manöver i stället för på människorna den skymmer.',
    correction:
      'Den som kliver av ser inte dig. Sänk farten och håll sidoavstånd.',
    subcategory: 'skymd-sikt',
  },
  {
    id: 'snotackt-vag',
    label: 'Snötäckt vägbana bedöms som en vanlig väg',
    description:
      'Man utgår från att körbanans bredd går att se.',
    correction:
      'Utan synliga kantlinjer är vägens bredd en gissning. Sänk farten.',
    subcategory: 'vinterkorning',
  },
  {
    id: 'kantlinje',
    label: 'Kantlinjens betydelse missförstås',
    description:
      'Linjen läses som omkörningsförbud eller som en gräns för parkering.',
    correction:
      'Kantlinjen markerar var körbanan slutar. Utanför den är vägren.',
    subcategory: 'landsvag',
  },
  {
    id: 'form-farg-system',
    label: 'Märkets form och färg läses inte',
    description:
      'Symbolen granskas medan formen och färgen — som bär budskapet på håll — förbigås.',
    correction:
      'Gul triangel varnar, röd ring förbjuder, blå rund påbjuder, blå fyrkant upplyser.',
    subcategory: 'varningsmarken',
  },
  {
    id: 'stopp-vs-vajning',
    label: 'Väjningsplikt förväxlas med stopplikt',
    description:
      'Man tror att väjningsplikt kräver stopp, eller att stopplikt räcker med att sakta ner.',
    correction:
      'Väjningsplikt: du får rulla vidare om vägen är fri. Stopplikt: fordonet ska stå helt stilla.',
    subcategory: 'vajningsplikt',
  },
  {
    id: 'huvudled-innebord',
    label: 'Huvudledsmärket misstolkas',
    description:
      'Den gula romben läses som väjningsplikt eller som en cirkulationsplats.',
    correction:
      'Huvudled betyder att korsande trafik har väjningsplikt mot dig.',
    subcategory: 'huvudled',
  },
  {
    id: 'forbud-infart-innebord',
    label: 'Förbud mot infart misstolkas',
    description:
      'Märket läses som stoppförbud eller som att gatan är helt avstängd.',
    correction:
      'C1 förbjuder infart med fordon, oftast för att gatan är enkelriktad åt andra hållet.',
    subcategory: 'forbudsmarken',
  },
  {
    id: 'rekommenderad-vs-grans',
    label: 'Rekommenderad hastighet tas för en gräns',
    description:
      'En blå hastighetsskylt läses som ett förbud, eller ett förbud som en rekommendation.',
    correction:
      'Röd ram är ett tak. Blå skylt är ett råd — den skyltade gränsen gäller fortfarande.',
    subcategory: 'hastighetsgranser',
  },
  {
    id: 'omkorningsforbud-omfattning',
    label: 'Omkörningsförbudets omfattning',
    description:
      'Man tror att förbudet gäller alla fordon, eller att långsamma fordon är undantagna.',
    correction:
      'Förbudet gäller motordrivna fordon på fler än två hjul. Cykel och moped får passeras.',
    subcategory: 'omkorningsforbud',
  },
  {
    id: 'slutmarke-tillater',
    label: 'Slutmärket läses som ett tillstånd',
    description:
      'Att ett förbud upphör tolkas som att manövern nu är lämplig.',
    correction:
      'Ett slutmärke tar bort ett förbud. Sikt, mötande trafik och vägmarkeringar avgör ändå.',
    subcategory: 'omkorningsforbud',
  },
  {
    id: 'cirk-marke-vs-varning',
    label: 'Cirkulationsmärket förväxlas med varningsmärket',
    description:
      'Påbudsmärket D3 blandas ihop med varningsmärket A30, eller antas ge företräde.',
    correction:
      'D3 är platsen, A30 är förvarningen. Ingetdera ger dig företräde in i cirkulationen.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'motorvag-vs-motortrafikled',
    label: 'Motorväg förväxlas med motortrafikled',
    description:
      'De två skyltarna och regelverken behandlas som utbytbara.',
    correction:
      'Motortrafikleden har ofta ett körfält per riktning och kan ha mötande trafik. 110 km/h som bashastighet gäller motorväg.',
    subcategory: 'motortrafikled',
  },
  {
    id: 'motorvag-upphor-fart',
    label: 'Farten behålls när motorvägen upphör',
    description:
      'Man håller motorvägsfarten tills en ny skylt syns.',
    correction:
      'Efter E2 kan korsande trafik och gående förekomma. Sänk farten i god tid.',
    subcategory: 'motorvag-regler',
  },
  {
    id: 'gagata-vs-gangfart',
    label: 'Gågata förväxlas med gångfartsområde',
    description:
      'De två anvisningsmärkena antas betyda samma sak.',
    correction:
      'Gågatan begränsar vem som får köra. Gångfartsområdet begränsar hur du får köra.',
    subcategory: 'anvisningsmarken',
  },
  {
    id: 'boende-tavla',
    label: 'Tilläggstavlan Boende förbises',
    description:
      'Parkeringsrätten antas gälla alla trots att tavlan begränsar den.',
    correction:
      'Tavlan inskränker huvudmärket till boende med tillstånd.',
    subcategory: 'parkeringsregler',
  },
  {
    id: 'avstand-vs-utstrackning',
    label: 'Avstånd förväxlas med utsträckning',
    description:
      'T2 och T11 antas betyda samma sak.',
    correction:
      'Avstånd säger var regeln börjar. Utsträckning säger hur lång sträcka den gäller.',
    subcategory: 'anvisningsmarken',
  },
  {
    id: 'riktning-tavla',
    label: 'Riktningstavlan misstolkas',
    description:
      'Pilen läses som hur fordonet ska ställas, eller som ett påbud att svänga.',
    correction:
      'Riktningstavlan visar åt vilket håll från skylten huvudmärket gäller.',
    subcategory: 'parkeringsregler',
  },
  {
    id: 'varning-ger-foretrade',
    label: 'Varningsmärket antas ge företräde',
    description:
      'Att vara förvarnad om en korsning tolkas som att man kör först.',
    correction:
      'Ett varningsmärke reglerar aldrig företrädet. Vid A28 gäller högerregeln.',
    subcategory: 'varningsmarken',
  },
  {
    id: 'varning-barn-reaktion',
    label: 'Fel reaktion på varning för barn',
    description:
      'Man behåller farten eller tutar i stället för att skapa marginal.',
    correction:
      'Sänk farten och räkna med att ett barn kan springa ut utan förvarning.',
    subcategory: 'varningsmarken',
  },
  {
    id: 'varningsmarken-symbol',
    label: 'Varningsmärkets symbol läses fel',
    description:
      'Symbolen förväxlas med ett annat varningsmärkes.',
    correction:
      'Läs symbolen tillsammans med sammanhanget: väglag, vägtyp och vad som rimligen kan komma.',
    subcategory: 'varningsmarken',
  },
  {
    id: 'stopplinje',
    label: 'Stopplinjens funktion missförstås',
    description:
      'Linjen tolkas som en parkeringsgräns eller som en markering för omkörning.',
    correction:
      'Stopplinjen visar var fordonet ska stå stilla. Saknas den stannar du där du har sikt.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'vajningslinje',
    label: 'Väjningslinjen misstolkas',
    description:
      'Trianglarna i vägbanan läses som en cykelpassage eller som stopplikt.',
    correction:
      'Väjningslinjen markerar var väjningsplikten gäller. Den kräver inte att du stannar.',
    subcategory: 'vagmarkeringar',
  },
  {
    id: 'rangordning-anvisningar',
    label: 'Rangordningen mellan anvisningar',
    description:
      'Man vet inte vilken anvisning som gäller när två säger olika saker.',
    correction:
      'Polis före trafiksignal, trafiksignal före vägmärke, vägmärke före generella regler.',
    subcategory: 'polisens-tecken',
  },
  {
    id: 'vagvisare-undantag',
    label: 'Körfältsvägvisarens undantag missas',
    description:
      'Man håller fast vid högra körfältet trots att körfälten leder till olika mål.',
    correction:
      'Leder körfälten till olika färdmål enligt vägvisaren får du välja det som passar din fortsatta färd.',
    subcategory: 'placering',
  },
  {
    id: 'flervagsstopp',
    label: 'Flervägsstopp misstolkas',
    description:
      'Tavlan tolkas som upprepad stopplikt längs vägen, eller som en lättnad.',
    correction:
      'Flervägsstopp betyder att alla tillfarter till korsningen har stopplikt. Du ska ändå stanna helt.',
    subcategory: 'stopplikt',
  },
  {
    id: 'stopplikt-rullstopp',
    label: 'Stopplikt tas som en kraftig inbromsning',
    description:
      'Man rullar förbi i låg fart när vägen ser fri ut.',
    correction:
      'Stopplikt betyder att fordonet ska stå helt stilla, oavsett om något kommer.',
    subcategory: 'stopplikt',
  },
  {
    id: 'bredaste-vagen',
    label: 'Vägens utseende tas för väjningsregel',
    description:
      'Bredd, beläggning eller trafikmängd antas avgöra vem som har företräde.',
    correction:
      'Bara märken, markeringar och signaler ändrar högerregeln. Utseendet betyder ingenting.',
    subcategory: 'hogerregeln',
  },
  {
    id: 'tungt-fordon-tid',
    label: 'Tunga fordons tidsbehov underskattas',
    description:
      'Ett tungt fordon antas kunna stanna och accelerera som en personbil.',
    correction:
      'Ett långt, tungt fordon är kvar i korsningen betydligt längre och bromsar sämre.',
    subcategory: 'vajningsplikt',
  },
  {
    id: 'gul-tavla-forbud',
    label: 'Gul tilläggstavla läses som tillåtelse',
    description:
      'Tider på gul botten med röd ring tolkas som när parkering är tillåten.',
    correction:
      'Gul botten med röd ring betyder förbud. Tiderna anger när förbudet gäller.',
    subcategory: 'parkeringsregler',
  },
  {
    id: 'parentes-tider',
    label: 'Tider inom parentes misstolkas',
    description:
      'Parentestiderna antas gälla söndagar, sommartid eller vara en rekommendation.',
    correction:
      'Svarta siffror gäller vardagar, parentes gäller lördag och dag före helgdag, röda siffror sön- och helgdag.',
    subcategory: 'parkeringsregler',
  },
  {
    id: 'gangfartsomrade-regler',
    label: 'Gångfartsområdets regler blandas ihop',
    description:
      'Området antas ha 30 km/h, eller att gående skulle väja för fordon.',
    correction:
      'Gångfart, väjningsplikt mot gående och parkering endast på anvisade platser.',
    subcategory: 'anvisningsmarken',
  },
  {
    id: 'omkorning-vinter',
    label: 'Väglaget vägs inte in i omkörningsbeslutet',
    description:
      'Man bedömer bara sikten och glömmer att greppet avgör hur omkörningen går.',
    correction:
      'Omkörning kräver grepp för både acceleration och återinträde. Snömodd gör greppet oförutsägbart.',
    subcategory: 'omkorningsregler',
  },
  {
    id: 'visa-avsikt',
    label: 'Väjningsplikten utförs otydligt',
    description:
      'Man bromsar sent eller ger tecken på annat sätt i stället för att tydligt sänka farten i god tid.',
    correction:
      'Visa avsikten genom att i god tid sänka hastigheten eller stanna, så att den gående vågar gå.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'reaktionsstracka-berakning',
    label: 'Reaktionssträckan räknas fel',
    description:
      'Formeln blandas ihop med bromssträckans, eller multiplikationen med 3 glöms.',
    correction:
      'Stryk sista siffran i hastigheten, multiplicera med reaktionstiden och sedan med 3.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'reaktionstid-effekt',
    label: 'Reaktionstidens effekt missförstås',
    description:
      'Man tror att reaktionssträckan växer kvadratiskt med reaktionstiden.',
    correction:
      'Reaktionssträckan växer rakt av: dubbel reaktionstid ger dubbelt så lång sträcka.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'bromsstracka-berakning',
    label: 'Bromssträckan räknas fel',
    description:
      'Kvadreringen eller faktorn 0,4 hoppas över.',
    correction:
      'Stryk sista siffran, multiplicera den med sig själv och sedan med 0,4.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'stoppstracka-berakning',
    label: 'Bara en av delsträckorna räknas',
    description:
      'Man svarar med enbart bromssträckan eller enbart reaktionssträckan.',
    correction:
      'Stoppsträckan är alltid reaktionssträcka plus bromssträcka.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'kvadratisk-okning',
    label: 'Hastighetens effekt antas vara linjär',
    description:
      'Dubbel hastighet antas ge dubbelt så lång bromssträcka.',
    correction:
      'Bromssträckan växer med kvadraten: dubbel fart ger fyra gånger sträckan.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'halka-bromsstracka',
    label: 'Halkans effekt på bromssträckan underskattas',
    description:
      'Man tror att is förlänger bromssträckan måttligt, eller att ABS löser det.',
    correction:
      'På is kan bromssträckan bli omkring tio gånger längre. ABS bevarar styrförmågan, inte sträckan.',
    subcategory: 'halka',
  },
  {
    id: 'km-till-meter',
    label: 'Omvandling km/h till m/s',
    description:
      'Hastigheten delas med fel tal eller uppskattas fritt.',
    correction:
      'Dela hastigheten i km/h med 3,6 för att få meter per sekund.',
    subcategory: 'anpassad-hastighet',
  },
  {
    id: 'sekundregel-avstand',
    label: 'Sekundregeln räknas inte om till meter',
    description:
      'Avståndet i sekunder översätts fel till meter.',
    correction:
      'Räkna först om farten till meter per sekund, och multiplicera sedan med antalet sekunder.',
    subcategory: 'avstand',
  },
  {
    id: 'reaktionstid-bilen',
    label: 'Reaktionstiden antas bero på bilen',
    description:
      'Slitna däck eller dåliga bromsar tros förlänga reaktionstiden.',
    correction:
      'Reaktionstiden är din. Bilens skick påverkar bromssträckan.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'bromsstracka-faktorer',
    label: 'Faktorerna för brom- och reaktionssträcka blandas',
    description:
      'Reaktionstiden räknas in bland det som påverkar bromssträckan.',
    correction:
      'Bromssträckan påverkas av hastighet, väglag, lutning, last och bromsarnas skick.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'skylt-som-facit',
    label: 'Hastighetsskylten tas som facit',
    description:
      'Man antar att skyltad hastighet alltid är en tillåten och lämplig hastighet.',
    correction:
      'Skylten är ett tak. Hastigheten ska dessutom anpassas till sikt, väglag och trafik.',
    subcategory: 'rattspraxis',
  },
  {
    id: 'deformation-hard-battre',
    label: 'Hård front antas vara säkrare',
    description:
      'Man tror att en styv front skyddar bättre än en som trycks ihop.',
    correction:
      'Deformationszonen förlänger krocken i tid och sänker därmed krafterna på kroppen.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'sidokrock',
    label: 'Sidokollisionens risk underskattas',
    description:
      'Sidan antas skydda ungefär lika bra som fronten.',
    correction:
      'I sidled finns nästan ingen deformationszon — ytan som tar upp kraften är bara några decimeter.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'baltesansvar',
    label: 'Ansvaret för barns bältesanvändning',
    description:
      'Ansvaret antas ligga på barnet eller på vårdnadshavaren i stället för på föraren.',
    correction:
      'Föraren ansvarar för att passagerare under 15 år använder bälte.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'baltesplacering',
    label: 'Bältet placeras fel över axeln',
    description:
      'Bältets övre del läggs ut på axeln eller under armen.',
    correction:
      'Övre delen ska ligga så nära halsen som möjligt, och tjocka jackor ska av.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'airbag-barnstol',
    label: 'Krockkudde lämnas på vid bakåtvänd barnstol',
    description:
      'Man tror att krockkudden kan vara aktiv, eventuellt beroende på barnets ålder.',
    correction:
      'Krockkudden måste alltid kopplas ur när en bakåtvänd stol står på platsen.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'airbag-ersatter-balte',
    label: 'Krockkudden antas ersätta bältet',
    description:
      'Kudden tros ge fullgott skydd även utan bälte.',
    correction:
      'Krockkudden är ett komplement. Utan bälte kan den i stället orsaka svåra skador.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'nackskydd',
    label: 'Nackskyddet ses som bekvämlighet',
    description:
      'Skyddet ställs lågt eller lämnas oinställt.',
    correction:
      'Ställ det så högt att huvudet inte åker över kanten. Det skyddar mot whiplash.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'barnskydd-grans',
    label: 'Gränsen för barnskydd antas vara ålder',
    description:
      'Man utgår från ålder eller vikt i stället för längd.',
    correction:
      'Barn kortare än 135 cm ska ha särskilt barnskydd.',
    subcategory: 'krocksakerhet',
  },
  {
    id: 'trafikantbegrepp',
    label: 'Trafikant antas betyda bilförare',
    description:
      'Begreppet begränsas till motorfordon eller till den som har körkort.',
    correction:
      'Alla som befinner sig på en väg är trafikanter, även gående och ryttare.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'lattlastbil-fart',
    label: 'Lätt lastbil antas ha eget hastighetstak',
    description:
      'Man tror att lätta lastbilar har en egen maxhastighet.',
    correction:
      'För lätt lastbil gäller vägens hastighetsbestämmelser, precis som för personbil.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'slap-hastighet',
    label: 'Hastighetstaket med släp glöms',
    description:
      'Man kör efter vägens skylt trots släp bakom bilen.',
    correction:
      'Med bromsad släpvagn är taket 80 km/h, oavsett vad skylten visar.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'bogsering-fart',
    label: 'Hastigheten vid bogsering överskattas',
    description:
      'Man tror att bogsering får ske i normal trafikrytm.',
    correction:
      'Vid bogsering av en annan bil är gränsen 30 km/h.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'mopedklasser',
    label: 'Mopedklasserna blandas ihop',
    description:
      'Skillnaden antas handla om drivmedel eller körkortskrav.',
    correction:
      'Klass I är EU-moped upp till 45 km/h och räknas som motorfordon. Klass II är långsammare.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'andra-fordons-fart',
    label: 'Andras hastighetstak används fel',
    description:
      'Kunskapen om andra fordons maxfart tolkas som en egen rättighet.',
    correction:
      'Den hjälper dig planera omkörningen. Din egen hastighetsgräns gäller ändå.',
    subcategory: 'fordonsslag',
  },
  {
    id: 'trafikforsakring-omfattning',
    label: 'Trafikförsäkringen antas täcka egen bil',
    description:
      'Man tror att den obligatoriska försäkringen ersätter skador på det egna fordonet.',
    correction:
      'Trafikförsäkringen täcker personskador och skador på andras egendom — aldrig din egen bil.',
    subcategory: 'forsakring',
  },
  {
    id: 'forsakringsplikt',
    label: 'Kravet på trafikförsäkring begränsas',
    description:
      'Försäkringsplikten antas gälla bara vissa fordonstyper eller åldrar.',
    correction:
      'Alla motordrivna fordon i trafik måste vara trafikförsäkrade.',
    subcategory: 'forsakring',
  },
  {
    id: 'halv-vs-hel',
    label: 'Halv- och helförsäkring blandas ihop',
    description:
      'Skador på egen bil vid olycka antas ingå i halvförsäkringen.',
    correction:
      'Halvförsäkring täcker bland annat stöld, brand, glas och rättsskydd. Egen bil vid olycka kräver helförsäkring.',
    subcategory: 'forsakring',
  },
  {
    id: 'regressratt',
    label: 'Försäkringen antas skydda vid rattfylleri',
    description:
      'Man tror att bolaget bär kostnaden även efter grov vårdslöshet eller rattfylleri.',
    correction:
      'Bolaget kan använda sin regressrätt och kräva tillbaka pengarna av dig.',
    subcategory: 'forsakring',
  },
  {
    id: 'regbevis-delar',
    label: 'Registreringsbevisets delar förväxlas',
    description:
      'Del 1 och Del 2 antas ha samma användning.',
    correction:
      'Del 1 rör fordonet och används för på- och avställning. Del 2 är ägarbeviset och används vid ägarbyte.',
    subcategory: 'registrering',
  },
  {
    id: 'avstallning-automatisk',
    label: 'Avställning antas ske automatiskt',
    description:
      'Körförbud, obetald skatt eller långt stillestånd tros ställa av fordonet.',
    correction:
      'Ett fordon ställs aldrig av automatiskt — du måste själv anmäla det.',
    subcategory: 'registrering',
  },
  {
    id: 'avstallt-korning',
    label: 'Avställt fordon antas få köras fritt',
    description:
      'Man tror att korta sträckor eller betald försäkring gör körningen tillåten.',
    correction:
      'Ett avställt fordon får endast köras till och från besiktning, och får inte bogseras.',
    subcategory: 'registrering',
  },
  {
    id: 'agarbyte-forsakring',
    label: 'Försäkringens startdatum vid ägarbyte',
    description:
      'Man tror att säljarens försäkring gäller en tid efter ägarbytet.',
    correction:
      'Din trafikförsäkring måste gälla från och med ägarbytets datum.',
    subcategory: 'registrering',
  },
  {
    id: 'vit-kapp-signal',
    label: 'Den vita käppens lägen tolkas fel',
    description:
      'Käppens riktning läses inte som en signal.',
    correction:
      'Rakt ner mot marken betyder att personen väntar. Snett framåt betyder att personen tänker gå.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'synskadad-ljud',
    label: 'Ljud används fel mot synskadade',
    description:
      'Man tutar, varvar motorn eller kör vidare så snart personen lämnat körfältet.',
    correction:
      'Var tyst och försiktig, och vänta tills personen är helt över vägen.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'ledarhund-formaga',
    label: 'Ledarhunden antas bedöma trafiken',
    description:
      'Hunden tros kunna avgöra när det är säkert att gå.',
    correction:
      'Ledarhunden undviker hinder men kan inte bedöma trafikläget. Den ska aldrig störas.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'aldre-risk',
    label: 'Alla äldre förare antas vara en riskgrupp',
    description:
      'Gruppen 65–74 år klumpas ihop med förare över 75 år.',
    correction:
      'Gruppen 65–74 år kör i regel säkrare än nyblivna 18-åringar. Först över 75 år stiger risken tydligt.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'dold-funktionsnedsattning',
    label: 'Funktionsnedsättningar antas synas',
    description:
      'Man utgår från att den som tvekar saknar körvana eller är ouppmärksam.',
    correction:
      'Hörselskada och epilepsi syns inte. Var tålmodig med den som tar extra tid.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'tillaggstavla-syn',
    label: 'Gul tilläggstavla vid övergångsställe misstolkas',
    description:
      'Tavlan tolkas som olycksstatistik eller som att passagen är bevakad.',
    correction:
      'Den gula tavlan T9 anger att personer med nedsatt syn är vanligt förekommande.',
    subcategory: 'nedsatt-formaga',
  },
  {
    id: 'barn-ogonkontakt',
    label: 'Ögonkontakt med barn tas som överenskommelse',
    description:
      'Man tror att ett barn som ser bilen kommer att stanna kvar.',
    correction:
      'Barn är impulsiva. Ögonkontakt är ingen garanti — sänk farten och håll marginal.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'foretrade-tas',
    label: 'Företräde uppfattas som något man tar',
    description:
      'Man kör vidare på sin rätt trots att en olycka är på väg att ske.',
    correction:
      'Aktsamhetsplikten gäller även när du har rätt. Företräde ges, det tas aldrig.',
    subcategory: 'rattspraxis',
  },
  {
    id: 'rattsfall-roll',
    label: 'Rättsfallens roll missförstås',
    description:
      'Domar antas ersätta lagen eller befria från ansvar i liknande fall.',
    correction:
      'Rättsfall visar hur reglerna tillämpas när flera regler möts i verkligheten.',
    subcategory: 'rattspraxis',
  },
  {
    id: 'korfalt-omarkerat',
    label: 'Körfält antas kräva vägmarkering',
    description:
      'En omarkerad väg antas sakna körfält.',
    correction:
      'Ett utrymme brett nog för en fil fyrhjuliga fordon är ett körfält, även utan linjer.',
    subcategory: 'korfalt-och-sving',
  },
  {
    id: 'placering-langst-hoger',
    label: 'Placering förväxlas med högerregeln om körbanan',
    description:
      'Man pressar sig ut mot vägkanten i stället för att ligga mitt i körfältet.',
    correction:
      'Grundregeln är mitten av körfältet. Kravet att hålla höger gäller vilket körfält du väljer.',
    subcategory: 'placering',
  },
  {
    id: 'placering-skog',
    label: 'Placering anpassas inte efter sidosikt',
    description:
      'Samma placering används oavsett var risken finns.',
    correction:
      'Vid god sikt framåt men skymd sikt åt sidorna kan vänsterplacering ge mer marginal — om mötande saknas.',
    subcategory: 'placering',
  },
  {
    id: 'sving-placering',
    label: 'Placering vid sväng slarvas bort',
    description:
      'Man svänger från mitten av körfältet i stället för från rätt kant.',
    correction:
      'Högersväng nära körbanans högerkant, vänstersväng nära vänsterkanten av ditt körfält.',
    subcategory: 'korfalt-och-sving',
  },
  {
    id: 'enkelriktad-sving',
    label: 'Enkelriktad gata behandlas som vanlig väg',
    description:
      'Man placerar sig efter körfältets kant i stället för körbanans.',
    correction:
      'På enkelriktat finns ingen mötande trafik — använd körbanans vänsterkant vid vänstersväng.',
    subcategory: 'korfalt-och-sving',
  },
  {
    id: 'korfaltsval-hoger',
    label: 'Fri körfältsplacering antas gälla alltid',
    description:
      'Man ligger kvar i mitt- eller vänsterfält utan att villkoren är uppfyllda.',
    correction:
      'Fri placering kräver minst två markerade körfält och högst 70 km/h, eller olika färdmål enligt vägvisare.',
    subcategory: 'placering',
  },
  {
    id: 'korfaltsbyte-ordning',
    label: 'Kontrollerna före körfältsbyte görs ofullständigt',
    description:
      'Döda vinkeln hoppas över eller kontrollerna görs i fel ordning.',
    correction:
      'Trafiken framför först, sedan inre spegel, sidospegel och döda vinkeln — och döda vinkeln igen före bytet.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'heldragen-linje',
    label: 'Heldragen linje antas vara en rekommendation',
    description:
      'Man korsar linjen när det känns säkert.',
    correction:
      'Är linjen heldragen på din sida får du inte köra över den.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'slalomkorning',
    label: 'Vävning mellan körfält antas vara tillåten',
    description:
      'Enskilda byten anses göra slalomkörning laglig.',
    correction:
      'Att köra slalom mellan fordonen för att ta sig fram är inte tillåtet.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'korfaltsbyte-fart',
    label: 'Farten sänks vid körfältsbyte',
    description:
      'Man bromsar in i bytet och blir långsammare än trafiken man ska in i.',
    correction:
      'En liten fartökning minskar hastighetsskillnaden. Är luckan för liten: avvakta.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'kollektivkorfalt',
    label: 'Kollektivkörfältets regler misstolkas',
    description:
      'Man tror att bussfilen får användas i kö, eller inte ens får korsas.',
    correction:
      'Du får korsa kollektivkörfältet men inte köra i det, om inte en tilläggstavla säger annat.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'reversibelt-korfalt',
    label: 'Reversibelt körfält missförstås',
    description:
      'Körfältet antas vara reserverat för nödsituationer eller kollektivtrafik.',
    correction:
      'Ett reversibelt körfält kan byta körriktning efter behov. De är mycket ovanliga.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'blinka-trots-pilar',
    label: 'Körfältspilar antas ersätta blinkers',
    description:
      'Man låter vägmarkeringen visa avsikten i stället för att ge tecken.',
    correction:
      'Mötande och korsande ser inte pilarna i vägbanan. Ge alltid tecken vid sväng.',
    subcategory: 'korfaltsbyte',
  },
  {
    id: 'vaxel-sparsam',
    label: 'Låg växel antas vara bränslesnål',
    description:
      'Man ligger kvar på låga växlar för att motorn ska arbeta lättare.',
    correction:
      'Kör på så hög växel som bilen klarar utan att hacka, och växla upp tidigt efter start.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'acceleration-sparsam',
    label: 'Långsam acceleration antas spara bränsle',
    description:
      'Accelerationsfasen dras ut i tron att det är snålare.',
    correction:
      'Kom upp i fart ganska raskt men håll varvtalet under cirka 2 500 varv/min.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'sparsam-fore-sakerhet',
    label: 'Sparsam körning sätts före säkerheten',
    description:
      'Man motorbromsar eller mjukbromsar när en kraftig inbromsning behövs.',
    correction:
      'Trafiksäkerheten går alltid först. Sparsam körning gäller när det är lämpligt.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'takbox',
    label: 'Takboxens kostnad missförstås',
    description:
      'Man tror att en tom takbox inte påverkar förbrukningen.',
    correction:
      'Takbox och takräcke ökar luftmotståndet och kan kosta mer än en deciliter per mil.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'dacktryck-forbrukning',
    label: 'Lågt däcktryck antas vara ofarligt',
    description:
      'Mjuka däck tros rulla lättare eller bara påverka komforten.',
    correction:
      'Lågt tryck ger trögare rullning, högre förbrukning och snabbare slitage.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'motorvarmare-tid',
    label: 'Motorvärmaren används fel länge',
    description:
      'Den slås på alldeles för kort eller för lång tid.',
    correction:
      'Cirka 30 min vid +10 °C, en timme vid 0 °C och omkring 1,5 timme vid −20 °C.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'ac-forbrukning',
    label: 'AC:ns energiåtgång underskattas',
    description:
      'Luftkonditioneringen antas vara nästan gratis.',
    correction:
      'Avstängd AC kan sänka bränsleförbrukningen med 5–10 procent.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'katalysator-funktion',
    label: 'Katalysatorn antas ta bort koldioxid',
    description:
      'Man tror att katalysatorn löser klimatproblemet.',
    correction:
      'Katalysatorn omvandlar skadliga ämnen till bland annat koldioxid och vatten — den tar inte bort CO2.',
    subcategory: 'miljopaverkan',
  },
  {
    id: 'avgaser-effekter',
    label: 'Avgasernas olika effekter blandas ihop',
    description:
      'Kolmonoxid, kolväten och kväveoxider tillskrivs varandras verkningar.',
    correction:
      'CO slår mot syreupptagningen, HC är cancerframkallande och NOx försurar och göder.',
    subcategory: 'miljopaverkan',
  },
  {
    id: 'vaxthusgas',
    label: 'Fel ämne pekas ut som växthusgas',
    description:
      'Kolmonoxid eller kväveoxider antas driva växthuseffekten.',
    correction:
      'Koldioxid är den dominerande växthusgasen från trafiken.',
    subcategory: 'miljopaverkan',
  },
  {
    id: 'biltvatt',
    label: 'Skälet till att tvätta bilen rätt missförstås',
    description:
      'Man tror att det handlar om vattenmängd eller lackens skick.',
    correction:
      'Biltvättar har golvbrunnar som fångar upp olja, tungmetaller och kemikalier.',
    subcategory: 'miljopaverkan',
  },
  {
    id: 'diesel-vs-bensin',
    label: 'Diesel och bensin jämförs fel',
    description:
      'Diesel antas vara antingen renare eller förnybar.',
    correction:
      'Diesel förbrukar mindre men har mer hälsofarliga avgaser. Båda är fossila.',
    subcategory: 'drivmedel',
  },
  {
    id: 'hybrid-definition',
    label: 'Hybridbilen definieras fel',
    description:
      'Hybrid antas betyda ren elbil eller låg förbrukning.',
    correction:
      'En hybrid har två motorer, vanligast el tillsammans med bensin.',
    subcategory: 'drivmedel',
  },
  {
    id: 'elbil-miljo',
    label: 'Elbilen antas sakna miljöpåverkan',
    description:
      'Man drar slutsatsen att elbilen är helt utan avtryck.',
    correction:
      'Ingen avgas vid körning, men batteritillverkningen kräver gruvdrift med egna utsläpp.',
    subcategory: 'drivmedel',
  },
  {
    id: 'miljozoner',
    label: 'Miljözonernas klasser blandas ihop',
    description:
      'Klass 1 antas beröra personbilar.',
    correction:
      'Klass 1 gäller tunga fordon. Klass 2 ställer euro-krav på personbilar, klass 3 släpper i princip bara in elfordon.',
    subcategory: 'drivmedel',
  },
  {
    id: 'jvg-avstandsmarken',
    label: 'Avståndsmärken läses baklänges',
    description:
      'Tre streck tolkas som att korsningen är nära, i stället för längst bort.',
    correction:
      'Märkena räknar ner: tre streck först, ett streck sist. Ett streck betyder att korsningen är nära.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'jvg-bom-vs-lampa',
    label: 'Bommen tolkas som klartecken',
    description:
      'En bom som går upp uppfattas som besked om att det är fritt att köra.',
    correction:
      'Det är ljussignalen som gäller. Blinkar det rött står du kvar, även om bommen är uppe.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'jvg-bomtyper',
    label: 'Halvbommens öppning ses som en väg förbi',
    description:
      'Utrymmet bredvid en halvbom uppfattas som en tillåten passage.',
    correction:
      'Öppningen finns för att den som fastnat ska komma av spåret — inte för att köra in.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'jvg-passiv-korsning',
    label: 'Korsning utan bommar antas vara oanvänd',
    description:
      'Avsaknad av bommar och signal tolkas som att spåret inte trafikeras.',
    correction:
      'Utan teknik finns ingen varning alls. Hela bedömningen ligger då på dig.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'jvg-forvarning',
    label: 'Plankorsningen upptäcks först vid rälsen',
    description:
      'Bedömningen görs när spåret syns, i stället för vid varningsmärket.',
    correction:
      'Varningsmärket och avståndsmärkena finns för att du ska hinna bestämma dig i tid.',
    subcategory: 'plankorsning-marken',
  },
  {
    id: 'jvg-fart-over-sikt',
    label: 'Fart antas kompensera för dålig sikt',
    description:
      'Man kör fort över spåret för att vara utsatt så kort tid som möjligt.',
    correction:
      'Sikten bestämmer farten. Ser du inte tillräckligt ska du stanna, inte skynda.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-vaxling',
    label: 'Växling mitt på spåret',
    description:
      'Man växlar under passagen och riskerar motorstopp där det är som farligast.',
    correction:
      'Välj växel före spåret och behåll den tills hela bilen är över.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-ko-over-spar',
    label: 'Man kör fram i kö över spåret',
    description:
      'Släckt signal tolkas som att det är fritt att rulla fram, även när kön står still.',
    correction:
      'Kör bara in i korsningen om du säkert kommer hela vägen ut.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-stanna-i-bilen',
    label: 'Man stannar kvar i bilen vid motorstopp',
    description:
      'Försöken att starta om fortsätter tills det är för sent.',
    correction:
      'Får du inte bort bilen: lämna den och ring 112. Bilen går att ersätta.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-bom-hinder',
    label: 'Bommen ses som ett hinder man inte får skada',
    description:
      'Rädslan för att skada bommen gör att man blir kvar på spåret.',
    correction:
      'Bommarna är gjorda för att ge vika. Kör igenom hellre än att stå kvar.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-tagets-fart',
    label: 'Tågets hastighet underskattas',
    description:
      'Ett tåg rakt framifrån ändrar knappt storlek och verkar därför långsammare.',
    correction:
      'Ser du ett tåg över huvud taget — vänta. Tåget kan inte väja och bromsar i hundratals meter.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-stanna-efter',
    label: 'Man stannar direkt efter spåret',
    description:
      'Bilen stannas strax efter korsningen utan hänsyn till fordonet bakom.',
    correction:
      'Fortsätt framåt så att den bakom inte blir stående i korsningen.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-slap-samma',
    label: 'Släp antas inte ändra bedömningen',
    description:
      'Samma marginaler används med släp som utan.',
    correction:
      'Ett långt ekipage är kvar på spåret betydligt längre och behöver större luckor.',
    subcategory: 'plankorsning-korning',
  },
  {
    id: 'jvg-omkorning',
    label: 'Omkörningsförbudet vid plankorsning glöms',
    description:
      'Man kör om vid en plankorsning så snart sikten är fri.',
    correction:
      'Utan bommar och utan fullständig trafiksignal får bara tvåhjuliga fordon köras om.',
    subcategory: 'plankorsning-omkorning',
  },
  {
    id: 'jvg-signaltyp',
    label: 'Blinkande rött räknas som trafiksignal',
    description:
      'En anordning som bara blinkar rött antas upphäva omkörningsförbudet.',
    correction:
      'Det krävs en signal med rött, gult och grönt ljus — eller bommar.',
    subcategory: 'plankorsning-omkorning',
  },
  {
    id: 'overgang-just-ska-ga',
    label: 'Väjningsplikten antas börja först på övergångsstället',
    description:
      'Man väntar tills den gående satt foten på markeringen.',
    correction:
      'Väjningsplikten gäller även mot den som just ska gå ut.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'signal-slar-ut-gaende',
    label: 'Grönt antas betyda tom korsning',
    description:
      'Grönt ljus tolkas som rätt att köra genom någon som redan gått eller cyklat ut.',
    correction:
      'Den som gett sig ut på rätt sätt har rätt att göra klart.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'slackt-signal',
    label: 'Släckt signal antas göra passagen bevakad',
    description:
      'En trasig eller släckt signal tolkas som att inga skyldigheter gäller.',
    correction:
      'Bevakat kräver fungerande signal eller polis. Annars är passagen obevakad — du väjer.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'cyklist-som-gaende',
    label: 'Cyklande räknas som gående',
    description:
      'Den som cyklar över ett övergångsställe antas ha samma skydd som en gående.',
    correction:
      'Den som leder cykeln går. Den som trampar är cyklist, med andra regler.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'vinka-fram',
    label: 'Man vinkar fram gående',
    description:
      'Vinken uppfattas som ett besked om att hela vägen är fri.',
    correction:
      'Sök ögonkontakt i stället. Du kan inte svara för föraren i det andra körfältet.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'gangbana-utfart',
    label: 'Utfart antas ge företräde mot gående',
    description:
      'Man tror att den som kör ut från en fastighet går före de gående på trottoaren.',
    correction:
      'Du har väjningsplikt mot gående på gångbanan du korsar.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'gangbana-korsar-alltid',
    label: 'Trottoaren antas korsa vägen',
    description:
      'Att en gångbana fortsätter på andra sidan tolkas som att den löper över körbanan.',
    correction:
      'Utan övergångsställe får gående korsa endast utan fara eller hinder för trafiken.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'passage-vs-overfart',
    label: 'Cykelpassage förväxlas med cykelöverfart',
    description:
      'De två platserna antas ge samma skyldigheter.',
    correction:
      'Passage: anpassa hastigheten. Överfart: väjningsplikt. Skylt och väjningslinje avgör.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'sving-over-cykelpassage',
    label: 'Sväng antas inte ändra skyldigheten',
    description:
      'Samma svaga anpassningsplikt antas gälla när man svänger över en cykelpassage.',
    correction:
      'Svänger du, eller kör ut ur en cirkulationsplats, gäller låg hastighet och att lämna tillfälle att passera.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'cyklist-har-foretrade',
    label: 'Cyklisten antas ha företräde vid cykelpassage',
    description:
      'Cyklisten tros ha samma skydd som en gående på övergångsställe.',
    correction:
      'Vid en obevakad cykelpassage har cyklisten väjningsplikt mot dig — men du ska ändå anpassa farten.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'moped-vid-overfart',
    label: 'Moped klass II utesluts vid cykelöverfart',
    description:
      'Väjningsplikten antas gälla bara cyklande.',
    correction:
      'Cyklande, förare av moped klass II och elsparkcyklar omfattas alla.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'overfart-hastighet',
    label: 'Utformningskravet vid cykelöverfart glöms',
    description:
      'Man känner inte till farten som trafikmiljön ska vara byggd för.',
    correction:
      'En cykelöverfart ska vara utformad så att det inte är lämpligt att köra fortare än 30 km/h.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'cykelbana-korsning',
    label: 'Cykelbanan antas alltid vara bruten',
    description:
      'Man utgår från att cykelbanan tar slut före varje korsning.',
    correction:
      'En obruten cykelbana får bara korsas, och då gäller väjningsplikt mot cyklisterna.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'cirk-vem-vajer',
    label: 'Väjningsplikten i cirkulationsplats begränsas',
    description:
      'Man tror att väjningsplikten bara gäller mot motorfordon, eller inte alls på huvudled.',
    correction:
      'Du väjer mot varje fordon i cirkulationen — även cyklar och mopeder.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'cirk-riktning',
    label: 'Osäkerhet om körriktningen i cirkulationsplats',
    description:
      'Man är osäker på om man kör med- eller moturs.',
    correction:
      'Du svänger in åt höger och kör moturs.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'cirk-utan-skylt',
    label: 'Rund korsning antas vara cirkulationsplats',
    description:
      'Formen tas för reglering, utan att märket kontrolleras.',
    correction:
      'Utan märket för cirkulationsplats är det en vanlig korsning — högerregeln gäller.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'cirk-utfart-cykel',
    label: 'Utfart ur cirkulation antas ge företräde',
    description:
      'Man tror att den som kommer ur cirkulationen går före cyklande.',
    correction:
      'Utfarten jämställs med sväng: låg hastighet och lämna cyklande tillfälle att passera.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'cirk-fordelar',
    label: 'Cirkulationsplatsens säkerhetsvinst missförstås',
    description:
      'Vinsten antas vara att kollisioner blir omöjliga.',
    correction:
      'Vinsten är låga hastigheter och mindre farliga krockvinklar — inte att olyckor upphör.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'cirk-blinka-ut',
    label: 'Utfartstecknet glöms när man kör rakt fram',
    description:
      'Man blinkar inte ut när man kör rakt igenom cirkulationsplatsen.',
    correction:
      'Varje utfart är en högersväng ur cirkulationen. Blinka höger.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'cirk-blinka-in',
    label: 'Man blinkar vid infarten',
    description:
      'Tecken ges vid infart, vilket läses som att man ska ta första avfarten.',
    correction:
      'Blinka inte in när du ska rakt fram. Blinka höger när du ska ut.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'cirk-vanster-regel',
    label: 'Vänsterblinkning antas vara reglerad',
    description:
      'Man tror att vänsterblinkning vid infart är ett krav, eller att den ersätter utfartstecknet.',
    correction:
      'Vänsterblinkning är oreglerad och ibland olämplig. Högerblinkning vid utfart är alltid ett krav.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'cirk-korfaltsval',
    label: 'Höger körfält antas alltid gälla',
    description:
      'Man väljer höger körfält även när man ska långt runt.',
    correction:
      'Välj det körfält som passar din fortsatta färd, enligt märken och markeringar.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'cirk-korfaltsbyte',
    label: 'Företrädet i cirkulationen övertolkas',
    description:
      'Att vara inne i cirkulationen antas ge företräde även vid körfältsbyte.',
    correction:
      'Företrädet gäller mot dem som ska in. Ett körfältsbyte inuti är ett vanligt körfältsbyte.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'cirk-underlatta',
    label: 'Andras körfältsbyten försvåras',
    description:
      'Man håller farten och låter den som behöver ut lösa det själv.',
    correction:
      'Att underlätta andras körfältsbyten hör till hur man kör i cirkulationsplatser.',
    subcategory: 'cirkulation-korfalt',
  },
  {
    id: 'utfart-vs-hoger',
    label: 'Utfartsregeln vs högerregeln',
    description:
      'Högerregeln antas gälla även när du kommer ut från en parkering, en fastighet eller en bensinstation.',
    correction:
      'Kör du ut från ett område som inte är en väg har du väjningsplikt mot alla — högerregeln gäller inte där.',
    subcategory: 'utfartsregeln',
  },
  {
    id: 'hoger-utan-skylt',
    label: 'Högerregeln glöms i oskyltad korsning',
    description: 'Man letar efter en skylt och kör vidare när ingen finns.',
    correction: 'Saknas skyltar och signaler gäller högerregeln — lämna företräde åt höger.',
    subcategory: 'hogerregeln',
  },
  {
    id: 'huvudled-slutar',
    label: 'Huvudled antas fortsätta genom korsningen',
    description: 'Huvudleden antas gälla tills ett slutmärke syns, även när den svänger.',
    correction:
      'Huvudleden kan svänga. Följ vägmärkena i varje korsning — ett tilläggsmärke visar huvudledens sträckning.',
    subcategory: 'huvudled',
  },
  {
    id: 'stopp-utan-stopp',
    label: 'Stopplikt tolkas som väjningsplikt',
    description: 'Man rullar sakta förbi stopplinjen när sikten är fri.',
    correction: 'Vid stopplikt måste fordonet stå helt stilla, oavsett hur fri sikten är.',
    subcategory: 'stopplikt',
  },
  {
    id: 'cirkulation-hoger',
    label: 'Högerregeln antas gälla i cirkulationsplats',
    description: 'Man tror att fordon inne i rondellen ska väja för fordon som kör in.',
    correction:
      'Vid infart till en cirkulationsplats finns nästan alltid väjningsplikt — de som redan är i rondellen kör först.',
    subcategory: 'cirkulationsplats',
  },
  {
    id: 'blinkers-som-lofte',
    label: 'Blinkers tolkas som en garanti',
    description: 'Man kör ut för att en annan förare blinkar.',
    correction:
      'En blinkers är en avsikt, inte ett löfte. Vänta tills fordonet faktiskt börjar svänga.',
    subcategory: 'vajningsplikt',
  },
  {
    id: 'reaktion-vs-broms',
    label: 'Reaktionssträcka vs bromssträcka',
    description: 'De två sträckorna blandas ihop eller antas växa på samma sätt.',
    correction:
      'Reaktionssträckan växer linjärt med hastigheten. Bromssträckan växer med kvadraten — dubbel fart ger fyrdubbel bromssträcka.',
    subcategory: 'reaktion-och-sinnen',
  },
  {
    id: 'bashastighet-tatort',
    label: 'Bashastighet blandas ihop med skyltad hastighet',
    description: 'Man antar 30 eller 70 där inget märke finns.',
    correction:
      'Utan vägmärke gäller bashastigheten: 50 km/h inom tätbebyggt område, 70 km/h utanför.',
    subcategory: 'hastighetsgranser',
  },
  {
    id: 'skyltad-som-mal',
    label: 'Skyltad hastighet ses som ett krav',
    description: 'Man kör den skyltade hastigheten även när väglaget är dåligt.',
    correction:
      'Skyltad hastighet är ett tak, aldrig ett mål. Hastigheten ska anpassas till sikt, väglag och trafik.',
    subcategory: 'anpassad-hastighet',
  },
  {
    id: 'stanna-vs-parkera',
    label: 'Stannande vs parkering',
    description: 'Förbud att parkera antas också innebära förbud att stanna.',
    correction:
      'Att stanna är ett kort uppehåll för av- och påstigning eller lastning. Parkeringsförbud hindrar inte det, men stannandeförbud gör det.',
    subcategory: 'parkeringsforbud',
  },
  {
    id: 'huvudled-parkering',
    label: 'Parkering på huvudled',
    description: 'Man tror att det räcker att stå utanför körbanan.',
    correction: 'På en huvudled är det förbjudet att parkera. Att stanna kort är däremot tillåtet.',
    subcategory: 'parkeringsforbud',
  },
  {
    id: 'overgangsstalle-avstand',
    label: 'Avstånd till övergångsställe och korsning',
    description: 'Tio-metersregeln glöms bort eller antas gälla bara efter.',
    correction:
      'Du får inte stanna eller parkera inom tio meter före ett övergångsställe eller en korsande körbana.',
    subcategory: 'stannande-forbud',
  },
  {
    id: 'omkorning-hoger',
    label: 'Omkörning till höger',
    description: 'Höger omkörning antas alltid vara förbjuden — eller alltid tillåten.',
    correction:
      'Omkörning sker normalt till vänster. Höger är tillåtet i vissa fall, till exempel när det framförvarande fordonet svänger vänster.',
    subcategory: 'omkorningsregler',
  },
  {
    id: 'helljus-mote',
    label: 'Helljus vid möte',
    description: 'Helljuset behålls för länge, eller släcks alldeles för tidigt.',
    correction:
      'Blända av i god tid före möte, men inte så tidigt att du förlorar sikten i onödan. Bländas du — sänk farten och titta mot vägkanten till höger.',
    subcategory: 'mote-i-morker',
  },
  {
    id: 'morker-hastighet',
    label: 'Kör fortare än ljuset räcker',
    description: 'Hastigheten anpassas inte efter halvljusets räckvidd.',
    correction:
      'Du måste kunna stanna inom den sträcka du ser. På halvljus är den sträckan kort.',
    subcategory: 'morkerkorning',
  },
  {
    id: 'motorvag-nodfil',
    label: 'Vägrenen ses som ett körfält',
    description: 'Man tror att man får köra eller stanna på vägrenen för att vila.',
    correction:
      'Vägrenen på motorväg är till för nödsituationer. Stanna där bara om du måste.',
    subcategory: 'motorvag-regler',
  },
  {
    id: 'pafart-vantar',
    label: 'Stannar på påfartsrampen',
    description: 'Man saktar in eller stannar i slutet av accelerationsfältet.',
    correction:
      'Anpassa farten till trafiken på motorvägen och flyt in. Att stanna på påfarten skapar en farlig situation.',
    subcategory: 'pafart-avfart',
  },
  {
    id: 'promille-tid',
    label: 'Alkohol antas försvinna snabbare',
    description: 'Kaffe, mat, dusch eller sömn antas snabba på nedbrytningen.',
    correction:
      'Kroppen bryter ner alkohol i ungefär samma takt oavsett vad du gör. Bara tid hjälper.',
    subcategory: 'alkohol-effekter',
  },
  {
    id: 'trotthet-motmedel',
    label: 'Trötthet antas gå att köra bort',
    description: 'Musik, öppet fönster eller kaffe antas lösa trötthet.',
    correction:
      'Det enda som fungerar är att sova. En kort paus med vila är den enda pålitliga åtgärden.',
    subcategory: 'trotthet',
  },
  {
    id: 'vattenplaning-bromsa',
    label: 'Fel åtgärd vid vattenplaning',
    description: 'Man bromsar eller styr kraftigt när bilen tappar väggreppet.',
    correction:
      'Släpp gasen, håll ratten stilla och undvik att bromsa tills däcken får kontakt igen.',
    subcategory: 'vattenplaning',
  },
  {
    id: 'vinterdack-datum',
    label: 'Vinterdäcksperioden blandas ihop',
    description: 'Datum och väglagsvillkor blandas ihop.',
    correction:
      'Kravet gäller vid vinterväglag under perioden 1 december – 31 mars. Det är väglaget som avgör, inte bara datumet.',
    subcategory: 'vinterkorning',
  },
  {
    id: 'motorbroms-forbrukning',
    label: 'Sparsam körning missförstås',
    description: 'Man tror att lågt varvtal alltid är sparsamt, eller att frihjulning sparar mest.',
    correction:
      'Motorbromsning med ilagd växel förbrukar i princip inget bränsle på moderna bilar. Jämn fart och tidig växling sparar mest.',
    subcategory: 'sparsam-korning',
  },
  {
    id: 'monsterdjup',
    label: 'Mönsterdjup blandas ihop',
    description: 'Kraven för sommar- och vinterdäck blandas ihop.',
    correction:
      'Sommardäck kräver minst 1,6 mm. Vinterdäck kräver minst 3 mm vid vinterväglag.',
    subcategory: 'dack-och-bromsar',
  },
  {
    id: 'slap-totalvikt',
    label: 'B-behörighet och släpvagnsvikt',
    description: 'Man räknar bara på släpets vikt, inte på ekipaget.',
    correction:
      'Med vanlig B-behörighet får bilens och släpets sammanlagda totalvikt vara högst 3 500 kg.',
    subcategory: 'slapvagn',
  },
  {
    id: 'cykeloverfart-passage',
    label: 'Cykelöverfart vs cykelpassage',
    description: 'De två begreppen antas ge samma väjningsregler.',
    correction:
      'Vid en cykelöverfart har du väjningsplikt mot cyklande. Vid en cykelpassage har du det inte, men du måste ändå anpassa farten.',
    subcategory: 'oskyddade-trafikanter',
  },
  {
    id: 'signal-gult',
    label: 'Gult ljus tolkas som "skynda"',
    description: 'Gult ljus antas betyda att man ska öka farten för att hinna.',
    correction:
      'Gult betyder stanna, om du kan göra det utan fara. Bara om du är så nära att en inbromsning blir farlig får du köra vidare.',
    subcategory: 'trafiksignaler',
  },
  {
    id: 'polis-over-signal',
    label: 'Rangordning mellan tecken',
    description: 'Man följer trafiksignalen trots att en polis reglerar trafiken.',
    correction:
      'Polisens tecken gäller före både trafiksignaler och vägmärken.',
    subcategory: 'polisens-tecken',
  },
  {
    id: 'avstand-tid',
    label: 'Avstånd mäts i meter i stället för tid',
    description: 'Man håller samma avstånd oavsett hastighet.',
    correction:
      'Använd tid: minst tre sekunder till fordonet framför, mer vid halka eller dålig sikt.',
    subcategory: 'avstand',
  },
  {
    id: 'skymd-sikt-fart',
    label: 'Skymd sikt kompenseras inte',
    description: 'Farten hålls uppe fram till en punkt där sikten är skymd.',
    correction:
      'Där du inte ser måste du kunna stanna. Sänk farten innan, inte när något dyker upp.',
    subcategory: 'skymd-sikt',
  },
  {
    id: 'djur-vika',
    label: 'Väjer för litet vilt',
    description: 'Man gör en kraftig undanmanöver för mindre djur.',
    correction:
      'Väj inte så att du hamnar i mötande fil eller i diket. Bromsa rakt fram om en undanmanöver är farlig.',
    subcategory: 'djur-pa-vagen',
  },
  {
    id: 'dimljus-kombination',
    label: 'Fler lampor antas ge bättre sikt',
    description:
      'Varselljus och dimljus antas kunna kombineras med halvljus för att synas ännu bättre.',
    correction:
      'Att kombinera varselljus med halvljus eller dimljus är förbjudet. Ljusbilden ska vara entydig, inte maximal.',
    subcategory: 'belysning-fordon',
  },
  {
    id: 'dimbakljus-kvar',
    label: 'Dimbakljuset lämnas tänt',
    description:
      'Dimbakljuset uppfattas som ett extra säkerhetsljus som kan vara tänt så länge vädret är dåligt.',
    correction:
      'Dimbakljuset är bländande för den bakom. Släck det så fort du bedömer att bakomvarande har sett dig.',
    subcategory: 'belysning-fordon',
  },
  {
    id: 'helljus-dimma',
    label: 'Helljus antas hjälpa i dimma',
    description:
      'Mer ljus antas alltid ge bättre sikt, även när luften är full av vattendroppar eller snö.',
    correction:
      'Helljuset reflekteras tillbaka i dimma och snöfall. Testa halvljus och se om sikten blir bättre.',
    subcategory: 'dimma',
  },
  {
    id: 'signal-pil-slackt',
    label: 'Släckt pil tolkas som förbud',
    description:
      'En släckt grön pil bredvid en tänd rund grön signal uppfattas som att just den riktningen är stängd.',
    correction:
      'Är pilen släckt gäller den runda gröna signalen, som tillåter alla riktningar. Pilen lägger till, den drar inte ifrån.',
    subcategory: 'trafiksignal-korsning',
  },
  {
    id: 'vattenplaning-breda-dack',
    label: 'Breda däck antas ge mer grepp i vatten',
    description:
      'Bredare däck känns stabilare och antas därför också vara säkrare på vått underlag.',
    correction:
      'Ett bredare däck har mer vatten att pressa undan på samma tid. Risken för vattenplaning ökar, inte minskar.',
    subcategory: 'vattenplaning',
  },
  {
    id: 'vajerracke-motortrafikled',
    label: 'Vajerräcke antas betyda motortrafikled',
    description:
      'En mötesfri väg med vajerräcke antas automatiskt vara motortrafikled med motorvägens regler.',
    correction:
      'Motortrafikled märks alltid ut med vägmärket. En mötesfri landsväg utan det märket kan ha korsande trafik.',
    subcategory: 'motortrafikled',
  },
  {
    id: 'utfart-brutet-overgangsstalle',
    label: 'Utfartsregeln antas gälla över varje gångbana',
    description:
      'Väjningsplikten enligt utfartsregeln antas gälla så fort en gång- eller cykelbana korsas, oavsett hur platsen ser ut.',
    correction:
      'Utfartsregeln gäller bara obrutna gång- och cykelbanor. Finns övergångsställe eller cykelpassage är banan bruten och andra regler gäller.',
    subcategory: 'utfartsregeln',
  },
  {
    id: 'omkorning-forsvara',
    label: 'Den andres regelbrott antas upphäva egna skyldigheter',
    description:
      'När någon kör om otillåtet uppfattas det som tillåtet — eller lämpligt — att hålla farten uppe eller markera felet.',
    correction:
      'Du får inte öka hastigheten eller på annat sätt försvåra en omkörning, ens en otillåten. Fordonet i mötande fil har ingenstans att ta vägen.',
    subcategory: 'mote',
  },
  {
    id: 'mote-rak-vag',
    label: 'Rak väg antas göra mötet lättare att bedöma',
    description:
      'Fri sikt på en rak sträcka antas göra det enkelt att avgöra hur långt bort och hur fort ett mötande fordon är.',
    correction:
      'Rakt framifrån saknar ögat rörelse i sidled att bedöma efter. På en krokig väg ser du fordonet från sidan och bedömer bättre.',
    subcategory: 'mote',
  },
  {
    id: 'omkorning-cyklist',
    label: 'Cyklisten antas hålla sig vid kanten',
    description:
      'En cyklist uppfattas som ett hinder som ska passeras snabbt, och sidoavståndet antas kunna vara litet så länge man kör förbi fort.',
    correction:
      'Cyklisten kan behöva svänga ut när som helst, särskilt längs parkerade bilar. Passera först när du kan lämna det utrymme en öppnad bildörr kräver.',
    subcategory: 'skymd-sikt',
  },
  {
    id: 'buss-hallplats',
    label: 'Bussen ses som hindret',
    description:
      'En stannad buss uppfattas som ett fordon att ta sig förbi, i stället för som något som döljer människor.',
    correction:
      'Risken är inte bussen utan det du inte ser bakom den. Välj farten innan du är i jämnhöjd med den, inte när något rör sig.',
    subcategory: 'barn-och-oskyddade',
  },
  {
    id: 'solsken-grepp',
    label: 'Vackert väder antas betyda bra grepp',
    description:
      'Klar himmel och sol tolkas som att vägbanan är torr, trots att underlaget är packad snö eller is.',
    correction:
      'Läs vägbanan, inte himlen. Blankslitna hjulspår och snötäckt yta betyder dåligt grepp oavsett hur det ser ut ovanför.',
    subcategory: 'vinterkorning',
  },
  {
    id: 'cykelpassage-vajning',
    label: 'Passage och överfart blandas ihop',
    description:
      'En cykelpassage antas ge antingen full väjningsplikt eller inget ansvar alls, beroende på vem som tillfrågas.',
    correction:
      'Passage betyder anpassad hastighet. Överfart — med vägmärke B8 och väjningslinje — betyder full väjningsplikt. Rutorna ensamma räcker inte för det senare.',
    subcategory: 'cykelpassage-overfart',
  },
  {
    id: 'skymd-sikt-parkerade',
    label: 'Det största fordonet antas vara den största risken',
    description:
      'Uppmärksamheten fastnar på lastbilen eller den stora bilen, medan luckorna mellan fordonen förbises.',
    correction:
      'Det stora fordonet skymmer förutsägbart — du vet att du inte ser bakom det. Luckorna ger en känsla av överblick utan att ge tid.',
    subcategory: 'skymd-sikt',
  },
  {
    id: 'kryssmarke-varning',
    label: 'Kryssmärket antas vara en varning',
    description:
      'Kryssmärket uppfattas som ett varningsmärke som säger att en korsning kommer längre fram.',
    correction:
      'Kryssmärket markerar att korsningen är här. Varningen för korsningen kom tidigare, som en gul triangel.',
    subcategory: 'plankorsning-marken',
  },
];

export const MISCONCEPTION_BY_ID: ReadonlyMap<string, Misconception> = new Map(
  MISCONCEPTIONS.map((m) => [m.id, m]),
);

export function getMisconception(id: string): Misconception | undefined {
  return MISCONCEPTION_BY_ID.get(id);
}
