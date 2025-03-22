from datetime import datetime, timezone


def convert_time():
    utc_time = datetime.now(timezone.utc).isoformat()
    return utc_time
