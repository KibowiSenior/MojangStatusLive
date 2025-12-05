# Mojang Server Status Monitor - Design Guidelines

## Design Approach: Data Dashboard with Gaming Aesthetic

**Selected Approach:** Design System (Monitoring Dashboard)  
**Justification:** This is a utility-focused, information-dense application prioritizing real-time data visibility, clarity, and quick comprehension over visual storytelling. The primary goal is immediate status awareness and historical trend analysis.

**Key Design Principles:**
- Information hierarchy: Status indicators > Uptime metrics > Response times > Graphs
- Scan-ability: Users should grasp all service statuses within 2 seconds
- Gaming aesthetic through typography and spacing, not overwhelming visual effects
- Clean, distraction-free monitoring experience

---

## Core Design Elements

### A. Typography

**Primary Font:** "Press Start 2P" (Google Fonts) - Used sparingly for headers only to evoke Minecraft/retro gaming  
**Secondary Font:** "Inter" (Google Fonts) - All body text, metrics, and data displays

**Hierarchy:**
- Page Title: Press Start 2P, text-2xl (mobile) / text-3xl (desktop)
- Service Names: Inter Semi-Bold, text-lg
- Metrics (Uptime %): Inter Bold, text-3xl
- Response Times: Inter Regular, text-sm
- Body/Descriptions: Inter Regular, text-base
- Timestamps: Inter Regular, text-xs, muted

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8  
- Component padding: p-4 or p-6
- Section gaps: gap-4 or gap-6
- Margins between major sections: mb-8
- Container padding: px-4 (mobile), px-6 (desktop)

**Grid Structure:**
- Desktop: 2-column grid for service cards (grid-cols-1 lg:grid-cols-2)
- Each service card contains: Status badge + Service name + Metrics + Mini graph
- Full-width historical graph section below service cards
- Max container width: max-w-7xl mx-auto

**Responsive Breakpoints:**
- Mobile (base): Single column, stacked cards
- Tablet (md): Single column with wider cards
- Desktop (lg): 2-column grid for service cards

---

## C. Component Library

### 1. Header
- Full-width sticky header with semi-transparent dark background
- Page title (left-aligned): "MINECRAFT SERVER STATUS" in Press Start 2P
- Live indicator badge (right-aligned): Pulsing dot + "LIVE" text
- Last update timestamp below title
- Auto-refresh countdown timer (e.g., "Next check in 23s")

### 2. Service Status Cards
Each card displays:
- **Top row:** Service name + Status badge (Online/Down/Degraded)
- **Middle row:** Large uptime percentage (e.g., "99.8%") + Response time in ms
- **Bottom section:** Mini sparkline graph showing last 24h trends (20-30px tall)
- **Visual states:**
  - Online: Green accent border-left (border-l-4)
  - Down: Red accent border-left
  - Degraded: Yellow accent border-left
- Card background: Subtle dark surface with slight elevation
- Hover state: Subtle lift/shadow increase

### 3. Status Badges
- Pill-shaped badges with icon + text
- Online: Green background, checkmark icon
- Down: Red background, X icon
- Degraded: Yellow background, warning icon
- Font: Inter Medium, text-sm
- Padding: px-3 py-1

### 4. Metrics Display
- Large bold numbers for uptime percentages
- Small labels above metrics ("Uptime" / "Response Time")
- Grid layout for multiple metrics: grid-cols-2 gap-4
- Visual separator between metric groups

### 5. Historical Graph Section
- Full-width section below service cards
- Title: "24-Hour Historical Data"
- Tabbed interface or dropdown to switch between services
- Large interactive line graph (Chart.js or Recharts)
- X-axis: Time (hourly intervals)
- Y-axis: Uptime % or Response time
- Multiple lines for comparing services (color-coded)
- Tooltip on hover showing exact values
- Height: 300-400px on desktop, 250px on mobile

### 6. Footer
- Simple footer with minimal height
- "Data refreshes every 30 seconds" note
- Optional: Link to Mojang official status page
- Timestamp of last successful update

---

## D. Visual Treatment Guidelines

**Status Color System:**
- Online/Success: Minecraft green (#4ADE80 / green-400)
- Down/Error: (#EF4444 / red-500)
- Degraded/Warning: (#FBBF24 / yellow-400)
- Background: Dark surface (#1F2937 / gray-800)
- Card backgrounds: (#111827 / gray-900)
- Text primary: White (#FFFFFF)
- Text muted: (#9CA3AF / gray-400)

**Icons:**
- Use Heroicons (CDN link) for status indicators, refresh icons
- Checkmark circle (online), X circle (down), exclamation triangle (degraded)
- Refresh/sync icon for manual refresh button

**Animations (Minimal):**
- Pulsing animation on "LIVE" indicator dot only
- Smooth transitions on card hover (0.2s ease)
- Data refresh: Subtle fade-in when new data loads
- NO animations on graphs or status changes (instant updates for clarity)

**Graphs:**
- Use Chart.js library (CDN)
- Line charts with smooth curves
- Grid lines: Subtle gray (#374151)
- Data points visible on hover only
- Responsive and touch-friendly

---

## E. Data Visualization Principles

1. **Immediate Status Recognition:** Color-coded borders and badges allow 1-second status scan
2. **Trend Awareness:** Mini sparklines in each card show 24h trends at a glance
3. **Deep Dive Option:** Full historical graph for detailed analysis
4. **Real-time Feedback:** Live badge and countdown timer show active monitoring
5. **Performance Metrics:** Response times help identify degraded performance before full outages

---

## Images

**No images required** - This is a data-focused monitoring dashboard. The visual interest comes from:
- Typography contrast (gaming font + modern font)
- Status color coding
- Live data visualization through graphs
- Clean, purposeful layout

Replace any placeholder needs with iconography from Heroicons library.