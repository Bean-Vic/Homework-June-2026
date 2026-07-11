"""Run the classifier over a labeled set and report per-attribute accuracy.

This is one of the only two entry points that calls the REAL OpenAI API (the
other is scripts/check_openai_json.py); it is intentionally NOT part of the
pytest suite. Populate eval/images/ with photos and eval/labels.json with their
expected attributes first (see the README's Evaluation section for the format).

Usage (from HW14/, with OPENAI_API_KEY set): python eval/evaluate.py
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
from app.classifier import get_classifier

load_dotenv()
EVAL_DIR = Path(__file__).resolve().parent
SCORED = ["garment_type", "style", "material", "pattern", "occasion",
          "consumer_profile", "season", "location_context"]


def norm(v) -> str:
    if isinstance(v, list):
        v = " ".join(v)
    return str(v or "").strip().lower()


def main() -> int:
    labels_path = EVAL_DIR / "labels.json"
    labels = json.loads(labels_path.read_text())
    # Ignore template/placeholder rows whose image file is not present, so a
    # fresh checkout reports a clear "add images" message instead of crashing.
    present, missing = [], []
    for item in labels:
        (present if (EVAL_DIR / item["file"]).exists() else missing).append(item)

    if missing:
        print(f"Skipping {len(missing)} labeled item(s) with no image file on disk:")
        for item in missing:
            print(f"  - {item['file']}")
    if not present:
        print("\nNo eval images found. Add photos under eval/images/ and list their "
              "expected attributes in eval/labels.json, then re-run. See the README "
              "'Evaluation' section for the format.")
        return 1

    classifier = get_classifier()
    correct = defaultdict(int)
    total = defaultdict(int)

    for item in present:
        image_bytes = (EVAL_DIR / item["file"]).read_bytes()
        pred = classifier.classify(image_bytes).attributes.model_dump()
        for attr, exp in item["expected"].items():
            if attr not in SCORED:
                continue
            total[attr] += 1
            # substring-tolerant match in either direction
            e, p = norm(exp), norm(pred.get(attr))
            if e and (e == p or e in p or p in e):
                correct[attr] += 1

    print(f"\nEvaluated {len(present)} images\n")
    print(f"{'attribute':<20} {'accuracy':>10}  n")
    overall_c = overall_t = 0
    for attr in SCORED:
        if total[attr] == 0:
            continue
        acc = correct[attr] / total[attr]
        overall_c += correct[attr]
        overall_t += total[attr]
        print(f"{attr:<20} {acc:>9.0%}  {total[attr]}")
    if overall_t:
        print(f"\n{'OVERALL':<20} {overall_c / overall_t:>9.0%}  {overall_t}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
