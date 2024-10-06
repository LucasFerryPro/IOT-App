#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <Arduino_LSM6DS3.h>

// WiFi credentials
char ssid[] = "iPhone de Lucas";     // your network SSID (name)
char pass[] = "draisine";    // your network password

// Server details
char serverAddress[] = "172.20.10.2";  // Server IP or domain
int port = 3030; // Port number

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void setup() {
  Serial.begin(9600);
  while (!Serial);

  // Connect to WiFi
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    delay(5000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  // Initialize the IMU
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());
  Serial.println(" Hz");
  Serial.println("Acceleration in g's");
  Serial.println("X\tY\tZ");
}

void loop() {
  float x, y, z;

  // Check if new acceleration data is available
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    // Print the accelerometer data to Serial
    Serial.print(x);
    Serial.print('\t');
    Serial.print(y);
    Serial.print('\t');
    Serial.println(z);

    // Prepare the JSON payload to send to the server
    String jsonData = "{\"x\":" + String(x, 6) + ",\"y\":" + String(y, 6) + ",\"z\":" + String(z, 6) + "}";

    // Send HTTP POST request
    client.beginRequest();
    client.post("/api/nano_data");  // API endpoint on the server

    // Set headers
    client.sendHeader("Content-Type", "application/json");
    client.sendHeader("Content-Length", jsonData.length());

    // Send body content (the JSON data)
    client.beginBody();
    client.print(jsonData);
    client.endRequest();

    // Read the server response
    int statusCode = client.responseStatusCode();
    String response = client.responseBody();

    // Print status code and response
    Serial.print("Status Code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);

    // Wait before sending the next data
    delay(1000);
  }
}