#include "DHT.h"
#include <WiFi.h>

#define DHTPIN 18
#define DHTTYPE DHT11

// Replace with your network credentials
const char* ssid = "iPhone de Lucas";
const char* password = "draisine";

// Replace with the IP address and port of your TCP server
const char* serverIP = "172.0.0.1";  // Server IP Address
const uint16_t serverPort = 8080;        // Server port

WiFiClient client;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Connect to the Wi-Fi network
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  // Wait until connected
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected.");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Attempt to connect to the server
  Serial.println("Connecting to server...");
  if (client.connect(serverIP, serverPort)) {
    Serial.println("Connected to server.");
      
    // Optional: Read server response
    if (client.available()) {
      String response = client.readString();
      Serial.println("Response from server: " + response);
    }
    
    Serial.println("Connection closed.");
  } else {
    Serial.println("Connection to server failed.");
  }
}

void loop() {
  delay(5000);

  float h = dht.readHumidity();

  float t = dht.readTemperature();

  float f = dht.readTemperature(true);

  if(isnan(h) || isnan(t) || isnan(f)){
    client.print("Error getting datas from sensor");
    Serial.println("receive failed");
    return;
  }

  String dataString = String(t) +","+ String(h);
  
  client.print(dataString);
}
