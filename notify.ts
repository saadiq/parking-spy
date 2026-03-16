export {}

const webhookUrl = process.env.SLACK_WEBHOOK_URL
if (!webhookUrl) {
  console.error("SLACK_WEBHOOK_URL not set in environment")
  process.exit(1)
}

const message = process.argv[2]
if (!message) {
  console.error("Usage: bun run notify.ts <message>")
  process.exit(1)
}

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: message }),
})

if (!response.ok) {
  console.error(`Slack webhook failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

console.log("Slack notification sent")
