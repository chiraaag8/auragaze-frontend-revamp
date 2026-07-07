import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public/hero-scroll.mp4");

const sets = [
  {
    id: "desktop",
    dir: path.join(root, "public/hero-frames"),
    width: 1080,
    fps: 15,
    quality: 82,
  },
  {
    id: "mobile",
    dir: path.join(root, "public/hero-frames-mobile"),
    width: 720,
    fps: 12,
    quality: 80,
  },
];

function getDuration(file) {
  const result = spawnSync(ffmpegPath, ["-i", file], { encoding: "utf8" });
  const output = `${result.stderr || ""}${result.stdout || ""}`;
  const match = output.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  if (!match) throw new Error("Could not read video duration");
  const [, hours, minutes, seconds] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function extractSet({ id, dir, width, fps, quality }, duration) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const pattern = path.join(dir, "frame_%04d.webp");

  execFileSync(
    ffmpegPath,
    [
      "-y",
      "-i",
      input,
      "-an",
      "-vf",
      `fps=${fps},scale=${width}:-2:flags=lanczos`,
      "-c:v",
      "libwebp",
      "-quality",
      String(quality),
      "-frames:v",
      String(Math.ceil(duration * fps)),
      pattern,
    ],
    { stdio: "inherit" },
  );

  const frames = fs
    .readdirSync(dir)
    .filter((name) => name.startsWith("frame_") && name.endsWith(".webp"))
    .sort();

  const manifest = {
    id,
    count: frames.length,
    width,
    fps,
    duration,
    ext: "webp",
    basePath: id === "mobile" ? "/hero-frames-mobile" : "/hero-frames",
  };

  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));

  const totalSize = frames.reduce(
    (sum, name) => sum + fs.statSync(path.join(dir, name)).size,
    0,
  );

  console.log(
    `${id}: ${frames.length} frames @ ${width}px (${(totalSize / 1024 / 1024).toFixed(2)} MB)`,
  );

  return manifest;
}

if (!ffmpegPath) {
  throw new Error("ffmpeg-static binary not found");
}

if (!fs.existsSync(input)) {
  throw new Error(`Missing source video: ${input}`);
}

const duration = getDuration(input);
console.log(`Source duration: ${duration.toFixed(2)}s`);

const manifests = sets.map((set) => extractSet(set, duration));
fs.writeFileSync(
  path.join(root, "public/hero-frames-manifest.json"),
  JSON.stringify({ duration, sets: manifests }, null, 2),
);

console.log("Done.");
