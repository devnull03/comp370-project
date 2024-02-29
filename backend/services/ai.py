import base64
import json
from openai import OpenAI

client = OpenAI()


def process_image(image):
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Answer only in csv format without spaces in plain text in a single line with keys (no need to use the actual key names, just maintain the order): label, bin, co2, pts where label is what the object is, bin is one of 3 values, O, R or L, meaning organic, recycling and landfill respectively . Base your answers on BC, Canada garbage disposal guidelines. co2 should return a number that is an estimation of how much co2 was prevented to be produced if the waste did not go into a landfill. pts should be a certain amount of points oh a scale of 100 to 1000 gained by disposing the the object correctly, it should scale depending on how good the environment impact is. If the object in image cannot be disopsed or any other conflict, just send a X in the bin key and 0 for points. if there are multiple items in image, focus on one",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "data:image/jpeg;base64,"
                            + str(base64.b64encode(image)).lstrip("b").strip("'"),
                        },
                    },
                ],
            }
        ],
        max_tokens=300,
    )



    splited = json.loads(response.json())["choices"][0]["message"]["content"].split(",")

    print(json.loads(response.json()))

    return {
        "label": splited[0],
        "bin": splited[1],
        "co2": splited[2],
        "pts": splited[3],
    }
