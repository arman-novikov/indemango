avrdude -C /etc/avrdude.conf -v -p atmega328p -c usbasp -P usb -e -Ulock:w:0x3F:m -Uefuse:w:0xFD:m -Uhfuse:w:0xD8:m -Ulfuse:w:0xFF:m 
avrdude -C /etc/avrdude.conf -v -p atmega328p -c usbasp -P usb -Uflash:w:/root/arduino/bootloaders/ariadne_debug328_w5500.hex:i -Ulock:w:0x0F:m