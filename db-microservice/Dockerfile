FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8004
CMD ["sh", "-c", "python create_tables.py && python load_recipes.py && uvicorn main:app --host 0.0.0.0 --port 8004 --reload"]
