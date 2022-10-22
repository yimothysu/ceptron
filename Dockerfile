FROM python:3.8-slim-buster
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .
RUN python3 -c "import nltk; nltk.download('punkt')"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80", "--root-path", "/api"]
