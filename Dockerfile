# Use official Bun image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage (if needed in future)
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Production stage
FROM base AS production
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Expose the port
EXPOSE 3333

# Set environment to production
ENV NODE_ENV=production

# Run the application
CMD ["bun", "run", "src/index.ts"]

