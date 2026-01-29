import os
from PIL import Image

start_path = r"C:/Users/ersai/.gemini/antigravity/brain/e52b3164-385d-408a-b7c5-1b1a57ec34d3/uploaded_image_1768892535687.png"
dest_dir = r"d:\bandipur website\public\team"
os.makedirs(dest_dir, exist_ok=True)

try:
    img = Image.open(start_path)
    print(f"Opened image: {img.size}")
    
    # Coordinates derived from grid estimation (W=939, H=867)
    # Box size approx 190x190 to catch the circle and border
    w_box = 190
    h_box = 190
    
    # Centers
    c1_x, c1_y = 470, 140
    
    r2_y = 480
    r3_y = 800
    
    c_col1 = 195
    c_col2 = 470
    c_col3 = 745
    
    crops = [
        ("chairman.png", (c1_x, c1_y)),
        ("director_krishna.png", (c_col1, r2_y)),
        ("director_hari.png", (c_col2, r2_y)),
        ("director_rama.png", (c_col3, r2_y)),
        ("director_baburam.png", (c_col1, r3_y)),
        ("director_madhav.png", (c_col2, r3_y)),
        ("director_tank.png", (c_col3, r3_y)),
    ]
    
    for name, (cx, cy) in crops:
        x1 = int(cx - w_box/2)
        y1 = int(cy - h_box/2)
        x2 = int(cx + w_box/2)
        y2 = int(cy + h_box/2)
        
        # Clamp
        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(img.size[0], x2)
        y2 = min(img.size[1], y2)
        
        print(f"Cropping {name}: {x1},{y1} to {x2},{y2}")
        crop = img.crop((x1, y1, x2, y2))
        crop.save(os.path.join(dest_dir, name))
        
    print("Success")

except Exception as e:
    print(f"Error: {e}")
