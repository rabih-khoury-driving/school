import json
import os
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

# -------------------------
# Configuration
# -------------------------

PROJECT_ROOT = Path(__file__).resolve().parent
JSON_FILE = PROJECT_ROOT / "src" / "data" / "questions_new_format.json"
IMAGE_FOLDER = PROJECT_ROOT / "public" / "images" / "questions"
IMAGE_FOLDER.mkdir(parents=True, exist_ok=True)


def save_questions(questions):
    with JSON_FILE.open("w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
        f.write("\n")


# -------------------------
# Load JSON
# -------------------------

with JSON_FILE.open("r", encoding="utf-8") as f:
    questions = json.load(f)

# -------------------------
# Download images
# -------------------------

for question in questions:
    image_url = question.get("image")
    question_id = question.get("id")

    if not image_url:
        continue

    if isinstance(image_url, str) and image_url.startswith("/images/"):
        continue

    try:
        parsed = urlparse(image_url)
        extension = os.path.splitext(parsed.path)[1] or ".png"
        filename = f"{question_id}{extension}"
        local_path = IMAGE_FOLDER / filename
        local_image_path = f"/images/questions/{filename}"

        if not local_path.exists():
            print(f"Downloading {filename} from {image_url}")
            request = Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(request, timeout=30) as response:
                data = response.read()

            with local_path.open("wb") as img:
                img.write(data)

        question["image"] = local_image_path
        save_questions(questions)
        print(f"Updated question {question_id} -> {local_image_path}")

    except Exception as e:
        print(f"Failed for question {question_id}: {e}")

print("Done.")