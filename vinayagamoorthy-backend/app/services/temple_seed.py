"""
Seed data for the Temples & Pujas module. Descriptions are written fresh for
this app rather than copied from any external source. This covers the full
set of 9 Navagraha (nine-planet) temples in Tamil Nadu — each one maps
directly to a planet, so the /temples/for-my-doshas endpoint can recommend
one based on a person's actual dosha report — plus a few major temples.

Admins can add more through the /temples POST endpoint; this seed only runs
once (skipped if a temple with the same name_en already exists).
"""
from app.models.temple import TempleIn, Puja

SEED_TEMPLES: list[TempleIn] = [
    TempleIn(
        name_ta="சூரியனார் கோவில்", name_en="Suryanar Kovil",
        deity="சூரியன் (சூர்யநாராயணர்)", place="சூரியனார்கோவில், கும்பகோணம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Sun", associated_doshas=[],
        description="நவகிரக தலங்களில் ஒன்று. சூரிய பகவானுக்காக பிரத்யேகமாக அமைந்த "
                     "இந்த கோவில் சூரியனுடன் தொடர்புடைய குறைபாடுகளுக்கு பரிகாரம் "
                     "தேடும் பக்தர்களால் விரும்பப்படுகிறது.",
        special_note="ஒளி, உயிர், ஆற்றல் ஆகியவற்றின் அடையாளமாக சூரிய வழிபாடு.",
        visiting_hours="6:00 AM - 12:30 PM, 4:00 - 8:00 PM",
        pujas=[Puja(name="சூரிய நமஸ்காரம்", description="காலை நேரத்தில் சூரிய பகவானை வழிபடும் முறை",
                    recommended_day="ஞாயிற்றுக்கிழமை")],
    ),
    TempleIn(
        name_ta="திங்களூர் (கைலாசநாதர் கோவில்)", name_en="Thingalur Kailasanathar Temple",
        deity="சந்திரன் (கைலாசநாதர்)", place="திங்களூர், கும்பகோணம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Moon", associated_doshas=[],
        description="நவகிரக தலங்களில் சந்திர பகவானுக்கு உரிய தலம். மன அமைதி, "
                     "குடும்ப நல்வாழ்வு தொடர்பான பிரார்த்தனைகளுக்கு பக்தர்கள் "
                     "இங்கு வருகை தருகின்றனர்.",
        special_note="அமைதி, மன ஒருமைப்பாடு மற்றும் சந்திர வழிபாட்டின் பாரம்பரியத் தலம்.",
        visiting_hours="7:00 AM - 8:00 PM",
        pujas=[Puja(name="சந்திர பூஜை", description="மன அமைதிக்காக செய்யப்படும் விசேஷ பூஜை",
                    recommended_day="திங்கட்கிழமை")],
    ),
    TempleIn(
        name_ta="வைத்தீஸ்வரன் கோவில்", name_en="Vaitheeswaran Koil",
        deity="செவ்வாய் (வைத்தியநாதர்)", place="வைத்தீஸ்வரன் கோவில், மயிலாடுதுறை மாவட்டம்",
        state="தமிழ்நாடு", associated_planet="Mars", associated_doshas=["Kuja Dosham"],
        description="செவ்வாய் தோஷ நிவாரணத்திற்காக பரவலாக அறியப்பட்ட தலம். "
                     "உடல்நல மற்றும் திருமண தடைகள் தொடர்பான பரிகாரங்களை "
                     "நாடி பக்தர்கள் அதிக அளவில் வருகை தருகின்றனர்.",
        special_note="வைத்தியநாதரின் அருள் மற்றும் செவ்வாய் பகவான் வழிபாட்டுடன் தொடர்புடைய புனிதத் தலம்.",
        visiting_hours="6:00 AM - 1:00 PM, 4:00 - 9:00 PM",
        pujas=[Puja(name="அங்காரக சாந்தி பூஜை", description="செவ்வாய் தோஷ நிவாரணத்திற்கான பூஜை",
                    recommended_day="செவ்வாய்க்கிழமை")],
    ),
    TempleIn(
        name_ta="திருவெண்காடு", name_en="Thiruvenkadu",
        deity="புதன் (ஸ்வேதாரண்யேஸ்வரர்)", place="திருவெண்காடு, சிதம்பரம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Mercury", associated_doshas=[],
        description="நவகிரக தலங்களில் புதன் பகவானுக்கு உரிய தலம். கல்வி, தொழில் "
                     "தொடர்பான முன்னேற்றத்திற்காக பக்தர்கள் வழிபடும் தலம்.",
        special_note="அறிவு, கல்வி மற்றும் தெளிவான சிந்தனையை நாடி பக்தர்கள் வழிபடும் பாரம்பரியத் தலம்.",
        visiting_hours="6:00 AM - 12:00 PM, 4:00 - 9:00 PM",
        pujas=[Puja(name="புத பூஜை", description="கல்வி மற்றும் தொழில் முன்னேற்றத்திற்கான பூஜை",
                    recommended_day="புதன்கிழமை")],
    ),
    TempleIn(
        name_ta="ஆலங்குடி", name_en="Alangudi",
        deity="குரு (அபத்சகாயேஸ்வரர்)", place="ஆலங்குடி, கும்பகோணம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Jupiter", associated_doshas=[],
        description="குரு பகவானுக்கு உரிய நவகிரக தலம். திருமணம், கல்வி, "
                     "ஞானம் தொடர்பான வளர்ச்சிக்காக வழிபடப்படும் தலம்.",
        special_note="குரு அருள், ஞானம் மற்றும் ஆன்மீக வழிகாட்டுதலை நினைவுபடுத்தும் தலம்.",
        visiting_hours="6:00 AM - 1:00 PM, 4:00 - 9:00 PM",
        pujas=[Puja(name="குரு பகவான் பூஜை", description="திருமண தடை நீக்கத்திற்கான பூஜை",
                    recommended_day="வியாழக்கிழமை")],
    ),
    TempleIn(
        name_ta="காஞ்சனூர்", name_en="Kanjanur",
        deity="சுக்கிரன் (அக்னீஸ்வரர்)", place="காஞ்சனூர், கும்பகோணம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Venus", associated_doshas=[],
        description="சுக்கிர பகவானுக்கு உரிய நவகிரக தலம். திருமண வாழ்க்கை, "
                     "செல்வம் தொடர்பான பிரார்த்தனைகளுக்காக வழிபடப்படும் தலம்.",
        special_note="சுக்ர வழிபாட்டுடன் இணைந்த அழகு, வளம் மற்றும் குடும்ப நல மரபு.",
        visiting_hours="7:00 AM - 12:30 PM, 4:00 - 8:00 PM",
        pujas=[Puja(name="சுக்ர பூஜை", description="திருமண மற்றும் செல்வ வளர்ச்சிக்கான பூஜை",
                    recommended_day="வெள்ளிக்கிழமை")],
    ),
    TempleIn(
        name_ta="திருநள்ளாறு", name_en="Thirunallar",
        deity="சனி (தர்பாரண்யேஸ்வரர் / சனீஸ்வரர்)", place="திருநள்ளாறு, கராய்க்கால் அருகில்",
        state="புதுச்சேரி", associated_planet="Saturn", associated_doshas=["Sade Sati"],
        description="சனி பகவானின் பாதிப்புகளிலிருந்து நிவாரணம் பெற மிகவும் "
                     "பிரசித்தி பெற்ற தலம். எழரை நாட்டு (சனி பெயர்ச்சி) காலத்தில் "
                     "பக்தர்கள் அதிக எண்ணிக்கையில் வருகை தருகின்றனர்.",
        special_note="நளனின் கதையுடன் தொடர்புடைய, சனி வழிபாட்டின் மிக முக்கியமான புனிதத் தலம்.",
        visiting_hours="6:00 AM - 1:00 PM, 4:00 - 9:00 PM",
        pujas=[Puja(name="சனி சாந்தி பூஜை", description="சனி எழரை நாட்டு நிவாரணத்திற்கான பூஜை",
                    recommended_day="சனிக்கிழமை")],
    ),
    TempleIn(
        name_ta="திருநாகேஸ்வரம்", name_en="Thirunageswaram",
        deity="ராகு (நாகேஸ்வரர்)", place="திருநாகேஸ்வரம், கும்பகோணம் அருகில்",
        state="தமிழ்நாடு", associated_planet="Rahu", associated_doshas=["Grahan Dosham"],
        description="ராகு பகவானுக்கு உரிய முழுமையான நவகிரக தலம். ராகு தோஷ "
                     "நிவாரணத்திற்காக பரவலாக அறியப்பட்ட தலம்.",
        special_note="ராகு கால வழிபாடு மற்றும் பால் அபிஷேகத்திற்குப் புகழ்பெற்ற நவக்கிரகத் தலம்.",
        visiting_hours="6:00 AM - 1:00 PM, 4:00 - 8:30 PM",
        pujas=[Puja(name="ராகு சாந்தி பூஜை", description="ராகு தோஷ நிவாரணத்திற்கான பூஜை",
                    recommended_day="புதன்கிழமை / வெள்ளிக்கிழமை")],
    ),
    TempleIn(
        name_ta="கீழப்பெரும்பள்ளம்", name_en="Keezhaperumpallam",
        deity="கேது (நாகநாதர்)", place="கீழப்பெரும்பள்ளம், சிர்காழி அருகில்",
        state="தமிழ்நாடு", associated_planet="Ketu", associated_doshas=["Grahan Dosham"],
        description="கேது பகவானுக்கு உரிய நவகிரக தலம். ஆன்மீக தடைகள், "
                     "மன குழப்பங்கள் நீங்குவதற்காக வழிபடப்படும் தலம்.",
        special_note="கேது பகவான் வழிபாட்டுடன் தொடர்புடைய அமைதியான ஆன்மீகத் தலம்.",
        visiting_hours="7:00 AM - 12:00 PM, 4:00 - 8:00 PM",
        pujas=[Puja(name="கேது சாந்தி பூஜை", description="கேது தோஷ நிவாரணத்திற்கான பூஜை",
                    recommended_day="செவ்வாய்க்கிழமை")],
    ),
    TempleIn(
        name_ta="மீனாட்சி அம்மன் கோவில்", name_en="Meenakshi Amman Temple",
        deity="மீனாட்சி அம்மன் & சுந்தரேஸ்வரர்", place="மதுரை",
        state="தமிழ்நாடு", associated_planet=None, associated_doshas=[],
        description="தமிழ்நாட்டின் மிகப் பழமையான மற்றும் மிகப் பெரிய கோவில் "
                     "வளாகங்களில் ஒன்று. அற்புதமான கோபுர கட்டிடக்கலைக்கு பெயர் "
                     "பெற்றது. பொது நல்வாழ்வுக்காக பரவலாக வழிபடப்படும் தலம்.",
        pujas=[Puja(name="சந்திரிகை பூஜை", description="மாலை நேர விசேஷ வழிபாடு")],
    ),
    TempleIn(
        name_ta="பழனி முருகன் கோவில்", name_en="Palani Murugan Temple",
        deity="முருகன் (தண்டாயுதபாணி)", place="பழனி",
        state="தமிழ்நாடு", associated_planet=None, associated_doshas=[],
        description="முருகனின் ஆறு படை வீடுகளில் ஒன்று. மலை உச்சியில் அமைந்துள்ள "
                     "இந்த தலம் தடை நீக்கம் மற்றும் ஆன்மீக முன்னேற்றத்திற்காக "
                     "விரும்பப்படுகிறது.",
        pujas=[Puja(name="அபிஷேகம்", description="பஞ்சாமிர்த அபிஷேக வழிபாடு")],
    ),
]


async def seed_temples_if_needed():
    from app.db.mongodb import temples_collection
    coll = temples_collection()
    for temple in SEED_TEMPLES:
        existing = await coll.find_one({"name_en": temple.name_en})
        if not existing:
            await coll.insert_one(temple.model_dump())
