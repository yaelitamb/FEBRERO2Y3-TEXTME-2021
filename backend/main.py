from fastapi import FastAPI, HTTPException
from pydantic import ValidationError
from bson import ObjectId
from database import messages_collection
from models import Message
from schemas import message_schema, messages_schema, cabecera_schema, cabeceras_schema

# Crear la aplicación principal
app = FastAPI()

# Obtener los datos de cabecera (id, de, para, asunto, timestamp) de los mensajes enviados y recibidos por un usuario dado, en orden descendente de fecha y hora, y en caso de que coincidan, por id
@app.get("/header/{email}")
async def get_header(email: str):
    messages = messages_collection.find({"$or": [{"de": email}, {"para": email}]}, {"_id": 1, "de": 1, "para": 1, "asunto": 1, "timestamp": 1}).sort([("timestamp", -1), ("_id", -1)])
    return cabeceras_schema(messages)

# Obtener los datos completos de un mensaje específico
@app.get("/message/{message_id}")
async def get_message(message_id: str):
    message = messages_collection.find_one({"_id": ObjectId(message_id)})
    if message:
        return message_schema(message)
    raise HTTPException(status_code=404, detail="Mensaje no encontrado")

# Crear un nuevo mensaje a partir de los campos de, para, asunto y contenido
@app.post("/message")
async def create_message(message: Message):
    try:
        message_id = messages_collection.insert_one(message.dict()).inserted_id
        return {"message_id": str(message_id)}
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Modificar el asunto de un mensaje a partir de su identificador y nuevo título
@app.put("/message/{message_id}")
async def update_message_subject(message_id: str, asunto: str):
    result = messages_collection.update_one({"_id": ObjectId(message_id)}, {"$set": {"asunto": asunto}})
    if result.modified_count:
        return {"message_id": message_id}
    raise HTTPException(status_code=404, detail="Mensaje no encontrado")

# Eliminar un mensaje específico
@app.delete("/message/{message_id}")
async def delete_message(message_id: str):
    result = messages_collection.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count:
        return {"message_id": message_id}
    raise HTTPException(status_code=404, detail="Mensaje no encontrado")

# Obtener los datos de cabecera en orden ascendente de fecha y hora de la conversación completa (conjunto de mensajes enviados y recibidos) entre dos usuarios a partir de sus identificadores
@app.get("/conversation/{user1}/{user2}")
async def get_conversation(user1: str, user2: str):
    messages = messages_collection.find({"$or": [{"de": user1, "para": user2}, {"de": user2, "para": user1}]}, {"_id": 1, "de": 1, "para": 1, "asunto": 1, "timestamp": 1}).sort("timestamp", 1)
    return cabeceras_schema(messages)

# Obtener los ultimos mensajes intercambiados con los distintos usuarios y filtrarlos si estan pending
@app.get("/lastmessages/{email}")
async def get_last_messages(email: str):
    pipeline = [
        {"$match": {"$or": [{"de": email}, {"para": email}]}},
        {"$sort": {"timestamp": -1, "_id": -1}},
        {"$group": {
            "_id": {"$cond": [{"$eq": ["$de", email]}, "$para", "$de"]},
            "message": {"$first": "$$ROOT"}
        }},
        {"$replaceRoot": {"newRoot": "$message"}},
        {"$sort": {"timestamp": -1, "_id": -1}}
    ]
    messages = list(messages_collection.aggregate(pipeline))
    # Filtrar messages para que contenga solo los recibidos a nuestro email
    messages = [message for message in messages if message["para"] == email]
    return cabeceras_schema(messages)



# Obtener los contactos de un usuario (lista de usuarios con los que ha interecambiado mensajes)
@app.get("/contacts/{email}")
async def get_contacts(email: str):
    contacts = messages_collection.distinct("de", {"para": email})
    return contacts
