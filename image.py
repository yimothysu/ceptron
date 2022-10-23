from fastapi import APIRouter
import os
import shlex

router = APIRouter()

@router.get("/api/image")
async def image(prompt: str):
    sanitizedPrompt = shlex.quote(prompt)
    ckptPath = '/home/hydra/hackGT9/weights/'
    scriptPath = '/home/hydra/hackGT9/stableDiffusionLib/scripts/text2img.py'
    outdir = '/home/hydra/hackGT9/outputs/txt2img-samples/'
    os.system(f'python {scriptPath} --prompt {sanitizedPrompt} --ckpt {ckptPath} --outdir {outdir}')
    outImagePath = outdir + 'samples/00000.png'
    with open(outImagePath, "rb") as image:
        outImage = image.read()
        imageBytes = bytearray(outImage)
    os.system(f'rm -r {outdir}*')
    return imageBytes