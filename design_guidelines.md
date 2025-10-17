# Design Guidelines: Offer Letter Automation System

## Design Approach

**Selected Framework:** Material Design principles with modern productivity app aesthetics
**Rationale:** This is a utility-focused document automation tool requiring clarity, efficiency, and professional polish. Material Design's structured approach to forms, hierarchy, and feedback states aligns perfectly with the workflow-driven nature of offer letter generation.

## Core Design Principles

1. **Professional Minimalism** - Clean, distraction-free interface that prioritizes task completion
2. **Workflow Clarity** - Clear visual progression from login → data entry → submission
3. **Form Excellence** - Exceptional form design with clear labels, helpful hints, and validation states
4. **Trust Through Design** - Professional aesthetics that inspire confidence in document generation

---

## Color Palette

### Light Theme (Primary)
- **Primary Brand:** 220 90% 56% (Professional blue - buttons, links, active states)
- **Primary Hover:** 220 90% 48% (Darker blue for interactions)
- **Background:** 0 0% 100% (Pure white)
- **Surface:** 220 14% 96% (Light gray for cards and elevated elements)
- **Border:** 220 13% 91% (Subtle borders for form inputs)
- **Text Primary:** 220 9% 15% (Near-black for headings and labels)
- **Text Secondary:** 220 9% 46% (Medium gray for helper text)
- **Success:** 142 71% 45% (Green for success states)
- **Error:** 0 84% 60% (Red for validation errors)
- **Warning:** 38 92% 50% (Amber for alerts)

### Semantic Colors
- **Input Focus:** Primary brand color with 20% opacity ring
- **Disabled State:** 220 9% 70% (Grayed out elements)
- **File Upload Zone:** 220 90% 97% (Light blue tint background)

---

## Typography

### Font Families
- **Primary:** 'Inter' (Google Fonts) - Clean, modern, excellent for forms and UI
- **Monospace:** 'JetBrains Mono' - For displaying file names, technical data

### Type Scale
- **H1 (Page Titles):** text-3xl font-semibold (30px, 600 weight)
- **H2 (Section Headers):** text-2xl font-semibold (24px, 600 weight)
- **H3 (Card Titles):** text-lg font-medium (18px, 500 weight)
- **Body Text:** text-base font-normal (16px, 400 weight)
- **Small Text:** text-sm (14px) - Helper text, captions
- **Labels:** text-sm font-medium (14px, 500 weight)
- **Button Text:** text-base font-medium (16px, 500 weight)

---

## Layout System

### Spacing System
**Core Units:** 2, 4, 6, 8, 12, 16, 24 (Tailwind units)
- **Component Padding:** p-6 or p-8 for cards
- **Section Spacing:** mb-8 or mb-12 between sections
- **Form Field Spacing:** space-y-6 for vertical form fields
- **Button Spacing:** px-6 py-3 for primary actions

### Grid Structure
- **Auth Pages (Login/Signup):** Centered card with max-w-md (448px)
- **Dashboard:** Full-width with max-w-6xl container (1152px)
- **Form Layout:** Single column with max-w-3xl (768px) for optimal reading/input

### Responsive Breakpoints
- Mobile: Single column, full-width cards with p-4
- Tablet (md:): Maintain single column forms, increase padding to p-6
- Desktop (lg:): Full layout with p-8, side margins

---

## Component Library

### Authentication Pages (Login/Signup)

**Layout:**
- Centered vertically and horizontally (min-h-screen flex items-center justify-center)
- Background: Subtle gradient from white to surface color
- Card: rounded-xl shadow-lg with p-8
- Logo/Brand at top of card
- Form fields with consistent spacing (space-y-6)
- Primary CTA button full width
- Secondary link (switch between login/signup) centered below

**Form Inputs:**
- Height: h-12
- Border: 2px solid border color
- Rounded: rounded-lg
- Focus state: ring-2 ring-primary with ring-offset-2
- Error state: border-error with red text below
- Placeholder: text-secondary

### Dashboard (Home Page)

**Header Section:**
- Full-width with border-b
- Contains: Logo, User name/avatar, Logout button
- Height: h-16, px-6
- Shadow: shadow-sm for subtle elevation

**Main Content Area:**
- Two-column layout for desktop (lg:grid-cols-3):
  - Left: Resume upload card (lg:col-span-1)
  - Right: Form fields (lg:col-span-2)
