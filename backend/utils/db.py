import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["agri_ai"]

def get_db():
    return db

def get_collection(name):
    return db[name]