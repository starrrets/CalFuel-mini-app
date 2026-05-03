const INGREDIENTS = [
  // Meat & Poultry
  { name: "Chicken breast",        kcal: 165, protein: 31,  fat: 3.6, carbs: 0   },
  { name: "Chicken thigh",         kcal: 209, protein: 26,  fat: 11,  carbs: 0   },
  { name: "Beef (lean ground)",    kcal: 215, protein: 26,  fat: 12,  carbs: 0   },
  { name: "Beef steak",            kcal: 271, protein: 26,  fat: 18,  carbs: 0   },
  { name: "Pork loin",             kcal: 242, protein: 27,  fat: 14,  carbs: 0   },
  { name: "Pork belly",            kcal: 518, protein: 9,   fat: 53,  carbs: 0   },
  { name: "Turkey breast",         kcal: 135, protein: 30,  fat: 1,   carbs: 0   },
  { name: "Lamb",                  kcal: 294, protein: 25,  fat: 21,  carbs: 0   },
  { name: "Duck",                  kcal: 337, protein: 19,  fat: 28,  carbs: 0   },
  { name: "Bacon",                 kcal: 541, protein: 37,  fat: 42,  carbs: 1.4 },
  { name: "Sausage",               kcal: 301, protein: 11,  fat: 27,  carbs: 3   },
  { name: "Ham",                   kcal: 145, protein: 17,  fat: 8,   carbs: 1.5 },
  // Fish & Seafood
  { name: "Salmon",                kcal: 208, protein: 20,  fat: 13,  carbs: 0   },
  { name: "Tuna (canned)",         kcal: 116, protein: 26,  fat: 1,   carbs: 0   },
  { name: "Cod",                   kcal: 82,  protein: 18,  fat: 0.7, carbs: 0   },
  { name: "Tilapia",               kcal: 96,  protein: 20,  fat: 1.7, carbs: 0   },
  { name: "Shrimp",                kcal: 99,  protein: 24,  fat: 0.3, carbs: 0.2 },
  { name: "Herring",               kcal: 203, protein: 18,  fat: 14,  carbs: 0   },
  { name: "Mackerel",              kcal: 305, protein: 19,  fat: 25,  carbs: 0   },
  { name: "Sardines",              kcal: 208, protein: 25,  fat: 11,  carbs: 0   },
  // Dairy & Eggs
  { name: "Egg",                   kcal: 155, protein: 13,  fat: 11,  carbs: 1.1 },
  { name: "Egg white",             kcal: 52,  protein: 11,  fat: 0.2, carbs: 0.7 },
  { name: "Egg yolk",              kcal: 322, protein: 16,  fat: 27,  carbs: 3.6 },
  { name: "Milk (whole)",          kcal: 61,  protein: 3.2, fat: 3.3, carbs: 4.8 },
  { name: "Milk (skim)",           kcal: 34,  protein: 3.4, fat: 0.1, carbs: 5   },
  { name: "Greek yogurt",          kcal: 59,  protein: 10,  fat: 0.4, carbs: 3.6 },
  { name: "Yogurt (plain)",        kcal: 61,  protein: 3.5, fat: 3.3, carbs: 4.7 },
  { name: "Cheddar cheese",        kcal: 403, protein: 25,  fat: 33,  carbs: 1.3 },
  { name: "Mozzarella",            kcal: 280, protein: 28,  fat: 17,  carbs: 3.1 },
  { name: "Cottage cheese",        kcal: 98,  protein: 11,  fat: 4.3, carbs: 3.4 },
  { name: "Cream cheese",          kcal: 342, protein: 6,   fat: 34,  carbs: 4.1 },
  { name: "Butter",                kcal: 717, protein: 0.9, fat: 81,  carbs: 0.1 },
  { name: "Heavy cream",           kcal: 340, protein: 2.8, fat: 36,  carbs: 2.7 },
  { name: "Sour cream",            kcal: 198, protein: 2.1, fat: 19,  carbs: 4.6 },
  // Grains & Bread
  { name: "Rice (cooked)",         kcal: 130, protein: 2.7, fat: 0.3, carbs: 28  },
  { name: "Rice (dry)",            kcal: 365, protein: 7.5, fat: 0.7, carbs: 80  },
  { name: "Oats (dry)",            kcal: 389, protein: 17,  fat: 7,   carbs: 66  },
  { name: "Oats (cooked)",         kcal: 71,  protein: 2.5, fat: 1.5, carbs: 12  },
  { name: "Pasta (cooked)",        kcal: 158, protein: 5.8, fat: 0.9, carbs: 31  },
  { name: "Pasta (dry)",           kcal: 371, protein: 13,  fat: 1.5, carbs: 74  },
  { name: "White bread",           kcal: 265, protein: 9,   fat: 3.2, carbs: 49  },
  { name: "Whole wheat bread",     kcal: 247, protein: 13,  fat: 4.2, carbs: 41  },
  { name: "Buckwheat (cooked)",    kcal: 92,  protein: 3.4, fat: 0.6, carbs: 20  },
  { name: "Quinoa (cooked)",       kcal: 120, protein: 4.4, fat: 1.9, carbs: 21  },
  { name: "Corn flour",            kcal: 361, protein: 7,   fat: 3.9, carbs: 74  },
  { name: "Wheat flour",           kcal: 364, protein: 10,  fat: 1,   carbs: 76  },
  { name: "Tortilla (flour)",      kcal: 312, protein: 8.1, fat: 7.3, carbs: 52  },
  // Vegetables
  { name: "Broccoli",              kcal: 34,  protein: 2.8, fat: 0.4, carbs: 7   },
  { name: "Spinach",               kcal: 23,  protein: 2.9, fat: 0.4, carbs: 3.6 },
  { name: "Carrot",                kcal: 41,  protein: 0.9, fat: 0.2, carbs: 10  },
  { name: "Potato",                kcal: 77,  protein: 2,   fat: 0.1, carbs: 17  },
  { name: "Sweet potato",          kcal: 86,  protein: 1.6, fat: 0.1, carbs: 20  },
  { name: "Tomato",                kcal: 18,  protein: 0.9, fat: 0.2, carbs: 3.9 },
  { name: "Cucumber",              kcal: 15,  protein: 0.7, fat: 0.1, carbs: 3.6 },
  { name: "Onion",                 kcal: 40,  protein: 1.1, fat: 0.1, carbs: 9.3 },
  { name: "Garlic",                kcal: 149, protein: 6.4, fat: 0.5, carbs: 33  },
  { name: "Bell pepper",           kcal: 31,  protein: 1,   fat: 0.3, carbs: 6   },
  { name: "Zucchini",              kcal: 17,  protein: 1.2, fat: 0.3, carbs: 3.1 },
  { name: "Eggplant",              kcal: 25,  protein: 1,   fat: 0.2, carbs: 6   },
  { name: "Cabbage",               kcal: 25,  protein: 1.3, fat: 0.1, carbs: 5.8 },
  { name: "Lettuce",               kcal: 15,  protein: 1.4, fat: 0.2, carbs: 2.9 },
  { name: "Mushrooms",             kcal: 22,  protein: 3.1, fat: 0.3, carbs: 3.3 },
  { name: "Corn",                  kcal: 86,  protein: 3.3, fat: 1.2, carbs: 19  },
  { name: "Peas",                  kcal: 81,  protein: 5.4, fat: 0.4, carbs: 14  },
  { name: "Green beans",           kcal: 31,  protein: 1.8, fat: 0.1, carbs: 7   },
  { name: "Celery",                kcal: 16,  protein: 0.7, fat: 0.2, carbs: 3   },
  { name: "Asparagus",             kcal: 20,  protein: 2.2, fat: 0.1, carbs: 3.9 },
  // Fruits
  { name: "Apple",                 kcal: 52,  protein: 0.3, fat: 0.2, carbs: 14  },
  { name: "Banana",                kcal: 89,  protein: 1.1, fat: 0.3, carbs: 23  },
  { name: "Orange",                kcal: 47,  protein: 0.9, fat: 0.1, carbs: 12  },
  { name: "Grapes",                kcal: 69,  protein: 0.6, fat: 0.2, carbs: 18  },
  { name: "Strawberry",            kcal: 32,  protein: 0.7, fat: 0.3, carbs: 7.7 },
  { name: "Blueberry",             kcal: 57,  protein: 0.7, fat: 0.3, carbs: 14  },
  { name: "Mango",                 kcal: 60,  protein: 0.8, fat: 0.4, carbs: 15  },
  { name: "Pineapple",             kcal: 50,  protein: 0.5, fat: 0.1, carbs: 13  },
  { name: "Watermelon",            kcal: 30,  protein: 0.6, fat: 0.2, carbs: 7.6 },
  { name: "Avocado",               kcal: 160, protein: 2,   fat: 15,  carbs: 9   },
  // Legumes
  { name: "Lentils (cooked)",      kcal: 116, protein: 9,   fat: 0.4, carbs: 20  },
  { name: "Chickpeas (cooked)",    kcal: 164, protein: 8.9, fat: 2.6, carbs: 27  },
  { name: "Black beans (cooked)",  kcal: 132, protein: 8.9, fat: 0.5, carbs: 24  },
  { name: "Kidney beans (cooked)", kcal: 127, protein: 8.7, fat: 0.5, carbs: 23  },
  { name: "Tofu",                  kcal: 76,  protein: 8,   fat: 4.8, carbs: 1.9 },
  // Nuts & Seeds
  { name: "Almonds",               kcal: 579, protein: 21,  fat: 50,  carbs: 22  },
  { name: "Walnuts",               kcal: 654, protein: 15,  fat: 65,  carbs: 14  },
  { name: "Cashews",               kcal: 553, protein: 18,  fat: 44,  carbs: 30  },
  { name: "Peanuts",               kcal: 567, protein: 26,  fat: 49,  carbs: 16  },
  { name: "Sunflower seeds",       kcal: 584, protein: 21,  fat: 51,  carbs: 20  },
  { name: "Chia seeds",            kcal: 486, protein: 17,  fat: 31,  carbs: 42  },
  { name: "Flaxseeds",             kcal: 534, protein: 18,  fat: 42,  carbs: 29  },
  { name: "Peanut butter",         kcal: 588, protein: 25,  fat: 50,  carbs: 20  },
  // Oils & Fats
  { name: "Olive oil",             kcal: 884, protein: 0,   fat: 100, carbs: 0   },
  { name: "Sunflower oil",         kcal: 884, protein: 0,   fat: 100, carbs: 0   },
  { name: "Coconut oil",           kcal: 862, protein: 0,   fat: 100, carbs: 0   },
  { name: "Mayonnaise",            kcal: 680, protein: 1.1, fat: 75,  carbs: 0.6 },
  // Other
  { name: "Honey",                 kcal: 304, protein: 0.3, fat: 0,   carbs: 82  },
  { name: "Sugar",                 kcal: 387, protein: 0,   fat: 0,   carbs: 100 },
  { name: "Dark chocolate",        kcal: 598, protein: 5.5, fat: 43,  carbs: 46  },
  { name: "Milk chocolate",        kcal: 535, protein: 7.7, fat: 30,  carbs: 59  },
  { name: "Ketchup",               kcal: 112, protein: 1.3, fat: 0.1, carbs: 27  },
  { name: "Soy sauce",             kcal: 53,  protein: 8.1, fat: 0.1, carbs: 5   },
];

