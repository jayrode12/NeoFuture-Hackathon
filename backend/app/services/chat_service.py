"""
app/services/chat_service.py — Core assistant logic.

Responsibilities:
  • Route requests to the right mode handler
  • Call the model layer (predict, explain, match_schemes)
  • Build multilingual natural-language replies
  • Return a structured ChatResponse-compatible dict
"""

from __future__ import annotations

import sys
import os
from typing import Optional

# ── Resolve model directory so its modules are importable ─────────
_APP_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # .../app/
_BACKEND   = os.path.dirname(_APP_DIR)                                      # .../backend/backend/
_MODEL_DIR = os.path.join(_BACKEND, "model")

if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

from predict      import predict_pipeline
from explain      import explain_prediction
from scheme_matcher import match_schemes as raw_match_schemes

from app.schemas.chat import ChatRequest, Mode, Language


# ──────────────────────────────────────────────────────────────────
# Multilingual reply templates
# ──────────────────────────────────────────────────────────────────

# Keys present here must cover all values of Language enum
_TEMPLATES: dict[str, dict[str, str]] = {
    "en": {
        # scheme_discovery
        "sd_found": (
            "Based on your profile, your IWTS Trust Score is {score}/100. "
            "You qualify for {n} government scheme(s). "
            "Here are the best matches:"
        ),
        "sd_none": (
            "Your IWTS score of {score} is below the minimum required for current schemes. "
            "To improve your score, try increasing UPI transactions, adding peer attestations, "
            "and maintaining a high customer rating."
        ),
        "sd_missing": (
            "To find matching schemes, I need your work profile. "
            "Please fill in UPI transactions, monthly amount, work duration, "
            "location consistency, peer attestations, customer rating, and Aadhaar status."
        ),
        # profile_score
        "ps_result": (
            "Your IWTS Trust Score is {score}/100. "
            "The most impactful factors in your score are: {top_factors}. "
            "Improving these areas will unlock higher-value government schemes."
        ),
        "ps_missing": (
            "To explain your trust score, please provide your work profile details: "
            "UPI transactions, monthly amount, work duration, and other fields."
        ),
        # guidance
        "guide_score": (
            "Your IWTS (Invisible Worker Trust Score) is calculated from 7 factors: "
            "UPI transaction count (25 pts), average monthly UPI amount (20 pts), "
            "location consistency (15 pts), peer attestations (15 pts), "
            "customer rating (10 pts), work duration (10 pts), and Aadhaar verification (5 pts). "
            "A score of 45+ unlocks your first schemes."
        ),
        "guide_apply": (
            "To apply for a scheme: go to Matched Schemes, click on a scheme, then tap Apply Now. "
            "Your verified worker identity is shared with the scheme provider automatically."
        ),
        "guide_aadhaar": (
            "Aadhaar verification adds 5 points to your IWTS score and is required by most schemes. "
            "Complete it in the Financial Identity section of your profile."
        ),
        "guide_eligibility": (
            "Eligibility is determined by your IWTS score. "
            "Each scheme has a minimum required score (minScore). "
            "If your score >= minScore, you qualify. "
            "Schemes with higher minScore values offer larger benefits."
        ),
        "guide_default": (
            "I can help you: (1) discover government schemes you qualify for, "
            "(2) understand your trust score breakdown, or "
            "(3) guide you through the application process. "
            "What would you like to know?"
        ),
    },

    "hi": {
        "sd_found": (
            "आपके प्रोफाइल के आधार पर, आपका IWTS ट्रस्ट स्कोर {score}/100 है। "
            "आप {n} सरकारी योजना(ओं) के लिए पात्र हैं। "
            "यहाँ सबसे अच्छे मिलान हैं:"
        ),
        "sd_none": (
            "आपका IWTS स्कोर {score} है, जो वर्तमान योजनाओं की न्यूनतम आवश्यकता से कम है। "
            "स्कोर सुधारने के लिए UPI लेनदेन बढ़ाएं, सहकर्मी प्रमाणीकरण जोड़ें, "
            "और उच्च ग्राहक रेटिंग बनाए रखें।"
        ),
        "sd_missing": (
            "मिलान योजनाएं खोजने के लिए, मुझे आपकी कार्य प्रोफाइल की जरूरत है। "
            "कृपया UPI लेनदेन, मासिक राशि, कार्य अवधि, "
            "स्थान स्थिरता, सहकर्मी प्रमाणीकरण, ग्राहक रेटिंग और आधार स्थिति भरें।"
        ),
        "ps_result": (
            "आपका IWTS ट्रस्ट स्कोर {score}/100 है। "
            "आपके स्कोर में सबसे अधिक योगदान देने वाले कारक हैं: {top_factors}। "
            "इन क्षेत्रों में सुधार से आप बेहतर सरकारी योजनाएं प्राप्त कर सकते हैं।"
        ),
        "ps_missing": (
            "आपका ट्रस्ट स्कोर समझाने के लिए, कृपया अपनी कार्य प्रोफाइल जानकारी प्रदान करें।"
        ),
        "guide_score": (
            "आपका IWTS स्कोर 7 कारकों से बनता है: "
            "UPI लेनदेन संख्या (25 अंक), औसत मासिक UPI राशि (20 अंक), "
            "स्थान स्थिरता (15 अंक), सहकर्मी प्रमाणीकरण (15 अंक), "
            "ग्राहक रेटिंग (10 अंक), कार्य अवधि (10 अंक), आधार सत्यापन (5 अंक)। "
            "45+ स्कोर पर पहली योजनाएं खुलती हैं।"
        ),
        "guide_apply": (
            "योजना के लिए आवेदन करने के लिए: मिलान योजनाएं पर जाएं, "
            "एक योजना पर क्लिक करें, फिर अभी आवेदन करें पर टैप करें। "
            "आपकी सत्यापित पहचान स्वचालित रूप से योजना प्रदाता के साथ साझा की जाती है।"
        ),
        "guide_aadhaar": (
            "आधार सत्यापन आपके IWTS स्कोर में 5 अंक जोड़ता है और अधिकांश योजनाओं के लिए आवश्यक है। "
            "अपनी प्रोफाइल के वित्तीय पहचान अनुभाग में इसे पूरा करें।"
        ),
        "guide_eligibility": (
            "पात्रता आपके IWTS स्कोर से निर्धारित होती है। "
            "प्रत्येक योजना में न्यूनतम आवश्यक स्कोर होता है। "
            "यदि आपका स्कोर >= न्यूनतम स्कोर है, तो आप पात्र हैं।"
        ),
        "guide_default": (
            "मैं आपकी मदद कर सकता हूं: (1) सरकारी योजनाएं खोजें, "
            "(2) ट्रस्ट स्कोर समझें, या "
            "(3) आवेदन प्रक्रिया में मार्गदर्शन लें। "
            "आप क्या जानना चाहते हैं?"
        ),
    },

    "mr": {
        "sd_found": (
            "तुमच्या प्रोफाइलवर आधारित, तुमचा IWTS ट्रस्ट स्कोर {score}/100 आहे। "
            "तुम्ही {n} सरकारी योजना(ं)साठी पात्र आहात। "
            "येथे सर्वोत्तम जुळणी आहे:"
        ),
        "sd_none": (
            "तुमचा IWTS स्कोर {score} आहे, जो सध्याच्या योजनांसाठी किमान आवश्यकतेपेक्षा कमी आहे। "
            "स्कोर सुधारण्यासाठी UPI व्यवहार वाढवा, सहकर्मी प्रमाणीकरण जोडा "
            "आणि उच्च ग्राहक रेटिंग राखा।"
        ),
        "sd_missing": (
            "जुळणाऱ्या योजना शोधण्यासाठी, मला तुमचे कार्य प्रोफाइल तपशील हवे आहेत। "
            "कृपया UPI व्यवहार, मासिक रक्कम, कामाचा कालावधी, "
            "स्थान सातत्य, सहकर्मी प्रमाणीकरण, ग्राहक रेटिंग आणि आधार स्थिती भरा।"
        ),
        "ps_result": (
            "तुमचा IWTS ट्रस्ट स्कोर {score}/100 आहे। "
            "तुमच्या स्कोरमध्ये सर्वात जास्त योगदान देणारे घटक: {top_factors}। "
            "या क्षेत्रांमध्ये सुधारणा केल्याने अधिक चांगल्या सरकारी योजना मिळतील।"
        ),
        "ps_missing": (
            "तुमचा ट्रस्ट स्कोर स्पष्ट करण्यासाठी, कृपया तुमचे कार्य प्रोफाइल तपशील द्या।"
        ),
        "guide_score": (
            "तुमचा IWTS स्कोर 7 घटकांवरून बनतो: "
            "UPI व्यवहार संख्या (25 गुण), सरासरी मासिक UPI रक्कम (20 गुण), "
            "स्थान सातत्य (15 गुण), सहकर्मी प्रमाणीकरण (15 गुण), "
            "ग्राहक रेटिंग (10 गुण), कामाचा कालावधी (10 गुण), आधार पडताळणी (5 गुण)। "
            "45+ स्कोरवर पहिल्या योजना उपलब्ध होतात।"
        ),
        "guide_apply": (
            "योजनेसाठी अर्ज करण्यासाठी: जुळलेल्या योजना पृष्ठावर जा, "
            "एक योजना निवडा, नंतर आता अर्ज करा वर टॅप करा। "
            "तुमची पडताळलेली ओळख आपोआप योजना प्रदात्याशी शेअर केली जाते।"
        ),
        "guide_aadhaar": (
            "आधार पडताळणी तुमच्या IWTS स्कोरमध्ये 5 गुण जोडते आणि बहुतेक योजनांसाठी आवश्यक आहे। "
            "तुमच्या प्रोफाइलच्या आर्थिक ओळख विभागात हे पूर्ण करा।"
        ),
        "guide_eligibility": (
            "पात्रता तुमच्या IWTS स्कोरद्वारे निर्धारित केली जाते। "
            "प्रत्येक योजनेत किमान आवश्यक स्कोर असतो। "
            "जर तुमचा स्कोर >= किमान स्कोर असेल तर तुम्ही पात्र आहात।"
        ),
        "guide_default": (
            "मी तुम्हाला मदत करू शकतो: (1) सरकारी योजना शोधा, "
            "(2) ट्रस्ट स्कोर समजून घ्या, किंवा "
            "(3) अर्ज प्रक्रियेत मार्गदर्शन मिळवा। "
            "तुम्हाला काय जाणून घ्यायचे आहे?"
        ),
    },
}


