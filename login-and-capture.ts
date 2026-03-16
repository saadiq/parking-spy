import { RingRestClient } from "ring-client-api/rest-client"
import { writeFileSync } from "fs"
import { join } from "path"
import * as readline from "readline"
import { updateEnvToken, createRingClient, findFrontCamera } from "./ring-helpers"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q: string): Promise<string> =>
  new Promise((resolve) => rl.question(q, resolve))

try {
  // Step 1: Authenticate with email/password + 2FA
  const email = await ask("Ring email: ")
  const password = await ask("Ring password: ")

  console.log("Authenticating with Ring...")
  const restClient = new RingRestClient({ email, password } as any)

  let auth: any
  try {
    auth = await restClient.getCurrentAuth()
  } catch {
    if ((restClient as any).promptFor2fa) {
      console.log((restClient as any).promptFor2fa)
      const code = await ask("2FA code: ")
      auth = await restClient.getAuth(code)
    } else {
      throw new Error("Auth failed")
    }
  }

  const refreshToken = auth.refresh_token
  console.log("\nAuth successful!")
  console.log("Token:", refreshToken.substring(0, 40) + "...")

  // Step 2: Save the token
  updateEnvToken(refreshToken)
  console.log("Token saved to .env")

  // Step 3: Test using the token immediately
  console.log("\nTesting token by fetching cameras...")
  const ringApi = createRingClient()

  try {
    const cameras = await ringApi.getCameras()
    console.log(`Found ${cameras.length} camera(s)`)

    if (cameras.length > 0) {
      const camera = findFrontCamera(cameras)
      console.log(`Capturing from: ${camera.name}`)
      const snapshot = await camera.getSnapshot()
      writeFileSync(join(import.meta.dir, "snapshot.png"), snapshot)
      console.log("Snapshot saved to snapshot.png!")
    }
  } catch (err) {
    console.error("Token test failed:", err)
    console.log("\nThe token from auth might already be consumed.")
    console.log("But the rotated token in .env should work for capture.ts")
  } finally {
    ringApi.disconnect()
  }
} catch (err) {
  console.error("Login failed:", err)
  process.exit(1)
} finally {
  rl.close()
}
