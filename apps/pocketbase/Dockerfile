FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates unzip wget && rm -rf /var/lib/apt/lists/*

WORKDIR /pb

RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v0.38.0/pocketbase_0.38.0_linux_amd64.zip \
    && unzip pocketbase_0.38.0_linux_amd64.zip \
    && rm pocketbase_0.38.0_linux_amd64.zip \
    && chmod +x /pb/pocketbase

COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data", "--migrationsDir=/pb/pb_migrations", "--hooksDir=/pb/pb_hooks"]
