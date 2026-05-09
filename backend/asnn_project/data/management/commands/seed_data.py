from django.core.management.base import BaseCommand
from django.utils.text import slugify
from data.models import Area, Category, DataEntry

AREAS = [
    ("Thamel",                      "central",     27.7154, 85.3123, "The bustling tourist hub of Kathmandu."),
    ("Durbar Marg",                  "central",     27.7108, 85.3188, "Kathmandu's premier commercial avenue."),
    ("New Road",                     "basantapur",  27.7048, 85.3130, "Historic commercial district near Basantapur."),
    ("Basantapur Durbar Square",     "basantapur",  27.7046, 85.3072, "UNESCO World Heritage Site, heart of old Kathmandu."),
    ("Patan Durbar Square",          "patan",       27.6726, 85.3249, "UNESCO World Heritage Site in Lalitpur."),
    ("Lalitpur Core (Mangal Bazaar)","patan",       27.6714, 85.3240, "Central Patan market and heritage area."),
    ("Bhaktapur Durbar Square",      "bhaktapur",   27.6714, 85.4298, "UNESCO World Heritage medieval city."),
    ("Suryabinayak",                 "bhaktapur",   27.6683, 85.4086, "Eastern gateway area of Bhaktapur district."),
    ("Baneshwor",                    "eastern",     27.6939, 85.3399, "Major commercial hub in eastern Kathmandu."),
    ("Koteshwor",                    "eastern",     27.6849, 85.3555, "Eastern Kathmandu junction and residential area."),
    ("Kalanki",                      "western",     27.6944, 85.2805, "Western Kathmandu ring-road junction."),
    ("Swayambhu",                    "western",     27.7148, 85.2902, "Sacred Buddhist hill, western Kathmandu."),
    ("Chabahil",                     "northern",    27.7237, 85.3471, "Northern residential area near Pashupatinath."),
    ("Pashupatinath",                "northern",    27.7100, 85.3487, "Sacred Hindu temple complex on the Bagmati."),
    ("Balaju",                       "northern",    27.7324, 85.3003, "Northern industrial and residential quarter."),
    ("Kirtipur",                     "western",     27.6777, 85.2793, "Ancient hilltop town on the valley's edge."),
    ("Gongabu",                      "northern",    27.7343, 85.3135, "Northern Kathmandu bus park area."),
    ("Jawalakhel",                   "patan",       27.6824, 85.3156, "Southern Patan junction near the zoo."),
    ("Boudhanath",                   "northern",    27.7215, 85.3620, "World's largest Buddhist stupa."),
    ("Maharajgunj",                  "northern",    27.7316, 85.3228, "Upscale residential and embassy area."),
]

CATEGORIES = [
    ("Street Lights",      "street-lights",      "💡", "Number of functional public street lights."),
    ("Bars & Nightclubs",  "bars-nightclubs",     "🍺", "Licensed bars, pubs, and nightclubs."),
    ("Schools",            "schools",             "🏫", "Government and private schools combined."),
    ("Hospitals & Clinics","hospitals-clinics",   "🏥", "All registered medical facilities."),
    ("Temples & Shrines",  "temples-shrines",     "🛕", "Hindu and Buddhist temples and shrines."),
    ("Restaurants",        "restaurants",         "🍽️", "Registered restaurant establishments."),
    ("Convenience Stores", "convenience-stores",  "🏪", "Kiranas, supermarkets, and small shops."),
    ("Police Checkpoints", "police-checkpoints",  "👮", "Active police posts and checkpoints."),
    ("Water Taps (Public)","water-taps",          "🚰", "Public water supply taps and dhunges."),
    ("Parking Zones",      "parking-zones",       "🅿️", "Official public parking areas."),
    ("ATMs",               "atms",                "🏧", "Active ATM machines across all banks."),
    ("Internet Cafes",     "internet-cafes",      "💻", "Registered cyber cafes and co-working spots."),
]