def _t(lang: str, key: str) -> str:
    """Return template string for the given language and key."""
    return _TEMPLATES.get(lang, _TEMPLATES["en"]).get(key, _TEMPLATES["en"][key])


# ──────────────────────────────────────────────────────────────────
# Guidance keyword router
# ──────────────────────────────────────────────────────────────────
_GUIDANCE_KEYWORDS: dict[str, list[str]] = {
    "guide_score":       ["score", "स्कोर", "स्कोर", "iwts", "calculated", "how", "कैसे", "कसे"],
    "guide_apply":       ["apply", "application", "आवेदन", "अर्ज", "submit"],
    "guide_aadhaar":     ["aadhaar", "आधार", "आधार", "identity", "kyc", "verify"],
    "guide_eligibility": ["eligib", "qualify", "पात्र", "पात्रता", "minimum", "न्यूनतम"],
}


def _guidance_key(message: str) -> str:
    msg = message.lower()
    for key, keywords in _GUIDANCE_KEYWORDS.items():
        if any(kw in msg for kw in keywords):
            return key
    return "guide_default"


# ──────────────────────────────────────────────────────────────────
# Profile validation helpers
# ──────────────────────────────────────────────────────────────────
_REQUIRED_FIELDS = [
    "upi_transactions_count",
    "upi_avg_monthly_amount",
    "location_consistency",
    "peer_attestations",
    "customer_rating_avg",
    "work_duration_months",
    "aadhaar_verified",
]


