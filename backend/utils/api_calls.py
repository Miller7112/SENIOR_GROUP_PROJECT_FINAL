import hashlib
import requests
from models.breach import BreachHistory

HIBP_API_URL = "https://api.pwnedpasswords.com/range/"

def check_pwned_password(password: str) -> int:
    sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
    prefix, suffix = sha1_hash[:5], sha1_hash[5:]

    existing_breach = BreachHistory.get_by_password_hash(sha1_hash)
    if existing_breach:
        return existing_breach.breach_count

    response = requests.get(f"{HIBP_API_URL}{prefix}")
    if response.status_code == 200:
        hashes = (line.split(':') for line in response.text.splitlines())
        for h, count in hashes:
            if h == suffix:
                BreachHistory.create_breach(sha1_hash, int(count))
                return int(count)

    BreachHistory.create_breach(sha1_hash, 0)
    return 0
