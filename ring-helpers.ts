import { RingApi } from "ring-client-api"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import type { RingCamera } from "ring-client-api"

const ENV_PATH = join(import.meta.dir, ".env")
const CAMERA_NAME = "front"

export function updateEnvToken(newToken: string) {
  let content = readFileSync(ENV_PATH, "utf-8")
  content = content.replace(
    /^RING_REFRESH_TOKEN=.*/m,
    `RING_REFRESH_TOKEN=${newToken}`
  )
  writeFileSync(ENV_PATH, content)
}

export function createRingClient(): RingApi {
  const refreshToken = process.env.RING_REFRESH_TOKEN
  if (!refreshToken) {
    console.error("RING_REFRESH_TOKEN not set in .env")
    process.exit(1)
  }

  const ringApi = new RingApi({ refreshToken })

  ringApi.onRefreshTokenUpdated.subscribe(({ newRefreshToken }) => {
    updateEnvToken(newRefreshToken)
    console.log("Refresh token rotated and saved to .env")
  })

  return ringApi
}

export function findFrontCamera(cameras: RingCamera[]): RingCamera {
  const camera = cameras.find((c) => c.name.toLowerCase().includes(CAMERA_NAME))
  if (!camera) {
    console.warn(`Camera "${CAMERA_NAME}" not found, falling back to: ${cameras[0].name}`)
    return cameras[0]
  }
  return camera
}
