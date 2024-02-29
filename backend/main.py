import base64
import requests
import fastapi

from services.ai import process_image

app = fastapi.FastAPI()

@app.post("/process/")
async def create_files(image: fastapi.UploadFile):
    contents = await image.read()

    # print(contents[:40])
    # print(base64.b64encode(contents))
    # return "data:image/jpeg;base64," + str(base64.b64encode(contents)).lstrip('b').strip('\'')
    return process_image(contents)
