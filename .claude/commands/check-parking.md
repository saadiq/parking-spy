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
2. **Some parking (left of driveway)** — VALID. A few car-lengths of curb between the bus stop and the driveway. This zone fits a few cars. Hardest zone to judge — look for a car-length gap adjacent to parked cars using the nearest car as a size reference.
3. **Driveway** — NO PARKING. A curb cut directly in front of / to the right of the SUV typically parked in zone 2. Do not count this gap as a spot. NOTE: There is sometimes a car parked IN the driveway, pulled up toward the building — this is NOT a curb-parked car. Ignore it when evaluating zone 4.
4. **One spot (between driveway and hydrant zone)** — VALID. Fits exactly ONE car at the curb between the driveway curb cut and the hydrant no-parking zone. Binary check: is there a car parked AT THE CURB here or not? Look at street level for a car between the driveway and the hydrant/branches. Do not confuse a car parked in the driveway (set back toward the building) with a car in this zone (parked at the curb, at street level).
5. **Hydrant zone (center of image, currently full of branches)** — NO PARKING. Fire hydrant area, currently obscured by fallen branches with yellow caution tape.
6. **One spot (far right, in front of tree)** — VALID. Fits exactly ONE car to the right of the hydrant zone. Binary check: is there a car in front of the large tree, to the right of the hydrant zone? If yes, occupied.

**How to orient:** First locate the SUV in zone 2 (left side of near curb). The driveway is immediately to its right. Zone 4's car is immediately right of the driveway. The hydrant/branches are next. Zone 6's car is to the right of the hydrant, in front of the tree trunk.

Only 3 valid zones on the near side. Zones 4 and 6 each fit exactly one car (simple yes/no). Zone 2 fits a few cars and requires checking for gaps.

### Far side (opposite side — right and top of image, cars appear smaller)

The entire far side curb is valid parking. No known hydrants, driveways, or restrictions. Any visible break in the line of parked cars is likely a real spot.

## How to judge spot size

- **Use cars already in the scene as scale references.** Pick the closest car to a potential gap as your ruler. If another car that size could fit in front of or behind it, it's a spot.
- For the **near side zones 4 and 6**: these are binary — one car fits. Is a car there or not?
- For the **near side zone 2**: use the nearest parked car as a ruler. If a car-length gap exists adjacent to a parked car, flag it.
- For the **far side**: be aggressive. Any visible gap in the line of parked cars that could fit a car (using nearby cars as reference) is a spot. Do NOT default to "no spot" on the far side — false negatives are just as bad as false positives.
- Do NOT count: hydrant zones, driveways, bus stops, crosswalks, or gaps too small for a car.
- "Err on the side of no spot" applies mainly to restricted near-side zones (hydrants, driveways, bus stops), NOT to clear gaps on unrestricted curb.
