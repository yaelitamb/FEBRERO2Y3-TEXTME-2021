from datetime import datetime

# Función para transformar un mensaje
def cabecera_schema(message):
    return {
        "id": str(message["_id"]),  # Convertir el ObjectId a string
        "de": message["de"],
        "para": message["para"],
        "asunto": message["asunto"],
        "stamp": datetime.fromtimestamp(message["timestamp"]).strftime('%Y-%m-%d %H:%M:%S'),
    }

# Función para transformar una lista de mensajes
def cabeceras_schema(messages):
    return [cabecera_schema(message) for message in messages]

def message_schema(message):
    return {
        "id": str(message["_id"]),  # Convertir el ObjectId a string
        "de": message["de"],
        "para": message["para"],
        "asunto": message["asunto"],
        "stamp": datetime.fromtimestamp(message["timestamp"]).strftime('%Y-%m-%d %H:%M:%S'),
        "contenido": message["contenido"],
        "adjunto": message.get("adjunto")
    }

# Función para transformar una lista de mensajes
def messages_schema(messages):
    return [message_schema(message) for message in messages]
