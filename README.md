# KanFlow — Kanban Task Board

> A beautiful, responsive Kanban task manager built with vanilla HTML, CSS & JavaScript.

![KanFlow Preview](https://img.shields.io/badge/KanFlow-Live%20Demo-6366F1?style=for-the-badge&logo=kanban)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## ✨ Features

| Feature | Details |
|---|---|
| **3-Column Board** | Todo · In Progress · Completed |
| **Add Task** | Title, description, priority (High/Medium/Low), due date |
| **Edit / Delete** | In-place editing via modal, confirm-before-delete dialog |
| **Status Move** | Quick-move buttons on each card + drag-and-drop between columns |
| **Search** | Live search by title and description with text highlighting |
| **Filter** | Filter by priority and/or status; active filter chips shown |
| **Persistence** | All data saved in `localStorage` — survives page refresh |
| **Responsive** | Desktop 3-column grid · Tablet/Mobile single-column stacked layout |
| **UX States** | Empty state per column, no-results state, form validation |
| **Stats Bar** | Live task counts + animated progress bar |
| **Drag & Drop** | Native HTML5 drag-and-drop across columns |
| **Toasts** | Non-blocking status notifications (success / info / warning / error) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/kanflow-kanban.git
cd kanflow-kanban

# Open in browser (no build step required!)
open index.html
# or serve locally:
npx serve .
```

That's it — zero dependencies, zero build tools.

---

## 🏗️ Architecture & Component Structure

```
kanflow-kanban/
├── index.html   # Markup, semantic HTML5, ARIA labels, SEO meta
├── style.css    # Design system (CSS custom properties) + all component styles
├── app.js       # Application logic
└── README.md
```

### `index.html` — Structure
- **`<header>`** — Logo, search input, priority/status filter selects, "Add Task" button, active filter chips bar
- **`<div.stats-bar>`** — Live counts for each column + animated progress bar
- **`<main.board-container>`** — CSS Grid with three `<section.column>` elements
- **Task Modal** — Single modal reused for both create and edit
- **Delete Confirm Modal** — Safe delete with confirmation dialog
- **Toast Container** — Fixed positioned, stacked notifications

### `style.css` — Design System
- **CSS Custom Properties** (`--var`) for the entire token system: colors, radii, shadows, transitions, font stacks
- **Dark theme** with `rgba` layering, glassmorphism on the header
- **Component-scoped selectors** — no global class pollution
- **Responsive** with 3 breakpoints (`860px` tablet, `640px` mobile, `480px` small phone)

### `app.js` — State Management
```
state = {
  tasks[],          // Single source of truth — all task objects
  searchQuery,      // Live search string
  filterPriority,   // 'all' | 'high' | 'medium' | 'low'
  filterStatus,     // 'all' | 'todo' | 'inprogress' | 'completed'
  editingTaskId,    // null or id of task being edited
  deleteTaskId,     // null or id pending deletion
  dragTaskId,       // null or id of card being dragged
}
```

**Data flow** (unidirectional):
```
User Action → State Mutation → saveTasks() → renderBoard() → DOM
```

**Key functions:**
| Function | Role |
|---|---|
| `createTask(data)` | Prepends new task, saves, returns task |
| `updateTask(id, data)` | Finds + mutates in `state.tasks`, saves |
| `deleteTask(id)` | Filters out task, saves |
| `moveTask(id, newStatus)` | Status change, re-renders, shows toast |
| `getFilteredTasks()` | Pure filter — search + priority + status |
| `renderBoard()` | Full re-render of all 3 columns |
| `buildCardHTML(task)` | Returns card HTML string with highlighting |
| `initDragDrop()` | Wires up HTML5 drag-and-drop listeners |
| `initEvents()` | All other event delegation |

---

## 🎨 Design Decisions

### Why no framework?
The spec is a self-contained UI task. Vanilla JS keeps the codebase lean, instantly runnable, and easy to explain — while still demonstrating architectural discipline (state object, unidirectional data flow, pure filter function).

### Why event delegation?
Cards are dynamically rendered. Attaching listeners to a stable parent (`.board-container`) avoids memory leaks from orphaned listeners on re-render.

### Why a single re-render on every change?
With hundreds of tasks the DOM diff cost is negligible. It keeps the code simple and correct — no partial-update bugs.

### LocalStorage schema
```json
{
  "id": "ldfk3a72x",
  "title": "Design landing page",
  "description": "...",
  "priority": "high",
  "status": "todo",
  "dueDate": "2024-11-05",
  "createdAt": 1730000000000,
  "updatedAt": 1730000000000
}
```

---

## 📱 Responsive Breakpoints

| Viewport | Layout |
|---|---|
| `> 860px` | 3-column CSS Grid |
| `640–860px` | Single-column, full-width controls |
| `< 640px` | Compact header, hidden button labels, stacked form rows |
| `< 480px` | Minimal stats bar |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic elements, ARIA roles/labels, `draggable` API
- **CSS3** — Custom properties, Grid, Flexbox, `backdrop-filter`, `@keyframes`
- **Vanilla JS (ES2020)** — No dependencies, no build step
- **Google Fonts** — Inter + Outfit
- **LocalStorage** — Client-side persistence

---

## 📄 License

MIT © 2024 KanFlow
