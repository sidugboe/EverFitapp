FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /src

ENV FLASK_SERVER_PORT 9090

COPY requirements.txt /src

RUN --mount=type=cache,target=/root/.cache/pip
RUN pip3 install -r requirements.txt

COPY . .

CMD ["python3", "server.py"]