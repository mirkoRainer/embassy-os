#!/bin/bash

set -e
bytesToSectors=512
startSector=2048
bootImageSize=524287
baseImageSizeB=$(stat --format="%s" raspios.img) 
baseImageSize=`expr $baseImageSizeB / $bytesToSectors`
bootImageEnd=`expr $startSector + $bootImageSize`
baseStart=`expr $bootImageEnd + 1`
# baseEnd
echo $bytesToSectors
echo $startSector
echo $baseImageSize
echo $baseStart
# 
# Use fdisk to create DOS partition table with 4 primary partitions, set 1 as bootable, write, and quite
(echo o; echo n; echo p; echo 1; echo 2048; echo 526335; echo t; echo c; echo n; echo p; echo 2; echo 526336; echo 1050623; echo t; echo 2; echo c; echo n; echo p; echo 3; echo 1050624; echo 16083455; echo n; echo p; echo 16083456; echo 31116287; echo a; echo 1; echo w) | sudo fdisk ${OUTPUT_DEVICE}
# (echo o; echo n; echo p; echo 1; echo $startSector; echo $bootImageEnd; echo t; echo c; echo n; echo p; echo 2; echo $baseStart; echo 1050623; echo t; echo 2; echo c; echo n; echo p; echo 3; echo 1050624; echo 16083455; echo n; echo p; echo 16083456; echo 31116287; echo a; echo 1; echo w) | sudo fdisk ${OUTPUT_DEVICE}
