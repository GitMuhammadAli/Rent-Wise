FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY server/ai/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ai/python .

ENV SENTIMENT_SERVICE_HOST=0.0.0.0
ENV SENTIMENT_SERVICE_PORT=5000

EXPOSE 5000

CMD ["gunicorn", "sentiment_model:app", "--bind", "0.0.0.0:5000"]

