import json
import os

def goal_based_schemes(user_goal, iwts_score):

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(BASE_DIR, "database", "schemes_dataset.json")

    with open(path, "r") as f:
        schemes = json.load(f)

    # -------------------------------
    # FILTER BASED ON GOAL
    # -------------------------------
    goal = user_goal.lower()

    filtered = []
    for scheme in schemes:
        if goal in scheme.get("category", "").lower() or goal in scheme.get("name", "").lower():
            filtered.append(scheme)

    # -------------------------------
    # SPLIT ELIGIBLE / LOCKED
    # -------------------------------
    eligible = []
    locked = []

    for scheme in filtered:
        if iwts_score >= scheme["minScore"]:
            eligible.append(scheme)
        else:
            gap = round(scheme["minScore"] - iwts_score, 2)
            locked.append({
                "name": scheme["name"],
                "required_score": scheme["minScore"],
                "gap": gap
            })

    # -------------------------------
    # SORT LOCKED (closest first)
    # -------------------------------
    locked = sorted(locked, key=lambda x: x["gap"])

    return {
        "goal": user_goal,
        "eligible": eligible,
        "unlockable": locked[:3]  # top 3 closest
    }