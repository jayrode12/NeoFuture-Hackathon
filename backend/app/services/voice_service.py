"""
app/services/voice_service.py
─────────────────────────────
Field-by-field validation and normalization for the voice assistant.

Responsibilities
  • Normalize raw speech/text → clean stored value
  • Validate according to per-field rules
  • Return multilingual success / error messages
  • Determine the next field in the form flow
"""

from __future__ import annotations

import re
from typing import Optional

# ──────────────────────────────────────────────────────────────────
# Field order
# ──────────────────────────────────────────────────────────────────
REG_FIELD_ORDER  = ["name", "email", "phone", "aadhaarMasked", "state", "district", "workType"]
LOGIN_FIELD_ORDER = ["email"]   # password always manual


# ──────────────────────────────────────────────────────────────────
# Multilingual messages
# ──────────────────────────────────────────────────────────────────
_MSG: dict[str, dict[str, dict[str, str]]] = {
    "en": {
        "name":         {"ok": "Great! Name saved.",                          "err": "Please say your full name — at least 3 letters, no numbers."},
        "email":        {"ok": "Email saved.",                                "err": "That doesn't look like a valid email. Please say it again, e.g. name@example.com."},
        "phone":        {"ok": "Mobile number saved.",                        "err": "Please give a valid 10-digit Indian mobile number."},
        "aadhaarMasked":{"ok": "Aadhaar number saved.",                       "err": "Please give your 12-digit Aadhaar number. Say only the digits."},
        "state":        {"ok": "State saved.",                                "err": "I didn't catch a valid Indian state. Please say your state name clearly."},
        "district":     {"ok": "District saved.",                             "err": "District name cannot be empty. Please say your district."},
        "workType":     {"ok": "Work type saved.",                            "err": "Please say one of: vendor, driver, construction worker, delivery, or other."},
        "email_login":  {"ok": "Email entered.",                              "err": "Please say a valid email address."},
        "all_done":     {"ok": "All details collected! Please type your password below to finish.", "err": ""},
    },
    "hi": {
        "name":         {"ok": "बढ़िया! नाम सहेजा गया।",                      "err": "कृपया अपना पूरा नाम बताएं — कम से कम 3 अक्षर, केवल अक्षर।"},
        "email":        {"ok": "ईमेल सहेजा गया।",                             "err": "यह सही ईमेल नहीं लगता। कृपया फिर से बताएं, जैसे name@example.com."},
        "phone":        {"ok": "मोबाइल नंबर सहेजा गया।",                     "err": "कृपया सही 10 अंकों का मोबाइल नंबर बताएं।"},
        "aadhaarMasked":{"ok": "आधार नंबर सहेजा गया।",                        "err": "कृपया अपना 12 अंकों का आधार नंबर बताएं।"},
        "state":        {"ok": "राज्य सहेजा गया।",                            "err": "कृपया एक सही भारतीय राज्य का नाम बताएं।"},
        "district":     {"ok": "जिला सहेजा गया।",                             "err": "जिला नाम खाली नहीं हो सकता। कृपया अपना जिला बताएं।"},
        "workType":     {"ok": "काम का प्रकार सहेजा गया।",                   "err": "कृपया बताएं: विक्रेता, ड्राइवर, निर्माण मजदूर, डिलीवरी, या अन्य।"},
        "email_login":  {"ok": "ईमेल दर्ज हुआ।",                             "err": "कृपया एक सही ईमेल पता बताएं।"},
        "all_done":     {"ok": "सभी जानकारी एकत्र हो गई! कृपया नीचे पासवर्ड टाइप करें।", "err": ""},
    },
    "mr": {
        "name":         {"ok": "छान! नाव सेव्ह झाले।",                        "err": "कृपया तुमचे पूर्ण नाव सांगा — किमान 3 अक्षरे, फक्त अक्षरे।"},
        "email":        {"ok": "ईमेल सेव्ह झाला।",                            "err": "हे योग्य ईमेल नाही. कृपया पुन्हा सांगा, उदा. name@example.com."},
        "phone":        {"ok": "मोबाइल नंबर सेव्ह झाला।",                    "err": "कृपया 10 अंकी मोबाइल नंबर सांगा।"},
        "aadhaarMasked":{"ok": "आधार नंबर सेव्ह झाला।",                       "err": "कृपया 12 अंकी आधार नंबर सांगा।"},
        "state":        {"ok": "राज्य सेव्ह झाले।",                           "err": "कृपया वैध भारतीय राज्याचे नाव सांगा।"},
        "district":     {"ok": "जिल्हा सेव्ह झाला।",                          "err": "जिल्ह्याचे नाव रिकामे असू शकत नाही. कृपया सांगा."},
        "workType":     {"ok": "कामाचा प्रकार सेव्ह झाला।",                  "err": "कृपया सांगा: विक्रेता, चालक, बांधकाम कामगार, डिलीव्हरी, किंवा इतर।"},
        "email_login":  {"ok": "ईमेल नोंदवले.",                               "err": "कृपया योग्य ईमेल पत्ता सांगा."},
        "all_done":     {"ok": "सर्व माहिती गोळा झाली! कृपया खाली पासवर्ड टाइप करा.", "err": ""},
    },
}


