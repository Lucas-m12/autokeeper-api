FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN bun install --frozen-lockfile

COPY . .

# Copy AWS RDS CA certificate bundle
COPY aws-rds-ca-bundle.pem /app/aws-rds-ca-bundle.pem

EXPOSE 3333

# Set environment to production
ENV NODE_ENV=production

# Add RDS CA certificate to trusted certificate store
ENV NODE_EXTRA_CA_CERTS=/app/aws-rds-ca-bundle.pem

# Run the application
CMD ["bun", "run", "src/app/server.ts"]

