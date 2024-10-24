FROM node:latest AS build

RUN apt-get update && \
    apt-get install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libasound2-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain stable -y

ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run tauri build

FROM archlinux:latest AS production

WORKDIR /app

RUN pacman -Sy --noconfirm \
    webkit2gtk \
    librsvg \
    openssl \
    alsa-lib && \
    pacman -Scc --noconfirm

COPY --from=build /app/src-tauri/target/release/ /app/

EXPOSE 1420 1421

RUN chmod +x ./pomodoro-timer-app

CMD ["./pomodoro-timer-app"]