def _msg(lang: str, field: str, ok: bool) -> str:
    bucket = _MSG.get(lang, _MSG["en"])
    key    = "ok" if ok else "err"
    return bucket.get(field, bucket.get("name", {}))[key]


# ──────────────────────────────────────────────────────────────────
# Lookup tables
# ──────────────────────────────────────────────────────────────────
_STATE_MAP: dict[str, str] = {
    # English (lower)
    "andhra pradesh": "Andhra Pradesh",   "ap": "Andhra Pradesh",
    "arunachal pradesh": "Arunachal Pradesh",
    "assam": "Assam",
    "bihar": "Bihar",
    "chhattisgarh": "Chhattisgarh",       "chattisgarh": "Chhattisgarh",
    "goa": "Goa",
    "gujarat": "Gujarat",
    "haryana": "Haryana",
    "himachal pradesh": "Himachal Pradesh", "hp": "Himachal Pradesh",
    "jharkhand": "Jharkhand",
    "karnataka": "Karnataka",
    "kerala": "Kerala",
    "madhya pradesh": "Madhya Pradesh",   "mp": "Madhya Pradesh",
    "maharashtra": "Maharashtra",         "maharastra": "Maharashtra",
    "manipur": "Manipur",
    "meghalaya": "Meghalaya",
    "mizoram": "Mizoram",
    "nagaland": "Nagaland",
    "odisha": "Odisha",                   "orissa": "Odisha",
    "punjab": "Punjab",
    "rajasthan": "Rajasthan",
    "sikkim": "Sikkim",
    "tamil nadu": "Tamil Nadu",           "tamilnadu": "Tamil Nadu",  "tn": "Tamil Nadu",
    "telangana": "Telangana",
    "tripura": "Tripura",
    "uttar pradesh": "Uttar Pradesh",     "up": "Uttar Pradesh",
    "uttarakhand": "Uttarakhand",         "uttaranchal": "Uttarakhand",
    "west bengal": "West Bengal",         "wb": "West Bengal",
    "delhi": "Delhi",                     "new delhi": "Delhi",
    # Hindi / Devanagari
    "महाराष्ट्र": "Maharashtra",
    "उत्तर प्रदेश": "Uttar Pradesh",
    "कर्नाटक": "Karnataka",
    "बिहार": "Bihar",
    "राजस्थान": "Rajasthan",
    "गुजरात": "Gujarat",
    "पंजाब": "Punjab",
    "हरियाणा": "Haryana",
    "दिल्ली": "Delhi",
    "तमिलनाडु": "Tamil Nadu",
    "केरल": "Kerala",
    "पश्चिम बंगाल": "West Bengal",
    "मध्य प्रदेश": "Madhya Pradesh",
    "आंध्र प्रदेश": "Andhra Pradesh",
    "तेलंगाना": "Telangana",
    "उत्तराखंड": "Uttarakhand",
    "असम": "Assam",
    "झारखंड": "Jharkhand",
    "छत्तीसगढ़": "Chhattisgarh",
    "ओडिशा": "Odisha",
    "गोवा": "Goa",
    "हिमाचल प्रदेश": "Himachal Pradesh",
}

