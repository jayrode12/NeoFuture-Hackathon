"""
scheme_matcher.py — Match eligible government schemes against an IWTS score.

Loads schemes_dataset.json once at import time and exposes match_schemes().
Each returned scheme dict includes a human-readable match_reason field.
"""

import sys
import os
import json

_MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
if _MODEL_DIR not in sys.path:
    sys.path.insert(0, _MODEL_DIR)

from config import SCHEME_PATH

# Load schemes once at module import
with open(SCHEME_PATH, "r", encoding="utf-8") as _f:
    _SCHEMES = json.load(_f)


def match_schemes(score: float) -> list:
    """
    Return eligible schemes sorted by minScore descending (best first).

    Each dict in the returned list mirrors the JSON schema plus:
        match_reason  str  — plain-language explanation of why the scheme matched
    """
    eligible = []

    for scheme in _SCHEMES:
        min_score = scheme.get("minScore", 0)
        if score >= min_score:
            s = dict(scheme)
            margin = round(score - min_score, 1)
            s["match_reason"] = (
                f"Your IWTS score of {score:.1f} meets the minimum required score of "
                f"{min_score} for this scheme (you exceed it by {margin} points)."
            )
            eligible.append(s)

    # Highest-requirement schemes first
    eligible.sort(key=lambda x: x["minScore"], reverse=True)
    return eligible