def _profile_complete(profile) -> bool:
    if profile is None:
        return False
    return all(getattr(profile, f, None) is not None for f in _REQUIRED_FIELDS)


def _profile_to_dict(profile) -> dict:
    return {f: float(getattr(profile, f)) for f in _REQUIRED_FIELDS}


def _format_top_factors(top_features: list) -> str:
    labels = {
        "upi_transactions_count": "UPI transactions",
        "upi_avg_monthly_amount": "monthly UPI amount",
        "location_consistency":   "location consistency",
        "peer_attestations":      "peer attestations",
        "customer_rating_avg":    "customer rating",
        "work_duration_months":   "work duration",
        "aadhaar_verified":       "Aadhaar verification",
        "txn_per_month":          "transactions per month",
        "amount_per_txn":         "amount per transaction",
        "trust_signal":           "trust signal",
        "stability_score":        "stability score",
    }
    parts = []
    for f in top_features[:3]:
        name = labels.get(f["feature"], f["feature"])
        direction = "+" if f["direction"] == "positive" else "-"
        parts.append(f"{name} ({direction}{abs(f['impact']):.1f})")
    return ", ".join(parts)


# ──────────────────────────────────────────────────────────────────
# Mode handlers
# ──────────────────────────────────────────────────────────────────
def _handle_scheme_discovery(profile, lang: str) -> dict:
    if not _profile_complete(profile):
        return {"assistant_reply": _t(lang, "sd_missing")}

    input_data   = _profile_to_dict(profile)
    prediction   = predict_pipeline(input_data)
    score        = prediction["iwts_score"]
    schemes      = prediction["eligible_schemes"]

    explanation: Optional[dict] = None
    try:
        explanation = explain_prediction(input_data)
    except Exception:
        pass

    if schemes:
        reply = _t(lang, "sd_found").format(score=score, n=len(schemes))
    else:
        reply = _t(lang, "sd_none").format(score=score)

    return {
        "assistant_reply":  reply,
        "iwts_score":       score,
        "eligible_schemes": schemes,
        "explanation":      explanation,
    }


