# Multi-stage Docker build for Dorabox Rust Backend (Debian Slim)
FROM rust:1.82-slim AS builder

# Install required build tools for OpenSSL
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all project files directly
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Build release binary
RUN cargo build --release

# Final minimal runtime image (~35MB)
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/backend-rust /app/dorabox-backend

EXPOSE 10000

ENV PORT=10000

CMD ["/app/dorabox-backend"]