// Translations keyed by English name → { ru, uk, be, es, de, fr }
const INGREDIENT_TRANSLATIONS = {
  "Chicken breast":        { ru:"Куриная грудка",    uk:"Куряча грудка",     be:"Курыная грудзінка", es:"Pechuga de pollo",    de:"Hähnchenbrust",       fr:"Blanc de poulet" },
  "Chicken thigh":         { ru:"Куриное бедро",     uk:"Куряче стегно",     be:"Курынае сцягно",    es:"Muslo de pollo",      de:"Hähnchenschenkel",    fr:"Cuisse de poulet" },
  "Beef (lean ground)":    { ru:"Говяжий фарш",      uk:"Яловичий фарш",     be:"Ялавічны фарш",     es:"Carne picada",        de:"Hackfleisch",         fr:"Bœuf haché" },
  "Beef steak":            { ru:"Говяжий стейк",     uk:"Яловичий стейк",    be:"Ялавічны стэйк",    es:"Bistec de res",       de:"Rindersteak",         fr:"Steak de bœuf" },
  "Pork loin":             { ru:"Свиная корейка",    uk:"Свиняча корейка",   be:"Свіная карэйка",    es:"Lomo de cerdo",       de:"Schweinefilet",       fr:"Longe de porc" },
  "Pork belly":            { ru:"Свиная грудинка",   uk:"Свиняча грудинка",  be:"Свіная грудзінка",  es:"Panceta",             de:"Schweinebauch",       fr:"Poitrine de porc" },
  "Turkey breast":         { ru:"Индейка грудка",    uk:"Індичка грудка",    be:"Індычая грудзінка", es:"Pechuga de pavo",     de:"Putenbrust",          fr:"Blanc de dinde" },
  "Lamb":                  { ru:"Баранина",          uk:"Баранина",          be:"Бараніна",          es:"Cordero",             de:"Lammfleisch",         fr:"Agneau" },
  "Duck":                  { ru:"Утка",              uk:"Качка",             be:"Качка",             es:"Pato",                de:"Ente",                fr:"Canard" },
  "Bacon":                 { ru:"Бекон",             uk:"Бекон",             be:"Бекон",             es:"Bacon",               de:"Speck",               fr:"Lard" },
  "Sausage":               { ru:"Колбаса",           uk:"Ковбаса",           be:"Каўбаса",           es:"Salchicha",           de:"Wurst",               fr:"Saucisse" },
  "Ham":                   { ru:"Ветчина",           uk:"Шинка",             be:"Шынка",             es:"Jamón",               de:"Schinken",            fr:"Jambon" },
  "Salmon":                { ru:"Лосось",            uk:"Лосось",            be:"Ласось",            es:"Salmón",              de:"Lachs",               fr:"Saumon" },
  "Tuna (canned)":         { ru:"Тунец (консерва)",  uk:"Тунець (консерва)", be:"Тунец (кансерва)",  es:"Atún (lata)",         de:"Thunfisch (Dose)",    fr:"Thon (conserve)" },
  "Cod":                   { ru:"Треска",            uk:"Тріска",            be:"Трэска",            es:"Bacalao",             de:"Kabeljau",            fr:"Morue" },
  "Tilapia":               { ru:"Тилапия",           uk:"Тиляпія",           be:"Тылапія",           es:"Tilapia",             de:"Tilapia",             fr:"Tilapia" },
  "Shrimp":                { ru:"Креветки",          uk:"Креветки",          be:"Крэветкі",          es:"Gambas",              de:"Garnelen",            fr:"Crevettes" },
  "Herring":               { ru:"Сельдь",            uk:"Оселедець",         be:"Селядзец",          es:"Arenque",             de:"Hering",              fr:"Hareng" },
  "Mackerel":              { ru:"Скумбрия",          uk:"Скумбрія",          be:"Скумбрыя",          es:"Caballa",             de:"Makrele",             fr:"Maquereau" },
  "Sardines":              { ru:"Сардины",           uk:"Сардини",           be:"Сардзіны",          es:"Sardinas",            de:"Sardinen",            fr:"Sardines" },
  "Egg":                   { ru:"Яйцо",              uk:"Яйце",              be:"Яйка",              es:"Huevo",               de:"Ei",                  fr:"Œuf" },
  "Egg white":             { ru:"Белок яйца",        uk:"Білок яйця",        be:"Бялок яйка",        es:"Clara de huevo",      de:"Eiweiß",              fr:"Blanc d'œuf" },
  "Egg yolk":              { ru:"Желток яйца",       uk:"Жовток яйця",       be:"Жаўток яйка",       es:"Yema de huevo",       de:"Eigelb",              fr:"Jaune d'œuf" },
  "Milk (whole)":          { ru:"Молоко (цельное)",  uk:"Молоко (цільне)",   be:"Малако (цэльнае)",  es:"Leche entera",        de:"Vollmilch",           fr:"Lait entier" },
  "Milk (skim)":           { ru:"Молоко (обезжир.)", uk:"Молоко (знежир.)",  be:"Малако (абезжыр.)", es:"Leche desnatada",     de:"Magermilch",          fr:"Lait écrémé" },
  "Greek yogurt":          { ru:"Греческий йогурт",  uk:"Грецький йогурт",   be:"Грэчаскі ёгурт",    es:"Yogur griego",        de:"Griechischer Joghurt",fr:"Yaourt grec" },
  "Yogurt (plain)":        { ru:"Йогурт",            uk:"Йогурт",            be:"Ёгурт",             es:"Yogur natural",       de:"Joghurt",             fr:"Yaourt nature" },
  "Cheddar cheese":        { ru:"Сыр чеддер",        uk:"Сир чеддер",        be:"Сыр чэдар",         es:"Queso cheddar",       de:"Cheddar-Käse",        fr:"Fromage cheddar" },
  "Mozzarella":            { ru:"Моцарелла",         uk:"Моцарела",          be:"Мацарэла",          es:"Mozzarella",          de:"Mozzarella",          fr:"Mozzarella" },
  "Cottage cheese":        { ru:"Творог",            uk:"Сир кисломолочний", be:"Тварог",            es:"Requesón",            de:"Hüttenkäse",          fr:"Fromage blanc" },
  "Cream cheese":          { ru:"Сливочный сыр",     uk:"Вершковий сир",     be:"Сліўкавы сыр",      es:"Queso crema",         de:"Frischkäse",          fr:"Fromage à la crème" },
  "Butter":                { ru:"Масло сливочное",   uk:"Масло вершкове",    be:"Сліўкавае масла",   es:"Mantequilla",         de:"Butter",              fr:"Beurre" },
  "Heavy cream":           { ru:"Сливки",            uk:"Вершки",            be:"Смятана жырная",    es:"Nata para montar",    de:"Sahne",               fr:"Crème entière" },
  "Sour cream":            { ru:"Сметана",           uk:"Сметана",           be:"Смятана",           es:"Crema agria",         de:"Sauerrahm",           fr:"Crème fraîche" },
  "Rice (cooked)":         { ru:"Рис (варёный)",     uk:"Рис (варений)",     be:"Рыс (варыты)",      es:"Arroz (cocido)",      de:"Reis (gekocht)",      fr:"Riz (cuit)" },
  "Rice (dry)":            { ru:"Рис (сырой)",       uk:"Рис (сирий)",       be:"Рыс (сыры)",        es:"Arroz (crudo)",       de:"Reis (roh)",          fr:"Riz (cru)" },
  "Oats (dry)":            { ru:"Овсянка (сухая)",   uk:"Вівсянка (суха)",   be:"Аўсянка (сухая)",   es:"Avena (seca)",        de:"Haferflocken",        fr:"Flocons d'avoine" },
  "Oats (cooked)":         { ru:"Овсянка (варёная)", uk:"Вівсянка (варена)", be:"Аўсянка (варытая)", es:"Avena (cocida)",      de:"Haferbrei",           fr:"Porridge" },
  "Pasta (cooked)":        { ru:"Паста (варёная)",   uk:"Паста (варена)",    be:"Паста (варытая)",   es:"Pasta (cocida)",      de:"Pasta (gekocht)",     fr:"Pâtes (cuites)" },
  "Pasta (dry)":           { ru:"Паста (сухая)",     uk:"Паста (суха)",      be:"Паста (сухая)",     es:"Pasta (cruda)",       de:"Pasta (roh)",         fr:"Pâtes (crues)" },
  "White bread":           { ru:"Белый хлеб",        uk:"Білий хліб",        be:"Белы хлеб",         es:"Pan blanco",          de:"Weißbrot",            fr:"Pain blanc" },
  "Whole wheat bread":     { ru:"Цельнозерновой хлеб",uk:"Цільнозерновий хліб",be:"Цельназ. хлеб",  es:"Pan integral",        de:"Vollkornbrot",        fr:"Pain complet" },
  "Buckwheat (cooked)":    { ru:"Гречка (варёная)",  uk:"Гречка (варена)",   be:"Грэчка (варытая)",  es:"Alforfón (cocido)",   de:"Buchweizen (gekocht)",fr:"Sarrasin (cuit)" },
  "Quinoa (cooked)":       { ru:"Киноа (варёная)",   uk:"Кіноа (варена)",    be:"Кіноа (варытая)",   es:"Quinoa (cocida)",     de:"Quinoa (gekocht)",    fr:"Quinoa (cuit)" },
  "Corn flour":            { ru:"Кукурузная мука",   uk:"Кукурудзяне борошно",be:"Кукурузная мука",  es:"Harina de maíz",      de:"Maismehl",            fr:"Farine de maïs" },
  "Wheat flour":           { ru:"Пшеничная мука",    uk:"Пшеничне борошно",  be:"Пшанічная мука",    es:"Harina de trigo",     de:"Weizenmehl",          fr:"Farine de blé" },
  "Tortilla (flour)":      { ru:"Тортилья",          uk:"Тортілья",          be:"Тартылья",          es:"Tortilla de harina",  de:"Mehl-Tortilla",       fr:"Tortilla de farine" },
  "Broccoli":              { ru:"Брокколи",          uk:"Брокколі",          be:"Бракалі",           es:"Brócoli",             de:"Brokkoli",            fr:"Brocoli" },
  "Spinach":               { ru:"Шпинат",            uk:"Шпинат",            be:"Шпінат",            es:"Espinacas",           de:"Spinat",              fr:"Épinards" },
  "Carrot":                { ru:"Морковь",           uk:"Морква",            be:"Морква",            es:"Zanahoria",           de:"Karotte",             fr:"Carotte" },
  "Potato":                { ru:"Картофель",         uk:"Картопля",          be:"Бульба",            es:"Patata",              de:"Kartoffel",           fr:"Pomme de terre" },
  "Sweet potato":          { ru:"Батат",             uk:"Батат",             be:"Батат",             es:"Boniato",             de:"Süßkartoffel",        fr:"Patate douce" },
  "Tomato":                { ru:"Помидор",           uk:"Томат",             be:"Памідор",           es:"Tomate",              de:"Tomate",              fr:"Tomate" },
  "Cucumber":              { ru:"Огурец",            uk:"Огірок",            be:"Агурок",            es:"Pepino",              de:"Gurke",               fr:"Concombre" },
  "Onion":                 { ru:"Лук",               uk:"Цибуля",            be:"Цыбуля",            es:"Cebolla",             de:"Zwiebel",             fr:"Oignon" },
  "Garlic":                { ru:"Чеснок",            uk:"Часник",            be:"Часнок",            es:"Ajo",                 de:"Knoblauch",           fr:"Ail" },
  "Bell pepper":           { ru:"Болгарский перец",  uk:"Болгарський перець",be:"Балгарскі перац",   es:"Pimiento",            de:"Paprika",             fr:"Poivron" },
  "Zucchini":              { ru:"Кабачок",           uk:"Кабачок",           be:"Кабачок",           es:"Calabacín",           de:"Zucchini",            fr:"Courgette" },
  "Eggplant":              { ru:"Баклажан",          uk:"Баклажан",          be:"Баклажан",          es:"Berenjena",           de:"Aubergine",           fr:"Aubergine" },
  "Cabbage":               { ru:"Капуста",           uk:"Капуста",           be:"Капуста",           es:"Col",                 de:"Kohl",                fr:"Chou" },
  "Lettuce":               { ru:"Салат",             uk:"Салат",             be:"Салат",             es:"Lechuga",             de:"Salat",               fr:"Laitue" },
  "Mushrooms":             { ru:"Грибы",             uk:"Гриби",             be:"Грыбы",             es:"Setas",               de:"Pilze",               fr:"Champignons" },
  "Corn":                  { ru:"Кукуруза",          uk:"Кукурудза",         be:"Кукуруза",          es:"Maíz",                de:"Mais",                fr:"Maïs" },
  "Peas":                  { ru:"Горох",             uk:"Горох",             be:"Гарох",             es:"Guisantes",           de:"Erbsen",              fr:"Petits pois" },
  "Green beans":           { ru:"Стручковая фасоль", uk:"Стручкова квасоля",be:"Струкавая фасоля",   es:"Judías verdes",       de:"Grüne Bohnen",        fr:"Haricots verts" },
  "Celery":                { ru:"Сельдерей",         uk:"Селера",            be:"Селера",            es:"Apio",                de:"Sellerie",            fr:"Céleri" },
  "Asparagus":             { ru:"Спаржа",            uk:"Спаржа",            be:"Спаржа",            es:"Espárragos",          de:"Spargel",             fr:"Asperges" },
  "Apple":                 { ru:"Яблоко",            uk:"Яблуко",            be:"Яблык",             es:"Manzana",             de:"Apfel",               fr:"Pomme" },
  "Banana":                { ru:"Банан",             uk:"Банан",             be:"Банан",             es:"Plátano",             de:"Banane",              fr:"Banane" },
  "Orange":                { ru:"Апельсин",          uk:"Апельсин",          be:"Апельсін",          es:"Naranja",             de:"Orange",              fr:"Orange" },
  "Grapes":                { ru:"Виноград",          uk:"Виноград",          be:"Вінаград",          es:"Uvas",                de:"Trauben",             fr:"Raisins" },
  "Strawberry":            { ru:"Клубника",          uk:"Полуниця",          be:"Клубніца",          es:"Fresa",               de:"Erdbeere",            fr:"Fraise" },
  "Blueberry":             { ru:"Черника",           uk:"Чорниця",           be:"Чарніца",           es:"Arándano",            de:"Blaubeere",           fr:"Myrtille" },
  "Mango":                 { ru:"Манго",             uk:"Манго",             be:"Манга",             es:"Mango",               de:"Mango",               fr:"Mangue" },
  "Pineapple":             { ru:"Ананас",            uk:"Ананас",            be:"Ананас",            es:"Piña",                de:"Ananas",              fr:"Ananas" },
  "Watermelon":            { ru:"Арбуз",             uk:"Кавун",             be:"Кавун",             es:"Sandía",              de:"Wassermelone",        fr:"Pastèque" },
  "Avocado":               { ru:"Авокадо",           uk:"Авокадо",           be:"Авакада",           es:"Aguacate",            de:"Avocado",             fr:"Avocat" },
  "Lentils (cooked)":      { ru:"Чечевица (варёная)",uk:"Сочевиця (варена)", be:"Сачавіца (варытая)",es:"Lentejas (cocidas)",  de:"Linsen (gekocht)",    fr:"Lentilles (cuites)" },
  "Chickpeas (cooked)":    { ru:"Нут (варёный)",     uk:"Нут (варений)",     be:"Нут (варыты)",      es:"Garbanzos (cocidos)", de:"Kichererbsen",        fr:"Pois chiches (cuits)" },
  "Black beans (cooked)":  { ru:"Чёрная фасоль",     uk:"Чорна квасоля",     be:"Чорная фасоля",     es:"Judías negras",       de:"Schwarze Bohnen",     fr:"Haricots noirs" },
  "Kidney beans (cooked)": { ru:"Красная фасоль",    uk:"Червона квасоля",   be:"Чырвоная фасоля",   es:"Judías rojas",        de:"Kidneybohnen",        fr:"Haricots rouges" },
  "Tofu":                  { ru:"Тофу",              uk:"Тофу",              be:"Тофу",              es:"Tofu",                de:"Tofu",                fr:"Tofu" },
  "Almonds":               { ru:"Миндаль",           uk:"Мигдаль",           be:"Міндаль",           es:"Almendras",           de:"Mandeln",             fr:"Amandes" },
  "Walnuts":               { ru:"Грецкие орехи",     uk:"Волоські горіхи",   be:"Грэцкія арэхі",     es:"Nueces",              de:"Walnüsse",            fr:"Noix" },
  "Cashews":               { ru:"Кешью",             uk:"Кеш'ю",             be:"Кешью",             es:"Anacardos",           de:"Cashews",             fr:"Noix de cajou" },
  "Peanuts":               { ru:"Арахис",            uk:"Арахіс",            be:"Арахіс",            es:"Cacahuetes",          de:"Erdnüsse",            fr:"Cacahuètes" },
  "Sunflower seeds":       { ru:"Семена подсолнуха", uk:"Насіння соняшника", be:"Сем. сланечніка",   es:"Pipas de girasol",    de:"Sonnenblumenkerne",   fr:"Graines de tournesol" },
  "Chia seeds":            { ru:"Семена чиа",        uk:"Насіння чіа",       be:"Сем. чыя",          es:"Semillas de chía",    de:"Chiasamen",           fr:"Graines de chia" },
  "Flaxseeds":             { ru:"Семена льна",       uk:"Насіння льону",     be:"Сем. ільну",        es:"Semillas de lino",    de:"Leinsamen",           fr:"Graines de lin" },
  "Peanut butter":         { ru:"Арахисовая паста",  uk:"Арахісова паста",   be:"Арахісавая паста",  es:"Mantequilla de maní", de:"Erdnussbutter",       fr:"Beurre de cacahuète" },
  "Olive oil":             { ru:"Оливковое масло",   uk:"Оливкова олія",     be:"Аліўкавы алей",     es:"Aceite de oliva",     de:"Olivenöl",            fr:"Huile d'olive" },
  "Sunflower oil":         { ru:"Подсолнечное масло",uk:"Соняшникова олія",  be:"Сланечнікавы алей", es:"Aceite de girasol",   de:"Sonnenblumenöl",      fr:"Huile de tournesol" },
  "Coconut oil":           { ru:"Кокосовое масло",   uk:"Кокосова олія",     be:"Какосавы алей",     es:"Aceite de coco",      de:"Kokosöl",             fr:"Huile de coco" },
  "Mayonnaise":            { ru:"Майонез",           uk:"Майонез",           be:"Маянэз",            es:"Mayonesa",            de:"Mayonnaise",          fr:"Mayonnaise" },
  "Honey":                 { ru:"Мёд",               uk:"Мед",               be:"Мёд",               es:"Miel",                de:"Honig",               fr:"Miel" },
  "Sugar":                 { ru:"Сахар",             uk:"Цукор",             be:"Цукар",             es:"Azúcar",              de:"Zucker",              fr:"Sucre" },
  "Dark chocolate":        { ru:"Тёмный шоколад",    uk:"Чорний шоколад",    be:"Цёмны шакалад",     es:"Chocolate negro",     de:"Zartbitterschokolade",fr:"Chocolat noir" },
  "Milk chocolate":        { ru:"Молочный шоколад",  uk:"Молочний шоколад",  be:"Малочны шакалад",   es:"Chocolate con leche", de:"Vollmilchschokolade", fr:"Chocolat au lait" },
  "Ketchup":               { ru:"Кетчуп",            uk:"Кетчуп",            be:"Кетчуп",            es:"Kétchup",             de:"Ketchup",             fr:"Ketchup" },
  "Soy sauce":             { ru:"Соевый соус",       uk:"Соєвий соус",       be:"Саевы соус",        es:"Salsa de soja",       de:"Sojasoße",            fr:"Sauce soja" },
};

