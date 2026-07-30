#!/usr/bin/env python3
import base64, io, json
from PIL import Image

UP="/mnt/user-data/uploads/"
CF="/home/claude/cf/"

def b64(im,q=82):
    buf=io.BytesIO(); im.convert("RGB").save(buf,"JPEG",quality=q)
    return "data:image/jpeg;base64,"+base64.b64encode(buf.getvalue()).decode()

def crop_ratio(im, rw, rh, ax=0.5, ay=0.5):
    """Crop to rw:rh, anchoring the kept window at (ax,ay) focal fraction."""
    im=im.convert("RGB"); W,H=im.size; target=rw/rh; cur=W/H
    if cur>target:  # too wide -> crop sides
        nw=int(H*target); x=int((W-nw)*ax); im=im.crop((x,0,x+nw,H))
    else:           # too tall -> crop top/bottom
        nh=int(W/target); y=int((H-nh)*ay); im=im.crop((0,y,W,y+nh))
    return im

def load(f): return Image.open(UP+f)

A={}

# HERO - single wide shot. Hands are center-frame; crop to a generous cinematic
# banner and downscale. 16:7-ish so the bottom scrim/headline clears the hands.
hero=crop_ratio(load("Hands_wide.jpg"),16,8, ax=0.5, ay=0.42); hero.thumbnail((1800,1800))
A["EV_HERO"]=b64(hero,80)

# RECAP BALI (feature, wider ~16:9). Group centered, keep the temple arch up top.
bali=crop_ratio(load("Bali2025.jpg"),16,9, ax=0.5, ay=0.5); bali.thumbnail((1500,1500))
A["EV_RECAP_BALI"]=b64(bali,80)

# RECAP SHASTA 16:10. Circle fills frame; center anchor.
sh=crop_ratio(load("Shasta_2.jpg"),16,10, ax=0.5, ay=0.5); sh.thumbnail((1100,1100))
A["EV_RECAP_SHASTA"]=b64(sh,82)

# RECAP BHUTAN 16:10. Subjects sit low-center under mountains; bias DOWN to keep faces.
bh=crop_ratio(load("Bhutan_retreat.jpg"),16,10, ax=0.5, ay=0.66); bh.thumbnail((1100,1100))
A["EV_RECAP_BHUTAN"]=b64(bh,82)

# RECAP UGANDA 16:10. Already ~16:9, group spans width; center.
ug=crop_ratio(load("SINA_Uganda_wide.jpg"),16,10, ax=0.5, ay=0.45); ug.thumbnail((1100,1100))
A["EV_RECAP_UGANDA"]=b64(ug,82)

# RECAP SINGAPORE 16:10. Table + faces center; slight down bias to hold the group.
sg=crop_ratio(load("Singapore_3_crop.jpg"),16,10, ax=0.5, ay=0.5); sg.thumbnail((1100,1100))
A["EV_RECAP_SINGAPORE"]=b64(sg,82)

json.dump(A,open(CF+"assets_ev.json","w"))
for k,v in A.items():
    print(k.ljust(20), f"{len(v)//1024} KB")
print("total keys:", len(A))
