"""Vedic astrology engine using pyswisseph.

Public HTTP endpoints under /api/astro:
  POST /chart      -> D1 birth chart (lagna, planets, houses)
  POST /panchang   -> tithi, nakshatra, yog, karan, sun/moon rise/set
  POST /dasha      -> current Vimshottari maha/antar dasha
  GET  /gochar     -> today's planetary positions

All computations use sidereal Lahiri ayanamsa (Vedic default).
"""
from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Optional

import swisseph as swe
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/astro")

# --- config ---
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)  # Vedic ayanamsa
SIDEREAL_FLAG = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

RASHIS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
]
NAK_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]  # cycle
DASHA_YEARS = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE,
}


# --- request models ---
class BirthIn(BaseModel):
    year: int = Field(ge=1900, le=2100)
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)
    hour: int = Field(ge=0, le=23, default=12)
    minute: int = Field(ge=0, le=59, default=0)
    tz_offset: float = 5.5  # IST default
    latitude: float = 28.6139  # New Delhi default
    longitude: float = 77.2090


class PanchangIn(BaseModel):
    year: Optional[int] = None
    month: Optional[int] = None
    day: Optional[int] = None
    tz_offset: float = 5.5
    latitude: float = 28.6139
    longitude: float = 77.2090


# --- helpers ---
def _julian(dt_utc: datetime) -> float:
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute / 60 + dt_utc.second / 3600)


def _local_to_utc(b: BirthIn) -> datetime:
    local = datetime(b.year, b.month, b.day, b.hour, b.minute, tzinfo=timezone.utc)
    return local - timedelta(hours=b.tz_offset)


