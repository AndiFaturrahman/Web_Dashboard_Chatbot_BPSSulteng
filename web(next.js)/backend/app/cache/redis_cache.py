import time
from typing import Optional, Any, Dict

# In-Memory TTL Cache fallback (with Redis interface compatibility)
_MEMORY_CACHE: Dict[str, Dict[str, Any]] = {}

def get_cache(key: str) -> Optional[Any]:
    if key in _MEMORY_CACHE:
        entry = _MEMORY_CACHE[key]
        if time.time() < entry["expire_at"]:
            return entry["data"]
        else:
            del _MEMORY_CACHE[key]
    return None

def set_cache(key: str, data: Any, ttl_seconds: int = 86400):
    _MEMORY_CACHE[key] = {
        "data": data,
        "expire_at": time.time() + ttl_seconds
    }