def _handle_profile_score(profile, lang: str) -> dict:
    if not _profile_complete(profile):
        return {"assistant_reply": _t(lang, "ps_missing")}

    input_data = _profile_to_dict(profile)
    prediction = predict_pipeline(input_data)
    score      = prediction["iwts_score"]

    explanation: Optional[dict] = None
    top_factor_str = ""
    try:
        explanation    = explain_prediction(input_data)
        top_factor_str = _format_top_factors(explanation.get("top_features", []))
    except Exception:
        pass

    reply = _t(lang, "ps_result").format(
        score=score,
        top_factors=top_factor_str or "UPI activity, work duration, location stability",
    )

    return {
        "assistant_reply":  reply,
        "iwts_score":       score,
        "eligible_schemes": prediction["eligible_schemes"],
        "explanation":      explanation,
    }


def _handle_guidance(message: str, lang: str) -> dict:
    key   = _guidance_key(message)
    reply = _t(lang, key)
    return {"assistant_reply": reply}


# ──────────────────────────────────────────────────────────────────
# Public entry point
# ──────────────────────────────────────────────────────────────────
def process_chat(request: ChatRequest) -> dict:
    """
    Dispatch the chat request to the right handler and return a
    ChatResponse-compatible dict.
    """
    lang    = request.language.value
    mode    = request.mode
    profile = request.user_profile

    base = {
        "mode":             mode.value,
        "language":         lang,
        "user_message":     request.message,
        "assistant_reply":  "",
        "iwts_score":       None,
        "eligible_schemes": [],
        "explanation":      None,
    }

    if mode == Mode.scheme_discovery:
        result = _handle_scheme_discovery(profile, lang)
    elif mode == Mode.profile_score:
        result = _handle_profile_score(profile, lang)
    else:  # guidance
        result = _handle_guidance(request.message, lang)

    base.update(result)
    return base