def _sign_index(longitude_deg: float) -> int:
    return int(longitude_deg // 30) % 12


def _sign_name(longitude_deg: float) -> str:
    return RASHIS[_sign_index(longitude_deg)]


def _nak_index(moon_long: float) -> int:
    # each nakshatra spans 13.333... deg
    return int(moon_long // (360 / 27)) % 27


def _pada(moon_long: float) -> int:
    n_span = 360 / 27
    remainder = moon_long % n_span
    return int(remainder // (n_span / 4)) + 1


def _fmt_deg(lon: float) -> str:
    within = lon % 30
    d = int(within)
    m = int((within - d) * 60)
    return f"{d:02d}° {m:02d}'"


def _house_for_planet(planet_long: float, asc_long: float) -> int:
    diff = (planet_long - asc_long) % 360
    return int(diff // 30) + 1


# --- endpoints ---
@router.post("/chart")
def compute_chart(birth: BirthIn):
    utc_dt = _local_to_utc(birth)
    jd = _julian(utc_dt)

    # Ascendant
    houses, ascmc = swe.houses_ex(jd, birth.latitude, birth.longitude, b"P", swe.FLG_SIDEREAL)
    asc_long = ascmc[0] % 360
    asc_sign = _sign_name(asc_long)

    # Planets
    planets_out = []
    for name, code in PLANETS.items():
        val, _flg = swe.calc_ut(jd, code, SIDEREAL_FLAG)
        lon = val[0] % 360
        speed = val[3]
        planets_out.append({
            "name": name,
            "longitude": lon,
            "degree": _fmt_deg(lon),
            "sign": _sign_name(lon),
            "nakshatra": NAKSHATRAS[_nak_index(lon)],
            "pada": _pada(lon),
            "house": _house_for_planet(lon, asc_long),
            "retro": speed < 0 and name not in ("Sun", "Moon", "Rahu"),
        })
    # Ketu = Rahu + 180
    rahu = next(p for p in planets_out if p["name"] == "Rahu")
    ketu_lon = (rahu["longitude"] + 180) % 360
    planets_out.append({
        "name": "Ketu",
        "longitude": ketu_lon,
        "degree": _fmt_deg(ketu_lon),
        "sign": _sign_name(ketu_lon),
        "nakshatra": NAKSHATRAS[_nak_index(ketu_lon)],
        "pada": _pada(ketu_lon),
        "house": _house_for_planet(ketu_lon, asc_long),
        "retro": True,
    })

    # 12 houses (equal from asc)
    houses_out = []
    for i in range(12):
        cusp = (asc_long + i * 30) % 360
        houses_out.append({
            "house": i + 1,
            "sign": _sign_name(cusp),
            "cusp_deg": _fmt_deg(cusp),
        })

    moon = next(p for p in planets_out if p["name"] == "Moon")
    return {
        "ascendant": {"longitude": asc_long, "degree": _fmt_deg(asc_long), "sign": asc_sign},
        "moon_sign": moon["sign"],
        "moon_nakshatra": moon["nakshatra"],
        "planets": planets_out,
        "houses": houses_out,
    }


@router.post("/dasha")
def compute_dasha(birth: BirthIn):
    """Return current running Vimshottari dasha at all 5 levels
    (Maha → Antar → Pratyantar → Sookshma → Pran) plus full Maha list.

    Algorithm:
      - Starting maha lord & elapsed portion from Moon's nakshatra position
      - Each nested level's duration = parent_duration * (nested_lord_years / 120)
      - Within any level the order starts from that level's parent lord and cycles 9 lords
    """
    utc_dt = _local_to_utc(birth)
    jd = _julian(utc_dt)
    moon_val, _ = swe.calc_ut(jd, swe.MOON, SIDEREAL_FLAG)
    moon_lon = moon_val[0] % 360
    n_span = 360 / 27
    nak_idx = _nak_index(moon_lon)
    starting_lord = NAK_LORDS[nak_idx % 9]

    portion_elapsed = (moon_lon % n_span) / n_span  # 0..1 within current nakshatra
    md_years = DASHA_YEARS[starting_lord]
    md_start = utc_dt - timedelta(days=portion_elapsed * md_years * 365.25)
    now = datetime.now(timezone.utc)

    def _lord_order_from(start_lord: str):
        """Return a cycle of 9 lords starting from start_lord."""
        idx = NAK_LORDS.index(start_lord)
        return [NAK_LORDS[(idx + i) % 9] for i in range(9)]

    # ---- Walk maha dashas forward from birth to find the one covering `now` ----
    maha_list = []
    curr_start = md_start
    ord_idx = NAK_LORDS.index(starting_lord)
    # Build 12 mahas (>120y — enough for a full life)
    for i in range(12):
        lord = NAK_LORDS[(ord_idx + i) % 9]
        years = DASHA_YEARS[lord]
        curr_end = curr_start + timedelta(days=years * 365.25)
        maha_list.append({"lord": lord, "start": curr_start.isoformat(), "end": curr_end.isoformat()})
        curr_start = curr_end

    current_maha = next((m for m in maha_list if datetime.fromisoformat(m["start"]) <= now < datetime.fromisoformat(m["end"])), maha_list[0])

    def _find_current(parent_start_iso: str, parent_end_iso: str, parent_lord: str):
        """Within a parent period (Maha/Antar/Pratyantar/Sookshma) find the currently
        running child level. Child order cycles 9 lords starting from `parent_lord`.
        Child duration = parent_total_days * (child_lord_years / 120).
        """
        p_start = datetime.fromisoformat(parent_start_iso)
        p_end = datetime.fromisoformat(parent_end_iso)
        total_days = (p_end - p_start).total_seconds() / 86400
        c_start = p_start
        for lord in _lord_order_from(parent_lord):
            share = DASHA_YEARS[lord] / 120.0
            c_end = c_start + timedelta(days=total_days * share)
            if c_start <= now < c_end:
                return {"lord": lord, "start": c_start.isoformat(), "end": c_end.isoformat()}
            c_start = c_end
        # fallback
        return {"lord": parent_lord, "start": parent_start_iso, "end": parent_end_iso}

    antar = _find_current(current_maha["start"], current_maha["end"], current_maha["lord"])
    pratyantar = _find_current(antar["start"], antar["end"], antar["lord"])
    sookshma = _find_current(pratyantar["start"], pratyantar["end"], pratyantar["lord"])
    pran = _find_current(sookshma["start"], sookshma["end"], sookshma["lord"])

    return {
        "starting_maha_lord_at_birth": starting_lord,
        "birth_moon_nakshatra": NAKSHATRAS[nak_idx],
        "current": {
            "maha": current_maha,
            "antar": antar,
            "pratyantar": pratyantar,
            "sookshma": sookshma,
            "pran": pran,
        },
        "maha_list": maha_list,
        # Legacy fields (kept for backward compat with older UI):
        "maha": current_maha,
        "antar": antar,
    }


TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya",
]


@router.post("/panchang")
def compute_panchang(inp: PanchangIn):
    now = datetime.now(timezone.utc)
    year = inp.year or now.year
    month = inp.month or now.month
    day = inp.day or now.day

    # noon local as reference
    local_noon = datetime(year, month, day, 12, 0) - timedelta(hours=inp.tz_offset)
    jd = _julian(local_noon)

    sun, _ = swe.calc_ut(jd, swe.SUN, SIDEREAL_FLAG)
    moon, _ = swe.calc_ut(jd, swe.MOON, SIDEREAL_FLAG)
    sun_lon = sun[0] % 360
    moon_lon = moon[0] % 360

    # Tithi = (moon - sun) / 12
    diff = (moon_lon - sun_lon) % 360
    tithi_idx = int(diff // 12)  # 0..29
    tithi_number = tithi_idx % 15 + 1
    paksha = "Shukla" if tithi_idx < 15 else "Krishna"
    tithi_name = TITHI_NAMES[min(tithi_idx % 15, 14)] if tithi_number != 15 else ("Purnima" if paksha == "Shukla" else "Amavasya")

    nakshatra = NAKSHATRAS[_nak_index(moon_lon)]

    # Yoga = (sun + moon) / 13°20'
    yoga_names = ["Vishkumbha","Preeti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shoola","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"]
    yoga_idx = int(((sun_lon + moon_lon) % 360) // (360 / 27))
    yog = yoga_names[yoga_idx % 27]

    # Karan (half of tithi) — 11 karans
    karans = ["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti","Shakuni","Chatushpada","Naga","Kimstughna"]
    karan_idx = int(diff // 6) % 11
    karan = karans[karan_idx]

    # sunrise/sunset
    tzoff = inp.tz_offset

    def _rise_set(planet_code):
        # start JD at local midnight → convert to UT
        jd0 = swe.julday(year, month, day, 0) - (tzoff / 24)
        try:
            ret_r, t_rise = swe.rise_trans(jd0, planet_code, swe.CALC_RISE, (inp.longitude, inp.latitude, 0), 0, 0)
            ret_s, t_set = swe.rise_trans(jd0, planet_code, swe.CALC_SET, (inp.longitude, inp.latitude, 0), 0, 0)

            def _fmt(res_tuple):
                if not res_tuple:
                    return "—"
                jd_val = res_tuple[0] if isinstance(res_tuple, (tuple, list)) else res_tuple
                if not jd_val:
                    return "—"
                # convert JD UT back to local hours
                _yr, _mo, _dy, hour_ut = swe.revjul(jd_val)
                local_h = (hour_ut + tzoff) % 24
                h = int(local_h)
                m = int((local_h - h) * 60)
                return f"{h:02d}:{m:02d}"

            return _fmt(t_rise), _fmt(t_set)
        except Exception:
            return "—", "—"

    sunrise, sunset = _rise_set(swe.SUN)
    moonrise, moonset = _rise_set(swe.MOON)

    return {
        "date": f"{year:04d}-{month:02d}-{day:02d}",
        "paksha": paksha,
        "tithi": f"{tithi_name} ({tithi_number})",
        "nakshatra": nakshatra,
        "yog": yog,
        "karan": karan,
        "sunrise": sunrise,
        "sunset": sunset,
        "moonrise": moonrise,
        "moonset": moonset,
    }


@router.get("/gochar")
def compute_gochar():
    """Current planetary positions (sidereal)."""
    now = datetime.now(timezone.utc)
    jd = _julian(now)
    out = []
    for name, code in PLANETS.items():
        val, _ = swe.calc_ut(jd, code, SIDEREAL_FLAG)
        lon = val[0] % 360
        out.append({
            "name": name,
            "sign": _sign_name(lon),
            "degree": _fmt_deg(lon),
            "nakshatra": NAKSHATRAS[_nak_index(lon)],
            "retro": val[3] < 0 and name not in ("Sun", "Moon", "Rahu"),
        })
    return {"as_of": now.isoformat(), "planets": out}
