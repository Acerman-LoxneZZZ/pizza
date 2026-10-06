"""Package the self-contained FARO presentation, without development assets."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
output = root.parent / "FARO-presentation.zip"
files = [root / name for name in (
    "index.html", "style.css", "site.js", "pizza-scene.js", "pizza.glb",
    "README.md", "ATTRIBUTION.md", "model-info.json",
)]
files.extend((root / "fonts").glob("*.woff2"))
files.extend((root / "fonts").glob("*-OFL.txt"))
files.extend((root / "media").glob("*.png"))
files.extend(root.parent / "vendor" / name for name in ("gsap.min.js", "ScrollTrigger.min.js"))
for path in files:
    if not path.is_file():
        raise FileNotFoundError(path)

with ZipFile(output, "w", ZIP_DEFLATED, compresslevel=6) as archive:
    for path in files:
        archive.write(path, path.relative_to(root.parent).as_posix())
    archive.writestr("START-HERE.txt", """FARO — presentation website

Run an HTTP server from this folder:
    python -m http.server 8765 --bind 127.0.0.1
Open http://127.0.0.1:8765/scene-3d/

No npm installation or Blender is needed to view the site.
For static hosting, upload both scene-3d/ and vendor/ and open scene-3d/.
The menu and prices are examples; the basket saves a local text summary.
No real payment or order transmission is connected.
Keep scene-3d/ATTRIBUTION.md and the font license notices when distributing.
Editable source: https://github.com/Acerman-LoxneZZZ/pizza
""")
with ZipFile(output, "r") as check:
    bad_file = check.testzip()
    if bad_file:
        raise RuntimeError(f"Archive failed integrity check: {bad_file}")
print(f"Created {output.name}: {output.stat().st_size:,} bytes, {len(files) + 1} files")
