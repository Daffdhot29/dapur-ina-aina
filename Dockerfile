
FROM node:24-bookworm-slim

WORKDIR /app


RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*


COPY package*.json ./

RUN npm ci


COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev", "--", "--host=0.0.0.0"]