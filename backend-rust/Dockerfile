# Multi-stage Docker build for Dorabox Rust Backend
FROM rust:latest AS builder

WORKDIR /app

# Copy project configuration and sources
COPY Cargo.toml Cargo.lock* ./
COPY src ./src

# Build production binary using full Rust toolchain
RUN cargo build --release

# Final minimal runtime image (~35MB)
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/backend-rust /app/dorabox-backend

EXPOSE 10000

ENV PORT=10000

CMD ["/app/dorabox-backend"]