ENTRIES = [
    ("Thamel", "Street Lights", 847, "Thamel has extensive street lighting along its major lanes, though narrower alleys can be unlit after midnight."),
    ("Thamel", "Bars & Nightclubs", 134, "Thamel holds the highest concentration of licensed drinking establishments in Nepal, from rooftop bars to underground clubs."),
    ("Thamel", "Restaurants", 312, "From local dal bhat to international cuisine — Thamel's restaurant density is among the highest in South Asia per square km."),
    ("Thamel", "ATMs", 48, "Almost every major Nepali and international bank has at least one ATM in Thamel."),
    ("Thamel", "Schools", 12, "Despite being primarily commercial, 12 schools operate in the greater Thamel ward area."),
    ("Thamel", "Hospitals & Clinics", 9, "9 private clinics and nursing homes operate within Thamel's commercial zone."),
    ("Basantapur Durbar Square", "Temples & Shrines", 55, "The Basantapur Durbar Square complex houses 55 individually catalogued temples, shrines, and deity platforms."),
    ("Basantapur Durbar Square", "Street Lights", 92, "Heritage lighting installed by KMC with ornamental fixtures along the Durbar Square perimeter."),
    ("Patan Durbar Square", "Temples & Shrines", 136, "Patan hosts the highest density of temples per square kilometer in the Kathmandu Valley, per 2021 UNESCO survey."),
    ("Patan Durbar Square", "Restaurants", 67, "Rooftop restaurants overlooking the square have multiplied since 2016 reconstruction."),
    ("Bhaktapur Durbar Square", "Temples & Shrines", 172, "Bhaktapur preserves the most intact medieval temple complex in Nepal with 172 catalogued structures."),
    ("Bhaktapur Durbar Square", "Bars & Nightclubs", 3, "Bhaktapur has very strict regulations; only 3 licensed premises exist near the core heritage zone."),
    ("Baneshwor", "ATMs", 62, "Baneshwor hosts the highest ATM count outside of Thamel due to banking sector concentration."),
    ("Baneshwor", "Hospitals & Clinics", 28, "Including Bir Hospital outreach, multiple private hospitals and dozens of polyclinics."),
    ("Baneshwor", "Street Lights", 1204, "One of the best-lit areas due to road widening projects along Baneshwor Chowk."),
    ("New Road", "Convenience Stores", 489, "New Road and its surrounding Indrachowk area is famous for its dense market — 489 registered shops."),
    ("New Road", "ATMs", 34, "High ATM density due to proximity to major banks' head offices."),
    ("Pashupatinath", "Temples & Shrines", 518, "The entire Pashupatinath complex and surrounding ghats contain 518 temples, lingams, and shrines."),
    ("Pashupatinath", "Police Checkpoints", 14, "Security is high; 14 checkpoints operate during major festivals like Shivaratri."),
    ("Boudhanath", "Temples & Shrines", 48, "The Boudha stupa is surrounded by 48 smaller gompas and monasteries in the immediate area."),
    ("Boudhanath", "Restaurants", 89, "Tibetan restaurants and international cafes circle the entire stupa perimeter."),
    ("Chabahil", "Schools", 23, "Chabahil and surrounding ward areas contain 23 registered schools, both public and private."),
    ("Swayambhu", "Temples & Shrines", 21, "The Swayambhunath hill complex has 21 distinct shrines and temples across its stairway and summit."),
    ("Lalitpur Core (Mangal Bazaar)", "Street Lights", 634, "Lalitpur Metropolitan City completed a LED streetlight project covering 634 points in 2023."),
    ("Lalitpur Core (Mangal Bazaar)", "Convenience Stores", 201, "The Mangal Bazaar–Kumaripati corridor holds 201 registered shops and kiranas."),
    ("Kirtipur", "Temples & Shrines", 34, "The ancient hilltop town of Kirtipur has 34 temples concentrated in its medieval core."),
    ("Kirtipur", "Schools", 9, "Kirtipur municipality maintains 9 schools including a Tribhuvan University extension campus."),
    ("Gongabu", "Parking Zones", 7, "Gongabu's New Bus Park area has 7 designated parking zones for inter-city coaches."),
    ("Maharajgunj", "Internet Cafes", 14, "Despite being primarily residential and embassy-heavy, Maharajgunj has 14 registered cyber cafes."),
    ("Kalanki", "Police Checkpoints", 8, "Kalanki junction is one of the most monitored exits from the valley — 8 active checkpoints."),
    ("Balaju", "Water Taps (Public)", 19, "Balaju's industrial quarter retains 19 traditional public water taps (dhunges) still in service."),
    ("Jawalakhel", "Bars & Nightclubs", 18, "The Jawalakhel–Sanepa corridor in Patan has 18 licensed bars, popular with expats."),
    ("Jawalakhel", "Hospitals & Clinics", 11, "Includes Patan Hospital and surrounding specialist clinics."),
    ("Koteshwor", "Street Lights", 980, "Koteshwor's ring-road expansion brought 980 new LED streetlights installed between 2021–2023."),
]


class Command(BaseCommand):
    help = 'Seed the database with Kathmandu Valley data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding areas...')
        area_map = {}
        for name, zone, lat, lng, desc in AREAS:
            obj, _ = Area.objects.get_or_create(
                slug=slugify(name),
                defaults=dict(name=name, zone=zone, latitude=lat, longitude=lng, description=desc),
            )
            area_map[name] = obj

        self.stdout.write('Seeding categories...')
        cat_map = {}
        for name, slug, icon, desc in CATEGORIES:
            obj, _ = Category.objects.get_or_create(
                slug=slug,
                defaults=dict(name=name, icon=icon, description=desc),
            )
            cat_map[name] = obj

        self.stdout.write('Seeding data entries...')
        count = 0
        for area_name, cat_name, number, desc in ENTRIES:
            area = area_map.get(area_name)
            cat = cat_map.get(cat_name)
            if area and cat:
                DataEntry.objects.get_or_create(
                    area=area, category=cat,
                    defaults=dict(number=number, description=desc),
                )
                count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Done! {len(area_map)} areas, {len(cat_map)} categories, {count} entries.'
        ))