- Mobile: Stacked single column
- Gap: gap-8

### Resume Upload Component

**Container:**
- Card with surface background
- Border: 2px dashed border color
- Rounded: rounded-xl
- Padding: p-8
- Hover state: bg-file-upload-zone transition

**Upload Zone:**
- Icon: Upload cloud icon (64px size) in primary color
- Text: "Click to upload or drag and drop"
- Accepted formats: "PDF or DOC (max 10MB)" in text-secondary
- Uploaded file display: Flex row with file icon, name (monospace font), size, remove button

### Form Fields

**Section Organization:**
- Group related fields: Personal Info, Job Details, Compensation, Dates
- Each section with H3 heading and mb-6
- Fields in cards with surface background

**Input Variants:**
- **Text Inputs:** Standard height h-12, full-width
- **Text Areas:** (Role & Responsibilities) min-h-32 with resize-vertical
- **Date Picker:** With calendar icon, formatted display
- **Select Dropdowns:** Chevron icon, same height as inputs
- **Signature Field:** Special treatment with dotted underline style

**Field Labels:**
- Above input with mb-2
- Required indicator: Red asterisk
- Helper text below in text-secondary with text-sm

### Buttons

**Primary (Submit):**
- Background: Primary brand color
- Hover: Primary hover color
- Text: White
- Size: px-8 py-3
- Rounded: rounded-lg
- Font: font-medium
- Full width on mobile, auto width on desktop with min-w-48

**Secondary (Cancel/Reset):**
- Border: 2px solid border color
- Text: Text primary
- Hover: bg-surface
- Same sizing as primary

**Icon Buttons:** (File remove, etc.)
- Size: h-8 w-8
- Rounded: rounded-full
- Icon only, no text
- Hover: bg-surface

### Alert Components

**Success Alert:**
- Background: Success color at 10% opacity
- Border-left: 4px solid success color
- Icon: Checkmark circle
- Rounded: rounded-lg
- Padding: p-4
- Position: Fixed top-4 right-4, slides in from right

**Error Alert:**
- Same structure as success but error color
- Icon: X circle
- More prominent with shadow-lg

**Auto-dismiss:** 5 seconds with progress bar animation at bottom

---

## Interactive States

### Hover States
- Buttons: Darken by 8% with smooth transition (200ms)
- Cards: Subtle shadow increase (shadow-md to shadow-lg)
- Form inputs: Border color intensifies slightly

### Focus States
- All interactive elements: 2px ring in primary color with 2px offset
- Remove browser default outline
- Ensure keyboard navigation is visually clear

### Loading States
- Submit button: Show spinner, disable, reduce opacity to 60%
- Full-page loader during webhook call: Centered spinner with "Processing..." text
- Skeleton loaders: Not needed for this simple form flow

### Disabled States
- Reduce opacity to 50%
- Cursor: not-allowed
- No hover effects

---

## Animations

**Minimal Animation Strategy:**
- Page transitions: 200ms fade
- Button interactions: 150ms ease-out
- Alert slide-in: 300ms ease-out from right
- Form validation: 200ms shake for errors
- File upload progress: Smooth progress bar fill

**No Animations:**
- Avoid complex scroll animations
- No decorative motion graphics
- Keep CPU usage minimal

---

## Micro-Interactions

- **Successful upload:** Checkmark animation + file info display
- **Form validation:** Real-time validation on blur, error shake on submit
- **Webhook response:** Smooth transition to success/error alert
- **File drag-over:** Border color change + background tint

---

## Accessibility

- **ARIA labels** on all form inputs
- **Focus management:** Trap focus in modals, clear focus order
- **Color contrast:** Minimum 4.5:1 for all text
- **Keyboard navigation:** Tab through all interactive elements
- **Screen reader:** Announce errors, success states, loading states
- **Form validation:** Associate errors with inputs via aria-describedby

---

## Images

**No hero images or decorative photography** - This is a utility application focused on efficiency. Visual elements are limited to:
- **Icons:** Use Heroicons for consistency (upload, checkmark, error, calendar, user icons)
- **Logo placeholder:** Top-left of dashboard, simple wordmark or icon
- **File type indicators:** Small icons for PDF/DOC in upload area

The design relies on excellent typography, spacing, and color to create visual interest rather than imagery.