_WORK_TYPE_MAP: dict[str, str] = {
    # English
    "vendor": "Street Vendor",              "street vendor": "Street Vendor",
    "hawker": "Street Vendor",              "shopkeeper": "Street Vendor",
    "driver": "Delivery Partner",           "delivery": "Delivery Partner",
    "delivery partner": "Delivery Partner", "courier": "Delivery Partner",
    "construction": "Construction Worker",  "construction worker": "Construction Worker",
    "mason": "Construction Worker",         "labor": "Construction Worker",
    "labour": "Construction Worker",        "worker": "Construction Worker",
    "domestic": "Domestic Help",            "domestic help": "Domestic Help",
    "housemaid": "Domestic Help",           "maid": "Domestic Help",
    "agriculture": "Agricultural Labour",   "farmer": "Agricultural Labour",
    "agricultural": "Agricultural Labour",  "agricultural labour": "Agricultural Labour",
    "farming": "Agricultural Labour",
    "other": "other",
    # Hindi
    "विक्रेता": "Street Vendor",            "रेहड़ी": "Street Vendor",
    "फेरीवाला": "Street Vendor",            "दुकानदार": "Street Vendor",
    "ड्राइवर": "Delivery Partner",          "डिलीवरी": "Delivery Partner",
    "चालक": "Delivery Partner",
    "निर्माण": "Construction Worker",        "मजदूर": "Construction Worker",
    "राजमिस्त्री": "Construction Worker",   "निर्माण मजदूर": "Construction Worker",
    "घरेलू": "Domestic Help",               "घरेलू काम": "Domestic Help",
    "कृषि": "Agricultural Labour",          "किसान": "Agricultural Labour",
    "खेती": "Agricultural Labour",
    "अन्य": "other",
    # Marathi
    "विक्रेते": "Street Vendor",            "फेरीवाले": "Street Vendor",
    "बांधकाम": "Construction Worker",       "बांधकाम कामगार": "Construction Worker",
    "डिलीव्हरी": "Delivery Partner",
    "घरकाम": "Domestic Help",
    "शेती": "Agricultural Labour",          "शेतकरी": "Agricultural Labour",
    "इतर": "other",
}

# Hindi / Marathi digit words → digit char
_DIGIT_WORDS: dict[str, str] = {
    # Hindi
    "शून्य": "0", "एक": "1", "दो": "2", "तीन": "3", "चार": "4",
    "पांच": "5", "छह": "6", "सात": "7", "आठ": "8", "नौ": "9",
    "जीरो": "0", "ज़ीरो": "0",
    # Marathi
    "दोन": "2", "पाच": "5", "सहा": "6", "नऊ": "9",
    # English words (fallback)
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
}


# ──────────────────────────────────────────────────────────────────
# Normalizers
# ──────────────────────────────────────────────────────────────────

def _digits_only(text: str) -> str:
    """Convert spoken number words → digits, then strip non-digit chars."""
    result = text.lower()
    # Replace word numbers
    for word, digit in sorted(_DIGIT_WORDS.items(), key=lambda x: -len(x[0])):
        result = result.replace(word, digit)
    return re.sub(r"\D", "", result)


def _normalize_name(raw: str) -> str:
    # Keep only letters (all Unicode letters + spaces), collapse runs
    cleaned = re.sub(r"[^\w\s]", " ", raw, flags=re.UNICODE)
    cleaned = re.sub(r"\d+", "", cleaned)
    return " ".join(cleaned.split()).title()


def _normalize_state(raw: str) -> Optional[str]:
    key = raw.strip().lower()
    if key in _STATE_MAP:
        return _STATE_MAP[key]
    # Try Devanagari key as-is (already lower doesn't change Devanagari)
    if raw.strip() in _STATE_MAP:
        return _STATE_MAP[raw.strip()]
    # Partial match on English
    for k, v in _STATE_MAP.items():
        if k in key or key in k:
            return v
    return None


