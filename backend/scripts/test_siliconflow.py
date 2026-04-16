import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.config import settings


def main() -> int:
    if not settings.effective_llm_api_key:
        print("ERROR: missing effective LLM API key")
        return 1

    endpoint = f"{settings.effective_llm_base_url.rstrip('/')}/chat/completions"
    payload = {
        "model": settings.effective_llm_model,
        "messages": [
            {
                "role": "system",
                "content": "You are a concise assistant. Reply in one short sentence.",
            },
            {
                "role": "user",
                "content": "Reply with exactly: siliconflow-ok",
            },
        ],
        "temperature": 0,
        "max_tokens": 20,
    }

    request = Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.effective_llm_api_key}",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=settings.LLM_TIMEOUT_SECONDS) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        print(f"HTTP_ERROR: {exc.code}")
        print(exc.read().decode("utf-8", errors="ignore"))
        return 2
    except URLError as exc:
        print(f"URL_ERROR: {exc.reason}")
        return 3
    except Exception as exc:
        print(f"UNEXPECTED_ERROR: {exc}")
        return 4

    content = (
        data.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
        .strip()
    )
    print("MODEL:", settings.effective_llm_model)
    print("BASE_URL:", settings.effective_llm_base_url)
    print("REPLY:", content)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
