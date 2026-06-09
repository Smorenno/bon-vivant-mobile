/**
 * Mock CityGuideRaw data — mirrors the shape the API will return.
 * All (L) fields are LocalizedText objects { es, en, fr }.
 * `es` is always present; `en`/`fr` are null until translated.
 *
 * DEV-ONLY fields not in the schema (remove on API integration):
 *   - spot._placeholderColor  — used for image placeholders
 *   - highlight._placeholderColor
 */

import type { CityGuideRaw } from '@/types/guide';

export const MOCK_GUIDES: Record<string, CityGuideRaw> = {
  yokohama: {
    meta: {
      slug: 'yokohama',
      name: 'Yokohama',
      countryCode: 'JP',
      tagline: {
        es: 'La ciudad que abrió Japón al mundo',
        en: 'The city that opened Japan to the world',
        fr: null,
      },
      intro: {
        es: 'Antes una tranquila aldea pesquera, Yokohama se convirtió en una de las ciudades más cosmopolitas de Japón tras abrir sus puertos al comercio internacional en 1859. Fue la primera ciudad del país en establecer una conexión ferroviaria con Tokio — ahora solo a 30 minutos — y alberga el barrio chino más antiguo y grande de Japón.\n\nHoy Yokohama es la segunda ciudad más grande de Japón con 3,7 millones de habitantes, situada en la bahía de Tokio. Una metrópolis preciosa y fácil de recorrer donde la arquitectura futurista de la costa convive con barrios culturales centenarios.',
        en: "Once a quiet fishing village, Yokohama evolved into one of Japan's most cosmopolitan cities after opening its ports to international trade in 1859. It was the first city in the country to establish a railway connection to Tokyo — now just a 30-minute ride away — and is home to Japan's oldest and largest Chinatown.\n\nToday Yokohama is Japan's second-largest city with 3.7 million residents, sitting on Tokyo Bay. A gorgeous, easy-to-navigate metropolis where futuristic waterfront architecture meets centuries-old cultural districts.",
        fr: null,
      },
      historicalContext: {
        es: 'Yokohama abrió al comercio internacional en 1859, transformándose de aldea pesquera en la puerta de Japón al mundo.\n\nConstructora del primer ferrocarril del país (a Tokio) y fundadora del primer barrio chino de Japón, que sigue siendo uno de los más grandes del mundo.',
        en: "Yokohama opened to international trade in 1859, transforming from a fishing village into Japan's gateway to the world.\n\nIt built the country's first railway to Tokyo and established Japan's first and largest Chinatown — still one of the largest in the world today.",
        fr: null,
      },
      portDescription: {
        es: 'Llegarás a la Terminal Internacional de Pasajeros Osanbashi, en el Muelle Osanbashi, puerta al mar desde 1894. La terminal actual fue renovada y reinaugurada en 2002 con un sorprendente diseño arquitectónico moderno. Puede acoger hasta cuatro grandes cruceros a la vez.\n\nEl tejado tiene una terraza de observación con paseos peatonales y vistas espectaculares de la Bahía de Yokohama y el skyline de la ciudad.',
        en: "You will arrive at the Osanbashi Yokohama International Passenger Terminal, situated at Osanbashi Pier — a gateway to the sea since 1894. The current terminal was renovated and reopened in 2002 with a striking modern architectural design. It can accommodate up to four large cruise ships.\n\nThe rooftop features an observation deck with walking paths and stunning views of Yokohama Bay and the city skyline.",
        fr: null,
      },
      distanceToCenter: {
        es: '1 a 1,5 km al centro de Yokohama (zona Minato Mirai).',
        en: '1 to 1.5 km to downtown Yokohama (Minato Mirai area).',
        fr: null,
      },
      portFacilities: {
        es: 'La terminal incluye aparcamiento, instalaciones de aduana e inmigración, restaurantes, tiendas y sala de eventos. La terraza de observación del tejado es un atractivo en sí misma. El terminal está a distancia a pie de Yamashita Park, el barrio chino y el Almacén de Ladrillo Rojo. Autobuses conectan con todas las zonas principales.',
        en: "The terminal includes parking, customs and immigration facilities, restaurants, shops, and an event hall. The rooftop observation deck is a highlight in itself. The terminal is conveniently located within walking distance of Yamashita Park, Yokohama Chinatown, and the Red Brick Warehouse. Bus services connect to all major areas.",
        fr: null,
      },
      portRecommendation: {
        es: '"Camina. En serio — la terminal está tan cerca de Minato Mirai que el taxi es innecesario. El paseo de 15 minutos por el frente marítimo es precioso, y pasarás por Yamashita Park y el Almacén de Ladrillo Rojo. Guarda el taxi para la vuelta si te cansas."',
        en: '"Walk. Seriously — the terminal is so close to Minato Mirai that a taxi is unnecessary. The 15-minute walk along the waterfront is beautiful, and you\'ll pass Yamashita Park and the Red Brick Warehouse on the way. Save the taxi for the return if your legs are tired."',
        fr: null,
      },
      portLat: 35.4479,
      portLng: 139.6444,
      isUnlocked: true,
      imageUrl: null,
      latitude: 35.4437,
      longitude: 139.6380,
    },
    highlights: [
      {
        id: 'yk-h1',
        label: { es: 'Minato Mirai 21', en: 'Minato Mirai 21', fr: null },
        description: {
          es: 'Distrito costero futurista con compras, gastronomía y la icónica Landmark Tower.',
          en: 'A futuristic waterfront district with world-class shopping, dining, and the iconic Landmark Tower.',
          fr: null,
        },
      },
      {
        id: 'yk-h2',
        label: { es: 'Barrio Chino de Yokohama', en: 'Yokohama Chinatown', fr: null },
        description: {
          es: 'El primer barrio chino de Japón, con cientos de restaurantes y tiendas en calles de colores.',
          en: "Japan's first and largest Chinatown, with hundreds of restaurants and shops packed into colorful streets.",
          fr: null,
        },
      },
      {
        id: 'yk-h3',
        label: { es: 'Yamashita Park', en: 'Yamashita Park', fr: null },
        description: {
          es: 'Un tranquilo paseo marítimo con vistas espectaculares al puerto y el skyline.',
          en: 'A scenic bayside promenade with stunning views of the harbor and city skyline.',
          fr: null,
        },
      },
    ],
    transport: [
      {
        method: 'walk',
        timeLabel: '15-20 min',
        tips: {
          es: 'Ruta escénica por el frente marítimo directo al corazón de Minato Mirai — compras, restaurantes, museos y conexiones de tren, todo a pie.',
          en: "Scenic route via the waterfront. You'll walk straight into the heart of Minato Mirai — shopping, restaurants, museums, and train connections all accessible on foot.",
          fr: null,
        },
      },
      {
        method: 'metro',
        timeLabel: '7 min (caminata + viaje)',
        tips: {
          es: 'La Línea Minato Mirai sale de la estación Bashamichi, a poca distancia del muelle. Conecta directamente con la estación de Yokohama y más allá.',
          en: 'The Minato Mirai Line runs from Bashamichi Station, a short walk from the pier. Connects directly to Yokohama Station and beyond.',
          fr: null,
        },
      },
      {
        method: 'taxi',
        timeLabel: '5-10 min',
        tips: {
          es: 'Disponible en la terminal. Consejo: lleva una nota escrita en japonés con la dirección del puerto — mucho más fácil para los conductores.',
          en: "Available at the terminal. Tip: carry a written note in Japanese with the port address — much easier for drivers.",
          fr: null,
        },
      },
      {
        method: 'train',
        timeLabel: '30 min',
        tips: {
          es: 'JR Tokaido o Yokosuka desde la estación de Yokohama hasta Tokio. O Tokyu Toyoko desde Shibuya directo a Minatomirai.',
          en: "JR Tokaido or Yokosuka Line from Yokohama Station to Tokyo Station. Or Tokyu Toyoko Line from Shibuya direct to Minatomirai.",
          fr: null,
        },
      },
    ],
    whatToKnow: [],
    spots: [
      {
        id: 'yk-s1',
        cityId: 'yokohama',
        kind: 'attraction',
        category: null,
        name: 'Minato Mirai 21 (MM21)',
        address: null,
        latitude: 35.4567,
        longitude: 139.6330,
        distanceFromPortKm: 1.2,
        rankOrder: 1,
        website: null,
        tagLine: {
          es: 'Distrito costero futurista',
          en: 'Futuristic waterfront district',
          fr: null,
        },
        manuelQuote: {
          es: 'Literalmente a distancia a pie del barco (20 minutos). Para en World Porters — encontrarás de todo, incluyendo el increíble restaurante de sushi Maguro Tomya Megumi, sushi japonés de verdad.',
          en: "Literally at walking distance from the ship (20 minute walk). Stop by at World Porters shopping center, you will find a little bit of everything including the amazing sushi restaurant Maguro Tomya Megumi, a real Japanese sushi experience",
          fr: null,
        },
        whatItIs: {
          es: 'Concebido en los años 80 como un gran proyecto de regeneración urbana que transformó el frente marítimo industrial y los astilleros de Yokohama en un moderno centro futurista.',
          en: "Conceived in the 1980s as a massive urban redevelopment project it transformed Yokohama's industrial waterfront and shipyards into a modern futuristic center.",
          fr: null,
        },
        whyItMatters: {
          es: 'Es tu puerta de salida del barco a todo lo que está cerca: compras, arte y gastronomía, el museo Nippon Maru, el Cup Noodles Museum, el parque de atracciones Cosmo World, el mirador Landmark Tower Sky Garden y el centro comercial Landmark Plaza — todo conectado y a pie.\n\nEste es tu punto de partida desde el barco hacia todo lo que tienes cerca.',
          en: "This is your gateway from the ship to everything in proximity:\n\nShopping, art & food including all sort of restaurants, the Nippon Maru museum, Cup Noodles Museum, Amusement park Cosmo World, the Landmark Tower Sky Garden, and the Landmark Plaza shopping center — all connected and walkable.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
      {
        id: 'yk-s2',
        cityId: 'yokohama',
        kind: 'attraction',
        category: null,
        name: 'Yokohama Chinatown',
        address: null,
        latitude: 35.4432,
        longitude: 139.6498,
        distanceFromPortKm: 0.8,
        rankOrder: 2,
        website: null,
        tagLine: {
          es: 'El primer y mayor barrio chino de Japón',
          en: "Japan's first and largest Chinatown",
          fr: null,
        },
        manuelQuote: {
          es: 'En el barrio prueba el restaurante YGF Malatang (218-4 Yamashitacho Naka Ward). El Malatang es comida callejera de Sichuan (tipo Ramen) con pimienta de Sichuan y guindilla seca, más carnes, verduras y fideos.',
          en: "While in the neighborhood try YGF Malatang restaurant (218-4 Yamashitacho Naka Ward.) Malatang is a Sichuan street food (type of Ramen) with Sichuan pepper and dried chilli plus meats, vegetables and noodles.",
          fr: null,
        },
        whatItIs: {
          es: 'El primer y más grande barrio chino de Japón.',
          en: "Japan's first and largest Chinatown.",
          fr: null,
        },
        whyItMatters: {
          es: 'Uno de los barrios chinos más grandes del mundo, con cientos de restaurantes, tiendas y templos en calles vibrantes. Este fue el primer barrio chino establecido en Japón.',
          en: "One of the largest Chinatowns in the world, with hundreds of restaurants, shops, and temples packed into vibrant streets. This was the first Chinatown established in Japan.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
      {
        id: 'yk-s3',
        cityId: 'yokohama',
        kind: 'attraction',
        category: null,
        name: 'Manyo Club',
        address: 'Minato Mirai, Naka Ward, Shinko, 2 Chome-7-1 4F',
        latitude: 35.4573,
        longitude: 139.6357,
        distanceFromPortKm: 1.5,
        rankOrder: 3,
        website: 'www.manyo.co.jp',
        tagLine: {
          es: 'Onsen SPA',
          en: 'Onsen SPA',
          fr: null,
        },
        manuelQuote: {
          es: 'Tómate el baño de pies en la azotea al atardecer — la vista sobre Minato Mirai con la noria iluminada es uno de esos momentos que solo ocurren cuando sabes dónde ir.',
          en: "Take the rooftop foot bath at sunset — the view over Minato Mirai with the Ferris wheel lit up is one of those moments you only get by knowing where to go.",
          fr: null,
        },
        whatItIs: {
          es: 'Hotel de aguas termales (Onsen) con baño de pies en la azotea, baños interiores y exteriores, y SPA completo.',
          en: "Relaxing hot spring hotel (Onsen) with a rooftop foot bath. Indoor & outdoors baths & full service SPA.",
          fr: null,
        },
        whyItMatters: {
          es: 'Uno de los onsens más accesibles para visitantes de crucero — no se necesita japonés, toallas y yukata incluidos, y la vista desde la azotea sobre Cosmo World es espectacular.',
          en: "One of the most accessible onsens for cruise visitors — no Japanese required, towels and yukata provided, and the rooftop view over Cosmo World is spectacular.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
    ],
    itineraries: [],
    tips: [],
    warnings: [],
    images: [],
  },

  barcelona: {
    meta: {
      slug: 'barcelona',
      name: 'Barcelona',
      countryCode: 'ES',
      tagline: {
        es: 'Gaudí, Mediterráneo y el mejor tapeo de Europa',
        en: 'Gaudí, the Mediterranean, and the best tapas in Europe',
        fr: null,
      },
      intro: {
        es: 'Barcelona, la vibrante capital de Cataluña, mezcla a la perfección el patrimonio gótico con las obras maestras del modernismo. Desde la Sagrada Família de Gaudí hasta el animado paseo de Las Ramblas, cada rincón tiene una historia.\n\nCon su clima mediterráneo, su gastronomía de primer nivel y una vida nocturna que no descansa, Barcelona se ha ganado su lugar como uno de los destinos más queridos de Europa.',
        en: "Barcelona, the vibrant capital of Catalonia, seamlessly blends Gothic heritage with modernist masterpieces. From Gaudí's surreal Sagrada Família to the lively Las Ramblas promenade, every corner tells a story.\n\nWith its Mediterranean climate, world-class cuisine, and a nightlife that never sleeps, Barcelona has earned its place as one of Europe's most beloved destinations.",
        fr: null,
      },
      historicalContext: {
        es: 'Barcelona tiene raíces que se remontan más de 2.000 años a un asentamiento romano llamado Barcino, fundado en el siglo I a.C. al pie del Montjuïc.\n\nLa ciudad floreció como capital de la Corona de Aragón, convirtiéndose en una gran potencia comercial mediterránea en la Edad Media, antes de integrarse en la España moderna.',
        en: "Barcelona's roots trace back over 2,000 years to a Roman settlement called Barcino, founded in the 1st century BC at the foot of Mount Montjuïc.\n\nThe city flourished as the capital of the Crown of Aragon, becoming a major Mediterranean trading power in the Middle Ages before eventually becoming part of modern Spain.",
        fr: null,
      },
      portDescription: {
        es: 'Los cruceros atracan en el Moll Adossat, una de las terminales de pasajeros más grandes y mejor equipadas del Mediterráneo. La terminal está justo al sur de la playa de la Barceloneta, con vistas directas al mar y fácil acceso al frente costero.\n\nEl complejo cuenta con múltiples muelles capaces de acoger simultáneamente los barcos más grandes del mundo, con modernas instalaciones para pasajeros.',
        en: "Cruise ships dock at Moll Adossat, one of the largest and best-equipped passenger terminals in the Mediterranean. The terminal sits just south of Barceloneta beach, with direct sea views.\n\nThe complex features multiple docks capable of simultaneously accommodating the world's largest vessels, along with modern passenger amenities.",
        fr: null,
      },
      distanceToCenter: {
        es: '3 a 4 km a Las Ramblas y el Barrio Gótico.',
        en: '3 to 4 km to Las Ramblas and the Gothic Quarter.',
        fr: null,
      },
      portFacilities: {
        es: 'El Moll Adossat dispone de salas de espera, tiendas duty-free, cambio de divisas, información turística y cafeterías. El autobús lanzadera es accesible en silla de ruedas. Para personas con movilidad reducida hay servicios de asistencia dedicados — solicitarlos a la naviera con 48 horas de antelación.',
        en: "Moll Adossat features passenger lounges, duty-free shops, currency exchange, a tourist information desk, and cafés. The shuttle bus is wheelchair accessible. For those with mobility needs, the terminal has dedicated assistance services — request them through your cruise line 48 hours in advance.",
        fr: null,
      },
      portRecommendation: {
        es: '"Toma el shuttle gratuito hasta el Monumento a Colón — te deja exactamente donde empieza Las Ramblas. Sube despacio y gira al Barrio Gótico por la izquierda. Eso es la Barcelona real. Para volver, camina cinco minutos hacia la Barceloneta y encuentras taxi al momento."',
        en: '"Take the free shuttle to the Columbus Monument — it drops you exactly where Las Ramblas begins. Walk up the Ramblas slowly and turn into the Gothic Quarter on your left. That\'s where the real Barcelona is. For the return, walk five minutes toward Barceloneta and you\'ll find a cab in seconds."',
        fr: null,
      },
      portLat: 41.3683,
      portLng: 2.1731,
      isUnlocked: false,
      imageUrl: null,
      latitude: 41.3851,
      longitude: 2.1734,
    },
    highlights: [
      {
        id: 'bcn-h1',
        label: { es: 'Sagrada Família', en: 'Sagrada Família', fr: null },
        description: {
          es: 'La obra maestra inacabada de Gaudí, una basílica que mezcla estilos gótico y Art Nouveau.',
          en: "Gaudí's unfinished masterpiece, a towering basilica blending Gothic and Art Nouveau styles.",
          fr: null,
        },
      },
      {
        id: 'bcn-h2',
        label: { es: 'Barrio Gótico', en: 'Gothic Quarter', fr: null },
        description: {
          es: 'Calles medievales laberínticas con ruinas romanas, boutiques independientes y plazas escondidas.',
          en: 'Labyrinthine medieval streets hiding Roman ruins, independent boutiques, and hidden plazas.',
          fr: null,
        },
      },
      {
        id: 'bcn-h3',
        label: { es: 'La Barceloneta', en: 'La Barceloneta', fr: null },
        description: {
          es: 'Barrio de playa animado con restaurantes de marisco y un paseo marítimo lleno de vida.',
          en: 'A lively beach neighborhood with seafood restaurants and a vibrant promenade along the Mediterranean.',
          fr: null,
        },
      },
    ],
    transport: [
      {
        method: 'walk',
        timeLabel: '45-55 min',
        tips: {
          es: 'Un paseo largo pero pintoresco por el Passeig de Joan de Borbó y a través de la Barceloneta. Ideal si quieres entrar a la ciudad a tu ritmo.',
          en: "A long but scenic seafront walk along Passeig de Joan de Borbó and through Barceloneta. Great if you want to ease into the city at your own pace.",
          fr: null,
        },
      },
      {
        method: 'ferry',
        timeLabel: '15 min',
        tips: {
          es: 'La mayoría de navieras ofrecen shuttle gratuito hasta el Monumento a Colón. Consulta el boletín diario del barco para el horario.',
          en: "Most cruise lines run a free shuttle to the Columbus Monument (Portal de la Pau). Check your ship's daily bulletin for schedule.",
          fr: null,
        },
      },
      {
        method: 'taxi',
        timeLabel: '10-15 min',
        tips: {
          es: 'Taxis en la salida de la terminal. Taxímetro — sin negociación. Evita ir en coche por Las Ramblas; el tráfico lo hace mucho más lento.',
          en: "Taxis wait at the terminal exit. Metered — no haggling needed. Avoid asking to go through Las Ramblas by car; traffic makes it much slower.",
          fr: null,
        },
      },
    ],
    whatToKnow: [],
    spots: [
      {
        id: 'bcn-s1',
        cityId: 'barcelona',
        kind: 'attraction',
        category: null,
        name: 'Sagrada Família',
        address: 'Carrer de Mallorca, 401, Eixample',
        latitude: 41.4036,
        longitude: 2.1744,
        distanceFromPortKm: 4.2,
        rankOrder: 1,
        website: 'www.sagradafamilia.org',
        tagLine: { es: 'Obra maestra de Gaudí', en: "Gaudí masterpiece", fr: null },
        manuelQuote: {
          es: 'Reserva online con al menos una semana de antelación — las colas sin entrada son brutales. Pide la entrada con acceso a la torre: la vista desde la torre del Nacimiento sobre la cuadrícula del Eixample vale cada euro.',
          en: "Book tickets online at least a week ahead — the queues without tickets are brutal. Go for the tower access ticket: the view from the Nativity tower over the Eixample grid is worth every euro.",
          fr: null,
        },
        whatItIs: {
          es: 'La basílica inacabada de Gaudí, en construcción desde 1882. Patrimonio de la Humanidad de la UNESCO que combina estilos gótico y Art Nouveau de una forma que no existe en ningún otro lugar del mundo.',
          en: "Gaudí's unfinished basilica, under construction since 1882 and still ongoing. A UNESCO World Heritage Site combining Gothic and Art Nouveau styles in a way that exists nowhere else on earth.",
          fr: null,
        },
        whyItMatters: {
          es: 'No es solo una iglesia — es una obra de arte completamente singular. Incluso los visitantes no religiosos suelen quedarse sin palabras. Dedica al menos 90 minutos dentro.',
          en: "It is not just a church — it is a completely singular work of art. Even non-religious visitors are regularly left speechless. Allow at least 90 minutes inside.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
      {
        id: 'bcn-s2',
        cityId: 'barcelona',
        kind: 'attraction',
        category: null,
        name: 'Barrio Gótico',
        address: null,
        latitude: 41.3833,
        longitude: 2.1762,
        distanceFromPortKm: 2.1,
        rankOrder: 2,
        website: null,
        tagLine: { es: 'Laberinto medieval', en: 'Medieval labyrinth', fr: null },
        manuelQuote: {
          es: 'Piérdete adrede. Sal de la arteria principal (Carrer del Bisbe) y ve más adentro — la Plaça de Sant Felip Neri y las calles alrededor de El Call (el antiguo barrio judío) son el Barrio Gótico de verdad.',
          en: "Get lost on purpose. Turn off the main tourist drag (Carrer del Bisbe) and go deeper — the Plaça de Sant Felip Neri and the streets around El Call (the old Jewish quarter) are the real Gothic Quarter.",
          fr: null,
        },
        whatItIs: {
          es: 'El casco histórico de Barcelona, construido sobre el asentamiento romano original de Barcino. Las calles siguen la misma disposición que hace 2.000 años.',
          en: "Barcelona's historic old town, built on top of the original Roman settlement of Barcino. The streets follow the same layout they did 2,000 years ago.",
          fr: null,
        },
        whyItMatters: {
          es: 'Calles medievales laberínticas con ruinas romanas, boutiques independientes y plazas escondidas. Cada esquina tiene una historia — y muchas de esas historias son anteriores a España misma.',
          en: "Labyrinthine medieval streets hiding Roman ruins, independent boutiques, and hidden plazas. Every corner has a story — and many of those stories predate Spain itself.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
    ],
    itineraries: [],
    tips: [],
    warnings: [],
    images: [],
  },

  rio: {
    meta: {
      slug: 'rio',
      name: 'Rio de Janeiro',
      countryCode: 'BR',
      tagline: {
        es: 'La ciudad maravillosa — playas, samba y vistas únicas en el mundo',
        en: 'The Marvelous City — beaches, samba, and views unlike anywhere else',
        fr: null,
      },
      intro: {
        es: 'Río de Janeiro es una de las ciudades más impresionantes del mundo, donde playas doradas, montañas exuberantes y una cultura vibrante colisionan. Desde el icónico Cristo Redentor hasta la legendaria Copacabana, cada vista es digna de postal.\n\nConocida como la Cidade Maravilhosa, Río vibra con ritmos de samba, la energía del carnaval más famoso del mundo y una calidez imposible de resistir.',
        en: "Rio de Janeiro is one of the world's most stunning cities, where golden beaches, lush mountains, and a vibrant culture collide. From the iconic Christ the Redeemer to the legendary Copacabana, every view is postcard-worthy.\n\nKnown as the Cidade Maravilhosa — the Marvelous City — Rio pulses with samba rhythms, world-famous carnival energy, and a warmth that's impossible to resist.",
        fr: null,
      },
      historicalContext: {
        es: 'Río de Janeiro fue fundada por los portugueses en 1565 y sirvió como capital del Brasil colonial, convirtiéndose después en sede del Imperio Portugués cuando la familia real huyó de Napoleón en 1808.\n\nLa ciudad fue capital de Brasil hasta 1960, cuando se construyó Brasilia. Su herencia imperial dejó grandes bulevares, museos y una cultura cosmopolita única en América Latina.',
        en: "Rio de Janeiro was founded by the Portuguese in 1565 and served as the capital of colonial Brazil, later becoming the seat of the Portuguese Empire itself when the royal family fled Napoleon in 1808.\n\nThe city was Brazil's capital until 1960, when Brasília was built. Its imperial heritage left behind grand boulevards, museums, and a cosmopolitan culture unlike anywhere else in Latin America.",
        fr: null,
      },
      portDescription: {
        es: 'Los cruceros atracan en el Pier Mauá (Terminal de Cruzeiros Pier Mauá), en el renovado distrito costero Porto Maravilha. La terminal fue modernizada completamente antes de los Juegos Olímpicos de 2016 y ofrece vistas espectaculares sobre la Bahía de Guanabara.\n\nLa zona circundante se ha convertido en un hub cultural vibrante con el MAR (Museo de Arte de Río), el Museo del Mañana, espacios al aire libre y el VLT (tranvía ligero) justo en la entrada de la terminal.',
        en: "Rio's cruise ships berth at Pier Mauá (Terminal de Cruzeiros Pier Mauá), in the revitalized Porto Maravilha waterfront district. The terminal was fully modernized ahead of the 2016 Olympics and offers stunning views across Guanabara Bay.\n\nThe surrounding area has been transformed into a vibrant cultural hub with the Museum of Art of Rio, the Museum of Tomorrow, open-air spaces, and the VLT light rail right at the terminal entrance.",
        fr: null,
      },
      distanceToCenter: {
        es: '1 a 2 km al Centro histórico. 12 km a Copacabana.',
        en: '1 to 2 km to Centro histórico. 12 km to Copacabana.',
        fr: null,
      },
      portFacilities: {
        es: 'El Pier Mauá ofrece terminal moderna con aduana, tiendas, puestos de comida y servicio de taxis. La zona es llana y accesible. El paseo Orla Conde adyacente es una de las grandes renovaciones urbanas de Río — recorrerlo es un placer en sí mismo, con instalaciones de arte, food trucks y vistas a la Bahía en todo el trayecto.',
        en: "Pier Mauá offers a modern passenger terminal with customs, shops, food kiosks, and taxi services. The area is flat and accessible. The adjacent Orla Conde promenade is one of Rio's great urban renewals — walking it is a pleasure in itself, with art installations, food trucks, and Bay views the whole way.",
        fr: null,
      },
      portRecommendation: {
        es: '"Toma el VLT hasta la Praça XV y recorre primero el centro histórico — la Confeitaria Colombo para un café, el Palacio Imperial, la iglesia de la Candelária. Luego Uber a Copacabana por la tarde. No vayas caminando; son 12 km y la ruta por los túneles del centro no es agradable a pie."',
        en: '"Take the VLT to Praça XV and walk the historic centre first — Confeitaria Colombo for a coffee, the Imperial Palace, the Candelária church. Then Uber to Copacabana in the afternoon. Don\'t walk there; it\'s 12 km and the route through downtown tunnels is not pleasant on foot."',
        fr: null,
      },
      portLat: -22.8948,
      portLng: -43.1726,
      isUnlocked: false,
      imageUrl: null,
      latitude: -22.9068,
      longitude: -43.1729,
    },
    highlights: [
      {
        id: 'rio-h1',
        label: { es: 'Cristo Redentor', en: 'Christ the Redeemer', fr: null },
        description: {
          es: 'La icónica estatua Art Déco en lo alto del Corcovado, con vistas panorámicas de 360° de la ciudad.',
          en: 'The iconic Art Deco statue atop Corcovado Mountain, offering breathtaking 360° views of the city.',
          fr: null,
        },
      },
      {
        id: 'rio-h2',
        label: { es: 'Playa de Copacabana', en: 'Copacabana Beach', fr: null },
        description: {
          es: 'El famoso tramo de 4 km de arena blanca flanqueado por un paseo de mosaico y kioscos frente al mar.',
          en: 'The world-famous 4 km stretch of white sand flanked by a mosaic promenade and oceanfront kiosks.',
          fr: null,
        },
      },
      {
        id: 'rio-h3',
        label: { es: 'Santa Teresa', en: 'Santa Teresa', fr: null },
        description: {
          es: 'Un bohemio barrio en la colina con calles adoquinadas, mansiones coloniales y una escena artística vibrante.',
          en: 'A bohemian hilltop neighborhood of cobblestone streets, colonial mansions, and thriving arts scene.',
          fr: null,
        },
      },
    ],
    transport: [
      {
        method: 'tram',
        timeLabel: '5-10 min',
        tips: {
          es: 'El VLT (tranvía ligero) para directamente en el Pier Mauá. Limpio, con aire acondicionado y económico. Conecta con la Praça XV y el Centro en minutos.',
          en: "The VLT light rail stops directly at Pier Mauá. Clean, air-conditioned, and affordable. Connects to Praça XV and Centro in minutes.",
          fr: null,
        },
      },
      {
        method: 'walk',
        timeLabel: '20-25 min',
        tips: {
          es: 'Un agradable paseo por el paseo marítimo Orla Conde te lleva al Centro histórico y la Praça XV. Bien iluminado, llano y habilitado para peatones.',
          en: "A pleasant walk along the Orla Conde waterfront promenade takes you to the historic Centro and Praça XV. Well-lit, flat, and pedestrian-friendly.",
          fr: null,
        },
      },
      {
        method: 'taxi',
        timeLabel: '30-40 min a las playas',
        tips: {
          es: 'Para Copacabana o Ipanema. Usa la parada oficial de radio taxi en la terminal o reserva por Uber — significativamente más barato y seguro que los taxis de la calle.',
          en: "To Copacabana or Ipanema. Use the official radio taxi stand at the terminal or book via Uber app — significantly cheaper and safer than street hails.",
          fr: null,
        },
      },
    ],
    whatToKnow: [],
    spots: [
      {
        id: 'rio-s1',
        cityId: 'rio',
        kind: 'attraction',
        category: null,
        name: 'Cristo Redentor',
        address: null,
        latitude: -22.9519,
        longitude: -43.2105,
        distanceFromPortKm: 9.5,
        rankOrder: 1,
        website: 'www.christredeemer.com.br',
        tagLine: { es: 'Monumento icónico', en: 'Iconic landmark', fr: null },
        manuelQuote: {
          es: 'Ve temprano — antes de las 10. Las multitudes disminuyen drásticamente, la luz es dorada y puedes estar en los brazos sin estar hombro con hombro con 500 personas. Toma la furgoneta oficial desde Cosme Velho, no la senderista.',
          en: "Go early — before 10am if you can. The crowds thin out dramatically, the light is golden, and you can actually stand at the arms without being shoulder-to-shoulder with 500 people. Take the official van from Cosme Velho, not the hike.",
          fr: null,
        },
        whatItIs: {
          es: 'La icónica estatua Art Déco de Jesucristo en lo alto del monte Corcovado a 710 metros, con los brazos extendidos sobre la ciudad. Una de las Siete Maravillas del Mundo Moderno.',
          en: "The iconic Art Deco statue of Jesus Christ atop Corcovado Mountain at 710m, arms outstretched over the city. One of the Seven Wonders of the Modern World.",
          fr: null,
        },
        whyItMatters: {
          es: 'La vista panorámica de 360° de Río — la Bahía de Guanabara, Copacabana, las montañas, las islas — es algo que no puedes entender del todo hasta que estás allí de pie.',
          en: "The 360° panoramic view of Rio — Guanabara Bay, Copacabana, the mountains, the islands — is something you cannot fully understand until you're standing there.",
          fr: null,
        },
        reservation: null,
        goodToKnow: null,
        cuisineType: null,
        categoryLabel: null,
        mustTry: null,
        bestTime: null,
      },
    ],
    itineraries: [],
    tips: [],
    warnings: [],
    images: [],
  },
};
