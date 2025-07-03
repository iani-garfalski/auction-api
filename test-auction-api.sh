#!/bin/bash

BASE_URL="http://localhost:3000/api"

echo "Testing GET /items?page=1&limit=10"
curl -s "$BASE_URL/items?page=1&limit=10"
echo -e "\n\n"

echo "Testing POST /items"
curl -s -X POST "$BASE_URL/items" \
  -H "Content-Type: application/json" \
  -H "x-api-key: dfBbhJTdWTApmBUAs2s8zTcIMnLRl2qT" \
  -d '{"title":"Test Item","description":"This is a test","category":"Test","estimatedValue":1000,"status":"upcoming"}'
echo -e "\n\n"

echo "Testing GET /items/:id (use id=1)"
curl -s "$BASE_URL/items/1"
echo -e "\n\n"

echo "Testing PUT /items/:id (use id=1)"
curl -s -X PUT "$BASE_URL/items/1" \
  -H "Content-Type: application/json" \
  -H "x-api-key: dfBbhJTdWTApmBUAs2s8zTcIMnLRl2qT" \
  -d '{"title":"Updated Title","description":"Updated description","category":"Updated","estimatedValue":2000,"status":"live"}'
echo -e "\n\n"

echo "Testing GET /search?q=test"
curl -s "$BASE_URL/search?q=test"
echo -e "\n\n"

echo "Testing DELETE /items/:id (use id=1)"
curl -s -X DELETE "$BASE_URL/items/1" \
  -H "x-api-key: dfBbhJTdWTApmBUAs2s8zTcIMnLRl2qT"
echo -e "\n\n"

echo "All tests completed."