function getIngredientName(ing) {
  const t = INGREDIENT_TRANSLATIONS[ing.name];
  if (!t) return ing.name;
  return t[typeof currentLang !== "undefined" ? currentLang : "en"] || ing.name;
}

const INGREDIENT_FUSE_OPTIONS = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.3,
  ignoreLocation: true,
  ignoreDiacritics: true,
  minMatchCharLength: 2,
  keys: [
    { name: "localizedName", weight: 0.45 },
    { name: "name", weight: 0.3 },
    { name: "aliases", weight: 0.25 },
  ],
};

let ingredientFuse = null;
let ingredientFuseLang = null;

function getIngredientAliases(ing) {
  const t = INGREDIENT_TRANSLATIONS[ing.name];

  return Array.from(new Set([ing.name, ...(t ? Object.values(t) : [])]));
}

function buildIngredientFuse() {
  if (typeof Fuse === "undefined") return null;

  const indexed = INGREDIENTS.map(ing => ({
    ref: ing,
    name: ing.name,
    localizedName: getIngredientName(ing),
    aliases: getIngredientAliases(ing),
  }));

  ingredientFuse = new Fuse(indexed, INGREDIENT_FUSE_OPTIONS);
  ingredientFuseLang =
    typeof currentLang !== "undefined" ? currentLang : "en";

  return ingredientFuse;
}

function getIngredientFuse() {
  const lang = typeof currentLang !== "undefined" ? currentLang : "en";

  if (!ingredientFuse || ingredientFuseLang !== lang) {
    return buildIngredientFuse();
  }

  return ingredientFuse;
}

function searchIngredients(q) {
  const query = q.trim();
  if (!query) return [];

  const fallbackSearch = () => {
    const lq = query.toLowerCase();

    return INGREDIENTS.filter(ing =>
      getIngredientAliases(ing).some(alias =>
        alias.toLowerCase().includes(lq)
      )
    ).slice(0, 5);
  };

  if (query.length < 2) {
    return fallbackSearch();
  }

  const fuse = getIngredientFuse();
  if (!fuse) return fallbackSearch();

  return fuse.search(query, { limit: 5 }).map(result => result.item.ref);
}
