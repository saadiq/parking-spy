import { writeFileSync } from "fs"
import { join } from "path"
import { createRingClient, findFrontCamera } from "./ring-helpers"

const ringApi = createRingClient()

try {
  const cameras = await ringApi.getCameras()
  if (cameras.length === 0) {
    console.error("No cameras found on this Ring account")
    process.exit(1)
  }

  const camera = findFrontCamera(cameras)
  console.log(`Capturing snapshot from: ${camera.name}`)

  const snapshot = await camera.getSnapshot()
  const outPath = join(import.meta.dir, "snapshot.png")
  writeFileSync(outPath, snapshot)
  console.log(`Snapshot saved to ${outPath}`)
} catch (err) {
  console.error("Failed to capture snapshot:", err)
  process.exit(1)
} finally {
  ringApi.disconnect()
  process.exit(0)
}
