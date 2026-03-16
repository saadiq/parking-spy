import { createRingClient } from "./ring-helpers"

const ringApi = createRingClient()

try {
  const cameras = await ringApi.getCameras()
  console.log(`Found ${cameras.length} camera(s):`)
  for (const cam of cameras) {
    console.log(`  - ${cam.name}`)
  }
} catch (err) {
  console.error("Auth failed:", err)
  process.exit(1)
} finally {
  ringApi.disconnect()
}
