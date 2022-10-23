from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
import shlex
import subprocess
import time
import random

router = APIRouter()

@router.get("/api/image")
async def image(prompt: str):
    os.system('sudo rm -r /home/hydra/hackGT9/outputs/txt2img-samples/*')
    #time.sleep(0.1)
    sanitizedPrompt = shlex.quote(prompt)
    seed = random.randint(-256, 255)
    ckptPath = '/home/hydra/hackGT9/weights/sd-v1-4.ckpt'
    scriptPath = '/home/hydra/hackGT9/stableDiffusionLib/scripts/txt2img.py'
    outdir = '/home/hydra/hackGT9/outputs/txt2img-samples/'
    configPath = '/home/hydra/hackGT9/stableDiffusionLib/configs/stable-diffusion/v1-inference.yaml'
    #os.system(f'source /home/hydra/anaconda3/bin/activate;conda activate ldm;python3 {scriptPath} --prompt {sanitizedPrompt} --ckpt {ckptPath} --outdir {outdir} --config {configPath}')
    os.system(f'python3 {scriptPath} --prompt {sanitizedPrompt} --ckpt {ckptPath} --outdir {outdir} --config {configPath} --seed {seed}')

    #time.sleep(1)
    outImagePath = outdir + 'samples/00000.png'
    return FileResponse(outImagePath)