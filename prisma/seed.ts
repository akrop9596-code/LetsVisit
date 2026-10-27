import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.tripPlace.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.report.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.propertyAmenity.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.placeImage.deleteMany();
  await prisma.place.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('password123', 10);

  // Users
  const admin = await prisma.user.create({ data: { name: 'Admin User', email: 'admin@letsvisit.in', passwordHash: hash, role: 'ADMIN', preferences: '[]' } });
  const owner = await prisma.user.create({ data: { name: 'Rajesh Kumar', email: 'rajesh@example.com', passwordHash: hash, role: 'PROPERTY_OWNER', phone: '+91 98765 43210', preferences: '[]' } });
  const tourist = await prisma.user.create({ data: { name: 'Priya Sharma', email: 'priya@example.com', passwordHash: hash, role: 'TOURIST', preferences: '[]' } });
  console.log('✅ Users created');

  // Amenities
  const amenityNames = ['WiFi', 'Parking', 'Air Conditioning', 'Kitchen', 'Pool', 'Hot Water', 'TV', 'Washing Machine', 'Balcony', 'Garden'];
  const amenities = await Promise.all(amenityNames.map(name => prisma.amenity.create({ data: { name, icon: '✓' } })));
  console.log('✅ Amenities created');

  // Places (tags is JSON string for SQLite)
  const placesData = [
    { name: 'Hawa Mahal', category: 'HISTORICAL', description: 'The Palace of Winds is a stunning five-story building with 953 small windows designed to allow royal women to observe street life without being seen. Built in 1799, this iconic pink sandstone structure is one of Jaipur\'s most photographed landmarks.', shortDescription: 'Iconic pink sandstone palace with 953 windows', address: 'Hawa Mahal Rd, Badi Choupad', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9239, longitude: 75.8267, openingTime: '9:00 AM', closingTime: '5:00 PM', entryFee: 50, estimatedDuration: '1-2 hours', bestTimeToVisit: 'October to March', tags: JSON.stringify(['heritage', 'photography', 'architecture']), isFeatured: true, ratingAvg: 4.5, reviewCount: 3 },
    { name: 'Amber Fort', category: 'FORT', description: 'Amber Fort is a majestic fort complex overlooking Maota Lake. Built from red sandstone and marble, it blends Hindu and Rajput architecture. The fort includes the Sheesh Mahal (Mirror Palace) and offers elephant rides to the entrance.', shortDescription: 'Majestic hilltop fort with stunning lake views', address: 'Devisinghpura, Amer', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9855, longitude: 75.8513, openingTime: '8:00 AM', closingTime: '5:30 PM', entryFee: 200, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to March', tags: JSON.stringify(['fort', 'heritage', 'architecture']), isFeatured: true, ratingAvg: 4.7, reviewCount: 2 },
    { name: 'Calangute Beach', category: 'BEACH', description: 'Known as the Queen of Beaches, Calangute is one of the largest and most popular beaches in North Goa. It offers water sports, beach shacks, vibrant nightlife, and stunning sunsets over the Arabian Sea.', shortDescription: 'The Queen of Beaches in North Goa', address: 'Calangute', city: 'Goa', state: 'Goa', latitude: 15.5449, longitude: 73.7550, entryFee: 0, estimatedDuration: '3-4 hours', bestTimeToVisit: 'November to February', tags: JSON.stringify(['beach', 'water-sports', 'nightlife']), isFeatured: true, ratingAvg: 4.2, reviewCount: 2 },
    { name: 'India Gate', category: 'MONUMENT', description: 'India Gate is a 42-meter tall war memorial arch standing at the heart of New Delhi. Built to honor 70,000 Indian soldiers who died in World War I, it is surrounded by lush lawns and is beautifully illuminated at night.', shortDescription: 'Iconic war memorial in the heart of Delhi', address: 'Rajpath, India Gate', city: 'Delhi', state: 'Delhi', latitude: 28.6129, longitude: 77.2295, entryFee: 0, estimatedDuration: '1 hour', bestTimeToVisit: 'October to March', tags: JSON.stringify(['monument', 'history', 'landmark']), isFeatured: true, ratingAvg: 4.4, reviewCount: 2 },
    { name: 'Gateway of India', category: 'MONUMENT', description: 'The Gateway of India is a grand arch monument overlooking the Arabian Sea. Built to commemorate the visit of King George V in 1911, this Indo-Saracenic style structure is Mumbai\'s most iconic landmark.', shortDescription: 'Mumbai\'s most iconic waterfront monument', address: 'Apollo Bandar, Colaba', city: 'Mumbai', state: 'Maharashtra', latitude: 18.9220, longitude: 72.8347, entryFee: 0, estimatedDuration: '1-2 hours', bestTimeToVisit: 'November to February', tags: JSON.stringify(['monument', 'history', 'waterfront']), isFeatured: true, ratingAvg: 4.3, reviewCount: 1 },
    { name: 'Victoria Memorial', category: 'MUSEUM', description: 'A grand white marble building dedicated to Queen Victoria, now serving as a museum with a vast collection of paintings, sculptures, and artifacts from the British Raj era. The surrounding gardens are beautifully maintained.', shortDescription: 'Magnificent white marble museum and gardens', address: '1, Queens Way', city: 'Kolkata', state: 'West Bengal', latitude: 22.5448, longitude: 88.3426, openingTime: '10:00 AM', closingTime: '5:00 PM', entryFee: 30, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to March', tags: JSON.stringify(['museum', 'history', 'architecture']), isFeatured: true, ratingAvg: 4.6, reviewCount: 1 },
    { name: 'Solang Valley', category: 'MOUNTAIN', description: 'Solang Valley is a side valley at the top of the Kullu Valley, famous for its panoramic views and adventure sports. In winter it transforms into a ski resort, while summer brings paragliding and zorbing.', shortDescription: 'Adventure sports paradise with mountain views', address: 'Solang Valley', city: 'Manali', state: 'Himachal Pradesh', latitude: 32.3150, longitude: 77.1575, entryFee: 0, estimatedDuration: '4-5 hours', bestTimeToVisit: 'May to October', tags: JSON.stringify(['adventure', 'skiing', 'mountains']), isFeatured: true, ratingAvg: 4.5, reviewCount: 1 },
    { name: 'City Palace Udaipur', category: 'HISTORICAL', description: 'The City Palace of Udaipur is a magnificent complex on the banks of Lake Pichola, blending Rajasthani and Mughal architecture. It offers breathtaking views of the lake and the Aravalli hills.', shortDescription: 'Lakeside palace with stunning views', address: 'City Palace Complex', city: 'Udaipur', state: 'Rajasthan', latitude: 24.5764, longitude: 73.6913, openingTime: '9:30 AM', closingTime: '5:30 PM', entryFee: 300, estimatedDuration: '2-3 hours', bestTimeToVisit: 'September to March', tags: JSON.stringify(['palace', 'heritage', 'lake']), isFeatured: true, ratingAvg: 4.7, reviewCount: 1 },
    { name: 'Dashashwamedh Ghat', category: 'RELIGIOUS', description: 'The most famous ghat in Varanasi, known for its spectacular Ganga Aarti ceremony held every evening. Thousands gather to witness priests performing rituals with fire lamps on the banks of the sacred Ganges.', shortDescription: 'Famous ghat with mesmerizing Ganga Aarti', address: 'Dashashwamedh Ghat', city: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3109, longitude: 83.0107, entryFee: 0, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to March', tags: JSON.stringify(['spiritual', 'ganga-aarti', 'culture']), isFeatured: true, ratingAvg: 4.8, reviewCount: 1 },
    { name: 'Nahargarh Fort', category: 'FORT', description: 'Perched on the edge of the Aravalli Hills, Nahargarh Fort offers panoramic views of Jaipur city. Built in 1734, the fort is a popular spot for sunset viewing and houses the wax museum.', shortDescription: 'Hilltop fort with panoramic city views', address: 'Krishna Nagar', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9372, longitude: 75.8154, openingTime: '10:00 AM', closingTime: '5:30 PM', entryFee: 50, estimatedDuration: '2 hours', tags: JSON.stringify(['fort', 'sunset', 'views']), ratingAvg: 4.3, reviewCount: 1 },
    { name: 'Basilica of Bom Jesus', category: 'RELIGIOUS', description: 'A UNESCO World Heritage Site, this 16th-century church contains the mortal remains of St. Francis Xavier. It is one of the finest examples of Baroque architecture in India.', shortDescription: 'UNESCO heritage Baroque church', address: 'Old Goa', city: 'Goa', state: 'Goa', latitude: 15.5009, longitude: 73.9116, openingTime: '9:00 AM', closingTime: '6:30 PM', entryFee: 0, estimatedDuration: '1 hour', tags: JSON.stringify(['church', 'heritage', 'UNESCO']), ratingAvg: 4.4, reviewCount: 1 },
    { name: 'Qutub Minar', category: 'HISTORICAL', description: 'A UNESCO World Heritage Site, Qutub Minar is a 73-meter tall victory tower built in 1193. The red sandstone tower has intricate carvings and is surrounded by several historically significant monuments.', shortDescription: 'UNESCO heritage 73m victory tower', address: 'Mehrauli', city: 'Delhi', state: 'Delhi', latitude: 28.5245, longitude: 77.1855, openingTime: '7:00 AM', closingTime: '5:00 PM', entryFee: 35, estimatedDuration: '1-2 hours', tags: JSON.stringify(['UNESCO', 'history', 'architecture']), ratingAvg: 4.5, reviewCount: 1 },
    { name: 'Juhu Beach', category: 'BEACH', description: 'One of Mumbai\'s most famous beaches, Juhu Beach stretches for 6 km along the Arabian Sea. Famous for its street food stalls, sunset views, and Bollywood celebrity sightings.', shortDescription: 'Mumbai\'s iconic beach with street food', address: 'Juhu', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0988, longitude: 72.8267, entryFee: 0, estimatedDuration: '2-3 hours', tags: JSON.stringify(['beach', 'food', 'sunset']), ratingAvg: 4.0, reviewCount: 1 },
    { name: 'Rohtang Pass', category: 'MOUNTAIN', description: 'At 3,978 meters, Rohtang Pass connects the Kullu Valley with the Lahaul and Spiti Valleys. It offers breathtaking views of glaciers, peaks, and the Chandra River valley below.', shortDescription: 'High altitude pass with glacier views', address: 'Rohtang Pass', city: 'Manali', state: 'Himachal Pradesh', latitude: 32.3722, longitude: 77.2478, entryFee: 0, estimatedDuration: '4-5 hours', bestTimeToVisit: 'May to October', tags: JSON.stringify(['mountain', 'snow', 'adventure']), ratingAvg: 4.6, reviewCount: 1 },
    { name: 'Howrah Bridge', category: 'MONUMENT', description: 'An engineering marvel and icon of Kolkata, this cantilever bridge spans the Hooghly River without any nuts or bolts. It carries over 100,000 vehicles daily and is best seen illuminated at night.', shortDescription: 'Iconic cantilever bridge over Hooghly River', address: 'Howrah', city: 'Kolkata', state: 'West Bengal', latitude: 22.5851, longitude: 88.3468, entryFee: 0, estimatedDuration: '30 minutes', tags: JSON.stringify(['bridge', 'landmark', 'engineering']), ratingAvg: 4.2, reviewCount: 1 },
    { name: 'Radhanagar Beach', category: 'BEACH', description: 'Consistently ranked among the best beaches in Asia, Radhanagar Beach is known for its pristine white sand, turquoise waters, and breathtaking sunsets.', shortDescription: 'Asia\'s best pristine white sand beach', address: 'Havelock Island', city: 'Andaman and Nicobar Islands', state: 'Andaman and Nicobar', country: 'India', latitude: 11.9839, longitude: 92.9506, entryFee: 0, estimatedDuration: '3-4 hours', bestTimeToVisit: 'October to May', tags: JSON.stringify(['beach', 'sunset', 'nature']), isFeatured: true, ratingAvg: 4.8, reviewCount: 5 },
    { name: 'Victoria Peak', category: 'MOUNTAIN', description: 'The highest hill on Hong Kong Island, offering spectacular panoramic views of the city skyline, Victoria Harbour, and the surrounding islands.', shortDescription: 'Iconic peak with panoramic city skyline views', address: 'The Peak', city: 'Hong Kong', state: 'Hong Kong Island', country: 'Hong Kong', latitude: 22.2759, longitude: 114.1455, entryFee: 0, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to December', tags: JSON.stringify(['views', 'cityscape', 'landmark']), isFeatured: true, ratingAvg: 4.7, reviewCount: 4 },
    { name: 'Gobi Desert', category: 'NATURE', description: 'A vast, arid region in northern China and southern Mongolia. It\'s known for its dunes, mountains, and rare animals such as snow leopards and Bactrian camels.', shortDescription: 'Vast desert known for dunes and rare wildlife', address: 'Gobi', city: 'Ulaanbaatar', state: 'Ömnögovi', country: 'Mongolia', latitude: 42.5900, longitude: 103.4300, entryFee: 0, estimatedDuration: 'Multiple days', bestTimeToVisit: 'June to September', tags: JSON.stringify(['desert', 'adventure', 'nature']), isFeatured: false, ratingAvg: 4.5, reviewCount: 2 },
    { name: 'Eiffel Tower', category: 'MONUMENT', description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.', shortDescription: 'Iconic wrought-iron lattice tower', address: 'Champ de Mars', city: 'Paris', state: 'Île-de-France', country: 'France', latitude: 48.8584, longitude: 2.2945, entryFee: 28, estimatedDuration: '2-3 hours', bestTimeToVisit: 'June to August', tags: JSON.stringify(['monument', 'landmark', 'city']), isFeatured: true, ratingAvg: 4.8, reviewCount: 15 },
    { name: 'Big Ben', category: 'HISTORICAL', description: 'Big Ben is the nickname for the Great Bell of the Great Clock of Westminster, and by extension, the clock tower itself, located at the north end of the Palace of Westminster in London.', shortDescription: 'Famous clock tower in London', address: 'Westminster', city: 'London', state: 'England', country: 'United Kingdom', latitude: 51.5007, longitude: -0.1246, entryFee: 0, estimatedDuration: '1 hour', bestTimeToVisit: 'May to September', tags: JSON.stringify(['history', 'monument', 'landmark']), isFeatured: true, ratingAvg: 4.7, reviewCount: 12 },
    { name: 'Colosseum', category: 'HISTORICAL', description: 'The Colosseum is an oval amphitheatre in the centre of the city of Rome, Italy, just east of the Roman Forum. It is the largest ancient amphitheatre ever built.', shortDescription: 'Ancient Roman amphitheatre', address: 'Piazza del Colosseo', city: 'Rome', state: 'Lazio', country: 'Italy', latitude: 41.8902, longitude: 12.4922, entryFee: 16, estimatedDuration: '2-3 hours', bestTimeToVisit: 'April to October', tags: JSON.stringify(['history', 'ruins', 'UNESCO']), isFeatured: true, ratingAvg: 4.9, reviewCount: 10 },
    { name: 'Statue of Liberty', category: 'MONUMENT', description: 'A colossal neoclassical sculpture on Liberty Island in New York Harbor, USA. The copper statue is a gift from the people of France to the people of the United States.', shortDescription: 'Colossal copper sculpture symbolizing freedom', address: 'Liberty Island', city: 'New York', state: 'New York', country: 'United States', latitude: 40.6892, longitude: -74.0445, entryFee: 25, estimatedDuration: '3-4 hours', bestTimeToVisit: 'September to November', tags: JSON.stringify(['monument', 'harbor', 'landmark']), isFeatured: true, ratingAvg: 4.8, reviewCount: 14 },
    { name: 'Burj Khalifa', category: 'MONUMENT', description: 'The Burj Khalifa is a skyscraper in Dubai, United Arab Emirates. It is known for being the tallest building in the world, standing at 828 meters.', shortDescription: 'Tallest building in the world', address: 'Downtown Dubai', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', latitude: 25.1972, longitude: 55.2744, entryFee: 40, estimatedDuration: '2 hours', bestTimeToVisit: 'November to March', tags: JSON.stringify(['skyscraper', 'cityscape', 'views']), isFeatured: true, ratingAvg: 4.7, reviewCount: 8 },
    { name: 'Taj Mahal', category: 'MONUMENT', description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan.', shortDescription: 'Stunning ivory-white marble mausoleum', address: 'Dharmapuri, Forest Colony', city: 'Agra', state: 'Uttar Pradesh', country: 'India', latitude: 27.1751, longitude: 78.0421, entryFee: 50, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to March', tags: JSON.stringify(['monument', 'UNESCO', 'heritage']), isFeatured: true, ratingAvg: 4.9, reviewCount: 20 },
    { name: 'Machu Picchu', category: 'HISTORICAL', description: 'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-metre mountain ridge. Often referred to as the "Lost City of the Incas".', shortDescription: '15th-century Inca citadel in the Andes', address: 'Machu Picchu', city: 'Cusco', state: 'Cusco', country: 'Peru', latitude: -13.1631, longitude: -72.5450, entryFee: 45, estimatedDuration: '4-6 hours', bestTimeToVisit: 'May to October', tags: JSON.stringify(['ruins', 'mountain', 'UNESCO']), isFeatured: true, ratingAvg: 4.9, reviewCount: 9 },
    { name: 'Kyoto Fushimi Inari', category: 'RELIGIOUS', description: 'Famous for its thousands of vermilion torii gates, which straddle a network of trails behind its main buildings. The trails lead into the wooded forest of the sacred Mount Inari.', shortDescription: 'Iconic shrine with thousands of torii gates', address: 'Fushimi Ward', city: 'Kyoto', state: 'Kyoto Prefecture', country: 'Japan', latitude: 34.9671, longitude: 135.7727, entryFee: 0, estimatedDuration: '2-3 hours', bestTimeToVisit: 'October to November', tags: JSON.stringify(['shrine', 'culture', 'nature']), isFeatured: true, ratingAvg: 4.8, reviewCount: 12 },
    { name: 'Sydney Opera House', category: 'MONUMENT', description: 'A multi-venue performing arts centre in Sydney. Located on the foreshore of Sydney Harbour, it is widely regarded as one of the world\'s most famous and distinctive buildings.', shortDescription: 'Iconic performing arts centre in Sydney Harbour', address: 'Bennelong Point', city: 'Sydney', state: 'New South Wales', country: 'Australia', latitude: -33.8568, longitude: 151.2153, entryFee: 30, estimatedDuration: '1-2 hours', bestTimeToVisit: 'September to November', tags: JSON.stringify(['architecture', 'harbor', 'arts']), isFeatured: true, ratingAvg: 4.7, reviewCount: 15 },
    { name: 'Santorini Caldera', category: 'NATURE', description: 'A large, mostly submerged caldera, located in the southern Aegean Sea. Known for its stunning white-washed cliffside villages with blue domes overlooking the sea.', shortDescription: 'Stunning white-washed villages on volcanic cliffs', address: 'Oia', city: 'Santorini', state: 'South Aegean', country: 'Greece', latitude: 36.4618, longitude: 25.3753, entryFee: 0, estimatedDuration: '1-2 days', bestTimeToVisit: 'June to September', tags: JSON.stringify(['island', 'views', 'sunset']), isFeatured: true, ratingAvg: 4.9, reviewCount: 18 },
    { name: 'Grand Canyon', category: 'NATURE', description: 'A steep-sided canyon carved by the Colorado River in Arizona, United States. The canyon is known for its visually overwhelming size and its intricate and colorful landscape.', shortDescription: 'Massive canyon carved by the Colorado River', address: 'Grand Canyon Village', city: 'Grand Canyon', state: 'Arizona', country: 'United States', latitude: 36.0544, longitude: -112.1401, entryFee: 35, estimatedDuration: '1-2 days', bestTimeToVisit: 'March to May', tags: JSON.stringify(['canyon', 'nature', 'views']), isFeatured: true, ratingAvg: 4.8, reviewCount: 22 },
    { name: 'Pyramids of Giza', category: 'HISTORICAL', description: 'The Giza pyramid complex includes the Great Pyramid of Giza, the Pyramid of Khafre, and the Pyramid of Menkaure, along with their associated pyramid complexes and the Great Sphinx of Giza.', shortDescription: 'Ancient Egyptian pyramid complex', address: 'Al Haram', city: 'Giza', state: 'Giza Governorate', country: 'Egypt', latitude: 29.9792, longitude: 31.1342, entryFee: 20, estimatedDuration: '3-4 hours', bestTimeToVisit: 'October to April', tags: JSON.stringify(['history', 'desert', 'monument']), isFeatured: true, ratingAvg: 4.6, reviewCount: 11 },
  ];

  const places = await Promise.all(placesData.map(p => prisma.place.create({ data: p })));
  console.log(`✅ ${places.length} places created`);

  // Place Images
  const imageMap: Record<string, string[]> = {
    'Hawa Mahal': ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'],
    'Amber Fort': ['https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80'],
    'Calangute Beach': ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'],
    'India Gate': ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'],
    'Gateway of India': ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80'],
    'Victoria Memorial': ['https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80'],
    'Solang Valley': ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
    'City Palace Udaipur': ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'],
    'Dashashwamedh Ghat': ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80'],
    'Nahargarh Fort': ['https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80'],
    'Basilica of Bom Jesus': ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'],
    'Qutub Minar': ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'],
    'Juhu Beach': ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80'],
    'Rohtang Pass': ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
    'Howrah Bridge': ['https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80'],
    'Radhanagar Beach': ['https://images.unsplash.com/photo-1589417937452-9c3f91040ea5?w=800&q=80'],
    'Victoria Peak': ['https://images.unsplash.com/photo-1543328516-724fb2fbc446?w=800&q=80'],
    'Gobi Desert': ['https://images.unsplash.com/photo-1548689816-c399f954f3dd?w=800&q=80'],
    'Eiffel Tower': ['https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&q=80'],
    'Big Ben': ['https://images.unsplash.com/photo-1513635269975-5969336cd79b?w=800&q=80'],
    'Colosseum': ['https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80'],
    'Statue of Liberty': ['https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800&q=80'],
    'Burj Khalifa': ['https://images.unsplash.com/photo-1512453979436-5a536f111815?w=800&q=80'],
    'Taj Mahal': ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'],
    'Machu Picchu': ['https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80'],
    'Kyoto Fushimi Inari': ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'],
    'Sydney Opera House': ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80'],
    'Santorini Caldera': ['https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'],
    'Grand Canyon': ['https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&q=80'],
    'Pyramids of Giza': ['https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?w=800&q=80'],
  };

  for (const place of places) {
    const urls = imageMap[place.name] || [];
    for (let i = 0; i < urls.length; i++) {
      await prisma.placeImage.create({ data: { placeId: place.id, imageUrl: urls[i], order: i } });
    }
  }
  console.log('✅ Place images created');

  // Properties
  const propsData = [
    { ownerId: owner.id, title: 'Heritage Haveli Homestay', description: 'Experience authentic Rajasthani hospitality in this beautifully restored 200-year-old haveli. Features traditional architecture, courtyard dining, and rooftop views of the Pink City. Walking distance to Hawa Mahal and City Palace.', propertyType: 'HOMESTAY', address: 'Near Hawa Mahal, Pink City', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9225, longitude: 75.8270, pricePerNight: 2500, maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1, houseRules: 'No smoking indoors. Quiet hours after 10 PM.', verificationStatus: 'APPROVED', ratingAvg: 4.6, reviewCount: 2 },
    { ownerId: owner.id, title: 'Beachside Goa Villa', description: 'A stunning 3-bedroom villa just 200 meters from Calangute Beach. Features a private pool, modern kitchen, and spacious living area. Perfect for families and groups looking for a premium beach vacation.', propertyType: 'VILLA', address: 'Near Calangute Beach', city: 'Goa', state: 'Goa', latitude: 15.5440, longitude: 73.7555, pricePerNight: 8000, maxGuests: 8, bedrooms: 3, beds: 4, bathrooms: 3, houseRules: 'No parties. Pool hours 7 AM - 10 PM.', verificationStatus: 'APPROVED', ratingAvg: 4.4, reviewCount: 1 },
    { ownerId: owner.id, title: 'Cozy Mountain Cottage', description: 'A charming wooden cottage nestled in the pine forests of Manali. Wake up to breathtaking mountain views, enjoy bonfire nights, and explore nearby trails. Ideal for couples and nature lovers.', propertyType: 'VACATION_HOME', address: 'Old Manali Road', city: 'Manali', state: 'Himachal Pradesh', latitude: 32.2432, longitude: 77.1892, pricePerNight: 3500, maxGuests: 4, bedrooms: 2, beds: 2, bathrooms: 1, houseRules: 'No loud music after 9 PM.', verificationStatus: 'APPROVED', ratingAvg: 4.7, reviewCount: 1 },
    { ownerId: owner.id, title: 'Lake View Guest House', description: 'A charming guest house overlooking Lake Pichola in Udaipur. Traditional Rajasthani decor with modern amenities. Rooftop restaurant with panoramic lake and palace views.', propertyType: 'GUEST_HOUSE', address: 'Lal Ghat, Old City', city: 'Udaipur', state: 'Rajasthan', latitude: 24.5760, longitude: 73.6830, pricePerNight: 1800, maxGuests: 3, bedrooms: 1, beds: 1, bathrooms: 1, verificationStatus: 'APPROVED', ratingAvg: 4.5, reviewCount: 1 },
    { ownerId: owner.id, title: 'Budget Backpacker Hostel', description: 'Clean, social, and affordable hostel in the heart of Old Delhi. Dorm beds and private rooms available. Common kitchen, rooftop terrace, and walking tours organized daily.', propertyType: 'HOSTEL', address: 'Paharganj, Near New Delhi Station', city: 'Delhi', state: 'Delhi', latitude: 28.6428, longitude: 77.2132, pricePerNight: 500, maxGuests: 2, bedrooms: 1, beds: 2, bathrooms: 1, verificationStatus: 'PENDING', ratingAvg: 0, reviewCount: 0 },
  ];

  const properties = await Promise.all(propsData.map(p => prisma.property.create({ data: p })));
  console.log(`✅ ${properties.length} properties created`);

  // Property Images
  const propImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  ];
  for (let i = 0; i < properties.length; i++) {
    await prisma.propertyImage.create({ data: { propertyId: properties[i].id, imageUrl: propImages[i], order: 0 } });
  }

  // Property Amenities
  for (const prop of properties.slice(0, 4)) {
    const selected = amenities.slice(0, 5 + Math.floor(Math.random() * 5));
    for (const am of selected) {
      await prisma.propertyAmenity.create({ data: { propertyId: prop.id, amenityId: am.id } }).catch(() => {});
    }
  }
  console.log('✅ Property images & amenities created');

  // Reviews
  const reviewsData = [
    { userId: tourist.id, placeId: places[0].id, rating: 5, reviewText: 'Absolutely stunning architecture! The pink sandstone glows beautifully in the morning light. A must-visit in Jaipur.' },
    { userId: admin.id, placeId: places[0].id, rating: 4, reviewText: 'Beautiful building but can get very crowded. Go early morning for the best experience and photos.' },
    { userId: owner.id, placeId: places[0].id, rating: 5, reviewText: 'Iconic landmark of Jaipur. The intricate honeycomb design is remarkable. Best viewed from across the street.' },
    { userId: tourist.id, placeId: places[1].id, rating: 5, reviewText: 'The Sheesh Mahal inside is breathtaking. The fort complex is huge and needs at least 3 hours to explore properly.' },
    { userId: admin.id, placeId: places[1].id, rating: 4, reviewText: 'Great fort with amazing views of Maota Lake. The light and sound show in the evening is worth attending.' },
    { userId: tourist.id, placeId: places[2].id, rating: 4, reviewText: 'Great beach for water sports! The shacks serve amazing seafood. Gets crowded on weekends though.' },
    { userId: admin.id, placeId: places[2].id, rating: 4, reviewText: 'Beautiful sunset views. Plenty of activities available. The beach could be cleaner in peak season.' },
    { userId: tourist.id, placeId: places[3].id, rating: 5, reviewText: 'The illumination at night is spectacular. Great place for an evening walk with family.' },
    { userId: admin.id, placeId: places[3].id, rating: 4, reviewText: 'Iconic monument, especially beautiful at sunset. The surrounding lawns are perfect for a picnic.' },
    { userId: tourist.id, propertyId: properties[0].id, rating: 5, reviewText: 'Amazing heritage stay! The haveli is beautiful and the hosts are incredibly warm and welcoming.' },
    { userId: admin.id, propertyId: properties[0].id, rating: 4, reviewText: 'Great location and authentic experience. The rooftop dinner was a highlight of our trip.' },
    { userId: tourist.id, propertyId: properties[1].id, rating: 4, reviewText: 'Lovely villa with a great pool. Close to the beach and restaurants. Will definitely come back!' },
    { userId: tourist.id, propertyId: properties[2].id, rating: 5, reviewText: 'The mountain views are incredible. So peaceful and quiet. The bonfire under the stars was magical.' },
    { userId: tourist.id, propertyId: properties[3].id, rating: 5, reviewText: 'Waking up to lake views was a dream. The rooftop restaurant serves the best dal baati churma!' },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({ data: { ...r, isApproved: true, photos: '[]' } }).catch(() => {});
  }
  console.log('✅ Reviews created');
  console.log('🎉 Seeding complete!');
  console.log('\n📋 Login credentials:');
  console.log('  Admin:    admin@letsvisit.in / password123');
  console.log('  Owner:    rajesh@example.com / password123');
  console.log('  Tourist:  priya@example.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
