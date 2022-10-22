import os

import dotenv

from google.cloud import storage

dotenv.load_dotenv()

weights_dir = "weights/"
files = [
    "sd-v1-4.ckpt"
]

storage_client = storage.Client(os.environ["GCP_PROJECT_NAME"])
bucket = storage_client.get_bucket(os.environ["GCP_MODEL_BUCKET"])

for file in files:
    if not os.path.exists(weights_dir):
        os.mkdir(weights_dir)
    if not os.path.exists(weights_dir + file):
        blob = bucket.blob(file)
        blob.download_to_filename(weights_dir + file)