def _normalize_work_type(raw: str) -> Optional[str]:
    key = raw.strip().lower()
    if key in _WORK_TYPE_MAP:
        return _WORK_TYPE_MAP[key]
    # Partial match
    for k, v in _WORK_TYPE_MAP.items():
        if k in key or key in k:
            return v
    return None


# ──────────────────────────────────────────────────────────────────
# Per-field validators → (valid: bool, normalized: str)
# ──────────────────────────────────────────────────────────────────

def _validate_name(raw: str) -> tuple[bool, str]:
    norm = _normalize_name(raw)
    # Must have at least 3 alphabetic characters total
    letters = re.sub(r"[^a-zA-Z\u0900-\u097F]", "", norm)
    if len(letters) >= 3:
        return True, norm
    return False, ""


def _validate_email(raw: str) -> tuple[bool, str]:
    norm = raw.strip().lower()
    pattern = r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
    if re.match(pattern, norm):
        return True, norm
    return False, ""


def _validate_phone(raw: str) -> tuple[bool, str]:
    digits = _digits_only(raw)
    # Accept leading 91 or +91
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    if len(digits) == 10 and digits[0] in "6789":
        return True, digits
    return False, ""


def _validate_aadhaar(raw: str) -> tuple[bool, str]:
    digits = _digits_only(raw)
    if len(digits) == 12:
        return True, digits
    return False, ""


def _validate_state(raw: str) -> tuple[bool, str]:
    norm = _normalize_state(raw)
    if norm:
        return True, norm
    return False, ""


def _validate_district(raw: str) -> tuple[bool, str]:
    norm = raw.strip().title()
    if len(norm) >= 2:
        return True, norm
    return False, ""


def _validate_work_type(raw: str) -> tuple[bool, str]:
    norm = _normalize_work_type(raw)
    if norm:
        return True, norm
    return False, ""


_VALIDATORS = {
    "name":          _validate_name,
    "email":         _validate_email,
    "phone":         _validate_phone,
    "aadhaarMasked": _validate_aadhaar,
    "state":         _validate_state,
    "district":      _validate_district,
    "workType":      _validate_work_type,
}


# ──────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────

def validate_register_step(field: str, raw_input: str, lang: str) -> dict:
    """
    Validate one registration form field.

    Returns a dict matching VoiceStepResponse schema.
    """
    validate_fn = _VALIDATORS.get(field)
    if not validate_fn:
        return {
            "mode": "registration", "language": lang,
            "field": field, "valid": False,
            "normalizedValue": "", "nextField": None,
            "message": f"Unknown field: {field}",
        }

    valid, normalized = validate_fn(raw_input)

    # Determine next field
    next_field: Optional[str] = None
    if valid:
        idx = REG_FIELD_ORDER.index(field) if field in REG_FIELD_ORDER else -1
        if idx >= 0 and idx + 1 < len(REG_FIELD_ORDER):
            next_field = REG_FIELD_ORDER[idx + 1]

    # Pick message key — special case for last field
    msg_key = field
    if valid and next_field is None:
        message = _MSG.get(lang, _MSG["en"]).get("all_done", {}).get("ok", "All done!")
    else:
        message = _msg(lang, msg_key, valid)

    return {
        "mode":            "registration",
        "language":        lang,
        "field":           field,
        "valid":           valid,
        "normalizedValue": normalized,
        "nextField":       next_field,
        "message":         message,
    }


def validate_login_step(field: str, raw_input: str, lang: str) -> dict:
    """
    Validate one login form field (currently only email).
    """
    if field == "email":
        valid, normalized = _validate_email(raw_input)
        msg_key = "email_login"
    else:
        valid, normalized, msg_key = False, "", "email_login"

    message = _msg(lang, msg_key, valid)

    idx = LOGIN_FIELD_ORDER.index(field) if field in LOGIN_FIELD_ORDER else -1
    next_field = LOGIN_FIELD_ORDER[idx + 1] if idx >= 0 and idx + 1 < len(LOGIN_FIELD_ORDER) else None

    return {
        "mode":            "login",
        "language":        lang,
        "field":           field,
        "valid":           valid,
        "normalizedValue": normalized,
        "nextField":       next_field,
        "message":         message,
    }
