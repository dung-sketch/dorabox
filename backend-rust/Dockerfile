# Multi-stage Docker build for Dorabox Rust Backend
FROM rust:1.80-alpine AS builder

RUN apk add --no-cache musl-dev pkgconfig openssl-dev

WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Copy source and build
COPY src ./src
RUN touch src/main.rs
RUN cargo build --release

# Final runtime image
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/target/release/backend-rust /app/dorabox-backend

EXPOSE 4000

ENV PORT=4000

CMD ["/app/dorabox-backend"]
