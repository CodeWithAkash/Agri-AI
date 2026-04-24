import os
from pymongo import MongoClient

client = None
db = None

def init_db(app=None):
    global client, db

    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set")

    client = MongoClient(mongo_uri)
    db = client["agri_ai"]

def get_db():
    return db

def get_collection(name):
    return db[name]