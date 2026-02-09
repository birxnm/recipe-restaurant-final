#!/bin/bash
echo "=========================================="
echo "   ASIAN FOOD RECIPE - SERVER FIX "
echo "=========================================="
echo "1. Installing missing dependencies..."
echo "1. Installing missing dependencies..."
npm install

echo "1b. Fixing file permissions..."
chmod -R 755 ../frontend

echo "1c. Checking for MongoDB..."
if ! lsof -i :27017 >/dev/null; then
    echo "   - MongoDB is NOT running on port 27017."
    echo "   - Attempting to start MongoDB via Homebrew..."
    brew services start mongodb-community
    
    echo "   - Waiting for MongoDB to start (10 seconds)..."
    sleep 10
    
    if ! lsof -i :27017 >/dev/null; then
        echo "=================================================="
        echo " ERROR: Could not start MongoDB automatically!"
        echo " Please manually run: brew services start mongodb-community"
        echo "=================================================="
        exit 1
    else
        echo "   - SUCCESS: MongoDB started successfully!"
    fi
else
    echo "   - MongoDB is running."
fi

echo "2. Checking for existing server on port 5000..."
PID=$(lsof -ti :5000)
if [ ! -z "$PID" ]; then
  echo "   - Found old server (PID: $PID). Killing it..."
  kill -9 $PID
  
  # Wait loop to ensure it dies
  count=0
  while [ ! -z "$(lsof -ti :5000)" ] && [ $count -lt 5 ]; do
    echo "   - Waiting for port 5000 to free up..."
    sleep 1
    count=$((count+1))
  done
  
  if [ ! -z "$(lsof -ti :5000)" ]; then
     echo "   ERROR: Port 5000 is STILL in use. Something is wrong."
  else
     echo "   - Port 5000 is now free."
  fi
fi

echo "2. Starting the backend server..."
echo "------------------------------------------"
echo "If successful, you will see 'Server running on port 5000' below."
echo "Keep this window OPEN."
echo "------------------------------------------"
npm start
