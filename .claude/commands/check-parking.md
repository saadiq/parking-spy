---
description: Check Ring camera for open parking spots on a specified side
allowed-tools: Bash, Read
---

Check for open parking spots on the $ARGUMENTS side of the street.

## Instructions

1. First validate that "$ARGUMENTS" is either "near" or "far". If not, respond with: "Usage: /check-parking <near|far>" and stop.

2. Run `bun run capture.ts` to pull a fresh snapshot from the Ring camera.

3. Read the file `snapshot.png` to view the camera image.

4. Analyze the image using the street layout below.

5. If a spot is found:
   - Run `bun run notify.ts "Parking spot open on the $ARGUMENTS side! [description of location relative to landmarks]"`
   - Respond with: "SPOT FOUND: [brief description]"

6. If no spot is found:
   - Respond with: "No spots on $ARGUMENTS side."

## Street Layout & Parking Zones

The camera is a Ring doorbell mounted on a stoop, looking out at a Brooklyn residential street. A large tree with branches partially obscures the center of the frame.

### Near side (camera/stoop side — left and bottom of image, cars appear larger)

Reading left to right in the image:

1. **Bus stop (far left corner)** — NO PARKING.
2. **Some parking (left of driveway)** — VALID. A few car-lengths of curb between the bus stop and the driveway.
3. **Driveway** — NO PARKING. A curb cut. Do not count a gap here as a spot.
4. **One spot (between driveway and hydrant zone)** — VALID. Room for roughly one car between the driveway and the hydrant no-parking zone.
5. **Hydrant zone (center of image, currently full of branches)** — NO PARKING. Fire hydrant area, currently obscured by fallen branches.
6. **One spot (far right)** — VALID. Room for roughly one car to the right of the hydrant zone, near the right edge of the frame.

Only 3 valid zones on the near side. Each fits ~1 car except zone 2 which fits a few.

### Far side (opposite side — right and top of image, cars appear smaller)

The entire far side curb is valid parking. No known hydrants, driveways, or restrictions. Look for any sedan-length gap (~15-18 feet) between parked cars or empty curb stretches.

## What counts as an open spot

- A gap between parked cars at least one sedan-length (~15 feet)
- An empty stretch of curb in a VALID zone
- Do NOT count: hydrant zones, driveways, bus stops, crosswalks, or gaps too small for a car
- When in doubt, err on the side of "no spot" — false alerts are worse than missed spots
