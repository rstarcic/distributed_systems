import subprocess

def start_services():
    # Replace with your actual service paths and ports
    services = [
        {"name": "Auth Service", "cmd": "python -m uvicorn auth-microservice.main:app --reload --host 0.0.0.0 --port 8001"},
        {"name": "Database Service", "cmd": "python -m uvicorn db-microservice.main:app --reload --host 0.0.0.0 --port 8004"},
        {"name": "Recommendation Service", "cmd": "python -m uvicorn recommendation-microservice.main:app --reload --host 0.0.0.0 --port 8003"},
        {"name": "Classic Service", "cmd": "python -m uvicorn classic-microservice.main:app --reload --host 0.0.0.0 --port 8002"}
    ]

    processes = []

    # Start each service
    for service in services:
        print(f"Starting {service['name']}...")
        process = subprocess.Popen(service["cmd"], shell=True)
        processes.append(process)

    # Wait for all processes to finish
    for process in processes:
        process.wait()

if __name__ == "__main__":
    start_services()
