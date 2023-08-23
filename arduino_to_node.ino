#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define OLED_RESET 4
Adafruit_SSD1306 display(OLED_RESET);

int sensorPin = 2;
volatile long pulse;
volatile long pulseCount;
float volume;
float flowRate;
unsigned long lastTime;

void setup() {
  pinMode(sensorPin, INPUT);
  Serial.begin(115200);
  attachInterrupt(digitalPinToInterrupt(sensorPin), increase, RISING);

  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
}

void loop() {
  volume = 0.58 * pulseCount / 1000;
  flowRate = 0.58 * pulse / 1000 * 30;
  if(millis() - lastTime > 2000) {
    pulse = 0;
    lastTime = millis();
  }
  display.setTextSize(1.9999999);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.print("Flow Rate: "); 
  display.print(flowRate);
  display.println(" L/m");
  display.println("");
  display.print("Volume: "); 
  display.print(volume);
  display.println(" L");
  display.display();
  display.clearDisplay();
  Serial.print(flowRate);
  Serial.print(" ");
  Serial.println(volume);
  delay(100);
}

void increase() {
  pulse++;
  pulseCount++;
}
