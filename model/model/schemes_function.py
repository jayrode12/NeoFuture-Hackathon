import json
import os

def get_eligible_schemes(iwts_score):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(BASE_DIR, "database", "schemes_dataset.json")

    with open(path, "r") as f:
        schemes = json.load(f)

    result = []

    for scheme in schemes:
        if iwts_score >= scheme["minScore"]:
            status = "eligible"
            reason = "Meets minimum score requirement"
        else:
            status = "not eligible"
            reason = f"Requires {scheme['minScore']}, you have {round(iwts_score,2)}"

        result.append({
            "name": scheme["name"],
            "status": status,
            "reason": reason
        })

    return result