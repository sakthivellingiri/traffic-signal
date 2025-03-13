# traffic-signal

# clone the main repo with git clone https://github.com/sakthivellingiri/traffic-signal.git

Server setup

cd server
npm install

Data Base connection:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=admin@123
DB_NAME=postgres


MQTT connection:
  host: 'broker.emqx.io',
  port: 1883,
  username: 'admin',
  password: 'admin@123',

npm run start 
http://localhost:4000

schema for table create signals
CREATE TABLE signals (
    id SERIAL PRIMARY KEY,               
    machine_id SERIAL NOT NULL,          
    signal_type VARCHAR(50)[] NOT NULL,  
    signal_data VARCHAR(50) DEFAULT 'Unknown',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Postman collection to add the machine manually

method - post
url - http://localhost:4040/api/signal
request body - 
{
  "machine_id": "10001",
  "signal_type": ["Red", "Green", "Yellow"]
}

mqtt 
topic signal-data
sample data 
{
  "machine_id": "10002",
  "signal_data":"Green"
}


client setup

cd client 
npm install
npm run dev
http://localhost:5174/
