

if hash webtorrent 2>/dev/null; then
    webtorrent  https://downloads.raspberrypi.org/raspios_arm64/images/raspios_arm64-2022-01-28/2022-01-28-raspios-bullseye-arm64.zip.torrent
else
    wget https://downloads.raspberrypi.org/raspios_arm64/images/raspios_arm64-2022-01-28/2022-01-28-raspios-bullseye-arm64.zip
    unzip raspios.img.zip
fi
unzip 2022-01-28-raspios-bullseye-arm64.zip
mv 2022-01-28-raspios-bullseye-arm64.img raspios.img