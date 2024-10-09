#include "DHT.h"
#include <WiFi.h>

#define DHTPIN 18
#define DHTTYPE DHT11

const char* ssid = "";
const char* password = "";

const char* serverIP = "172.20.10.2";  // Server IP Address
const uint16_t serverPort = 8080;        // Server port

WiFiClient client;

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Connect to the Wi-Fi network
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  WiFi.setSleep(false);

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
  } else {
    Serial.println("Connection to server failed.");
  }
}

String readLine() {
  char buffer[1024];
  memset(buffer,0,1024);    // reset buffer
  int index = 0; 
  char c;  
  while(true) {
    while (!client.available()) {} // wait for smthg to read
    while ((index < 1023) && (client.available())) {
      c = client.read();
      if (c == '\n') return String(buffer); // end-of-line reached => return
      buffer[index++] = c; // store the char
    }
    // prevent buffer overflow: return the whole buffer even if no \n encountered
    if (index == 1023) return String(buffer); 
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
  
  if (!client.connected()) {
    Serial.println("Reconnecting to server...");
    if (client.connect(serverIP, serverPort)) {
      Serial.println("Reconnected to server.");
    } else {
      Serial.println("Reconnection to server failed.");
      return;
    }
  }

  Serial.println("sending data: "+ dataString);

  client.print(dataString);
  Serial.println(readLine());
}
