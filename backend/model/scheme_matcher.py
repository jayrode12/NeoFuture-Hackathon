import json
from config import SCHEME_PATH

# load schemes once
with open(SCHEME_PATH, "r") as f:
    schemes = json.load(f)


def match_schemes(score: float):
    eligible = []

    for scheme in schemes:
        if score >= scheme["minScore"]:
            eligible.append(scheme)

    # sort by highest requirement (best schemes first)
    eligible = sorted(eligible, key=lambda x: x["minScore"], reverse=True)

    return eligible