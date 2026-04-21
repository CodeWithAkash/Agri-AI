// MongoDB initialization script
db = db.getSiblingDB('agri_ai');

db.createCollection('analyses');
db.createCollection('weather_cache');

db.analyses.createIndex({ createdAt: -1 });
db.analyses.createIndex({ crop: 1 });
db.analyses.createIndex({ location: "2dsphere" });

db.weather_cache.createIndex({ location: 1 }, { unique: true });
db.weather_cache.createIndex({ updatedAt: 1 }, { expireAfterSeconds: 3600 });

print('MongoDB initialized successfully for agri_ai database');
