#include "DHT.h"

#define DHTPIN 18
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

}

void loop() {
  delay(5000);

  float h = dht.readHumidity();

  float t = dht.readTemperature();

  float f = dht.readTemperature(true);

  if(isnan(h) || isnan(t) || isnan(f)){
    Serial.println("receive failed");
    return;
  }

  Serial.print("Humidity: ");
  Serial.println(h);
  Serial.print("Temperature: ");
  Serial.println(t);
  Serial.print("Temperature in Farenheit: ");
  Serial.println(f);
}
