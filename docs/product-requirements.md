# Product Requirements

## Problem Statement

Homeowners consistently neglect seasonal maintenance tasks — not because they don't care, but
because there's no system reminding them what to do and when. Deferred maintenance leads to
costly repairs that could have been prevented. This app solves that with a personalized,
AI-generated seasonal care plan that adapts to each homeowner's specific home.

---

## Target User

**Primary:** Individual homeowners managing a single-family home.

**User profile:**
- Owns their home and is responsible for its upkeep
- Knows they should be doing seasonal maintenance but lacks a structured system
- Not necessarily a DIY expert — needs guidance on what tasks matter for their specific home
- Uses a smartphone and web browser regularly

---

## MVP Scope (v1)

### Feature 1: Home Profile Setup
The user describes their home so the AI can generate relevant recommendations.

**Fields:**
- Home type (single-family, condo, townhouse)
- Year built / approximate age
- Geographic region / climate zone (drives seasonal relevance)
- Square footage (optional)
- Special features (pool, hot tub, fireplace/chimney, deck/patio, basement, crawl space, septic system, well water, irrigation system, solar panels)

**Acceptance criteria:**
- User can create and edit their home profile at any time
- Profile changes trigger a prompt to regenerate the task plan
- Profile is saved to the user's account

---

### Feature 2: AI-Generated Seasonal Task Plan
Claude generates a personalized maintenance checklist based on the home profile.

**How it works:**
1. On first login (or after profile update), the backend sends the home profile to Claude
2. Claude returns a structured task plan with tasks organized by season
3. The plan is saved to the DB and displayed to the user

**Task structure:**
- Title (e.g., "Clean gutters and downspouts")
- Season (Spring / Summer / Fall / Winter)
- Category (Exterior, Interior, HVAC, Plumbing, Safety, Landscaping, etc.)
- Priority (High / Medium / Low)
- Description / why it matters
- Estimated effort (e.g., "1–2 hours, DIY")
- Applicable to this home? (Claude filters based on features — no pool tasks if no pool)

**Acceptance criteria:**
- Generated plan contains tasks relevant to the user's home features and region
- Tasks are not generic — they reference the home's specific attributes
- Plan is regenerated only when profile changes (cached otherwise)

---

### Feature 3: Seasonal Checklists
Users view their task plan organized by season and track completion.

**Views:**
- Current season tasks (default view)
- All seasons view
- Filter by category or priority

**Interactions:**
- Mark a task as complete
- Snooze a task (move to next occurrence)
- Add a custom task

**Acceptance criteria:**
- Tasks are visually organized by season
- Completed tasks are visually distinguished
- Progress is persisted across sessions

---

## Out of Scope for v1

- Push notifications / email reminders (v2)
- Service provider booking or recommendations
- Photo documentation of completed tasks
- Multi-property support
- Mobile native app (web-only for v1)
- Sharing plans with household members

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| User completes home profile setup | > 80% of signups |
| AI task plan generated successfully | > 95% of profile submissions |
| Tasks marked complete within a season | > 3 tasks per active user |
| User returns in the following season | > 40% retention |

---

## Future Roadmap (v2+)

- **Reminders** — Email or push notifications when a season begins with outstanding tasks
- **Task history** — Log of completed tasks with dates for home sale documentation
- **Service provider links** — Connect tasks to local contractor recommendations
- **Household sharing** — Invite a partner or property manager to share the dashboard
- **Mobile app** — Native iOS/Android for on-the-go task tracking
