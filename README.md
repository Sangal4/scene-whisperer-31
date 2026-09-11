# Story Weaver AI

Build a polished, high-fidelity web application prototype for an AI-powered animation production platform.

IMPORTANT: This is currently a PRODUCT VISUALIZATION / UX PROTOTYPE, not a production implementation. Do not build real Blender integration, MCP servers, LLM APIs, authentication backends, rendering pipelines, databases, or other complex backend functionality. Use realistic mock data and simulated interactions so the product can be explored like a real application.

The core product idea:

A YouTube creator or animation creator can create animated episodes without manually operating Blender. The creator maintains a reusable library of characters, backgrounds, props, voices, and other assets. They create a project, divide it into episodes, divide episodes into scenes, and then communicate with an AI "Animation Director" through natural language.

The AI agent understands the scene, selects/uses the creator's predefined assets, conceptually operates Blender, creates the scene, and produces a rendered preview. The user can then give additional instructions and iterate.

The key product promise is:

"Describe the scene. Your AI agent builds it."

The application should feel like a modern creative production studio rather than a generic SaaS dashboard or traditional video editor.

========================================

VISUAL STYLE
========================================

Create a premium, modern, cinematic creative-tool interface.

Use:

Dark theme as the default

Deep charcoal/near-black background

Slightly lighter panels and cards

Subtle borders

Soft rounded corners

Premium typography

Strong visual hierarchy

Minimal but elegant accent color

Subtle gradients where appropriate

High-quality thumbnails and visual placeholders

Spacious layout

Professional SaaS/editor aesthetic

The product should feel inspired by the quality level of modern creative products such as:

Linear

Figma

Notion

Runway

Frame.io

modern AI creative tools

But do NOT copy their UI.

Avoid:

Generic admin dashboards

Excessive gradients

Excessive glassmorphism

Overly colorful interfaces

Huge hero sections inside the application

Cluttered controls

Traditional complicated video-editor layouts

The interface should make the user feel that AI is doing the difficult production work for them.

========================================
2. MAIN APPLICATION STRUCTURE

Create a persistent left sidebar after login.

Sidebar:

Brand/logo:
"Studio"

Navigation:

Home
Projects
Episodes
Library

Library subsection:
Characters
Backgrounds
Props
Audio & Voices

Below that:

Templates
Settings

At the bottom:
User profile/avatar
Name
Account menu

Use appropriate simple icons.

The main application should support this conceptual navigation:

Login
→ Dashboard
→ Project
→ Episode
→ Scene Workspace

========================================
3. LOGIN SCREEN

Create a beautiful minimal login page.

Layout:

Left side: branding / visual illustration related to animation creation

Right side: login card

Headline:

"Create stories. Let AI animate them."

Subtitle:

"Build animated videos from your own characters, worlds, and ideas."

Primary button:

"Continue with Google"

Secondary text:
"By continuing, you agree to our Terms and Privacy Policy."

Do not implement real Google authentication. The button should simply simulate login and navigate to the dashboard.

========================================
4. DASHBOARD / HOME

After login, show the main dashboard.

Header:

"Good morning, Jatin"
or use a generic creator name if necessary.

Subtitle:

"Continue creating something."

At the top right:

"+ New Project"

Main section:

"Recent Projects"

Display attractive project cards with thumbnails.

Example projects:

"Life at 30"
"Professor Maya"
"Delhi Stories"
"The Last Signal"

Each project card should show:

Thumbnail

Project name

Short description

Number of episodes

Last edited time

Status

Example:

Professor Maya
Educational animation series
6 episodes
Edited 2 hours ago

Show cards in a clean responsive grid.

Below:

"Continue Working"

Show the most recently edited episode/scene as a larger card.

Example:

Professor Maya
Episode 03 — The Missing Signal
Scene 07
"Continue editing"

Also include a small "Quick Start" section:

New Project
Import Assets
Create Character
Create Episode

========================================
5. PROJECT CREATION

When clicking "+ New Project", show a project creation modal/page.

Fields:

Project name
Description
Visual style
Default aspect ratio
Default scene style

Example:

Project Name:
"Professor Maya"

Description:
"An educational animated YouTube series."

Style options:

2D Cartoon

3D Stylized

Anime

Storybook

Cinematic

Custom

Aspect ratio:

YouTube 16:9

Shorts 9:16

Square 1:1

Primary button:

"Create Project"

After creating, navigate to the Project page.

========================================
6. PROJECT PAGE

The project page should feel like the central workspace for a series.

Header:

Project title
"Professor Maya"

Actions:
Share
Settings
Export

Project summary:

"An educational animated series about science and technology."

Show a project cover/thumbnail.

Then:

"Project Assets"

Small previews of:

Characters

Backgrounds

Props

Voices

Then:

"Episodes"

Display episode cards in a grid/list.

Example:

Episode 01
"The First Signal"
8 scenes
Complete

Episode 02
"Into the Lab"
11 scenes
Complete

Episode 03
"The Missing Signal"
7 scenes
In progress

Episode 04
"The Experiment"
Draft

Each episode should show:

Thumbnail

Episode number

Title

Number of scenes

Duration

Status

Last edited

Primary action:

"+ New Episode"

========================================
7. LIBRARY

The Library is extremely important.

This is where creators maintain reusable assets that AI can use when generating scenes.

Create a polished asset management interface.

Top header:

"Asset Library"

Subtitle:

"Everything your AI can use inside your stories."

Tabs:

All
Characters
Backgrounds
Props
Audio
Voices

Search bar:

"Search assets..."

Filter button.

Grid cards with large visual previews.

CHARACTER EXAMPLES:

Maya
Teacher
Female
Stylized 3D

Rahul
Student
Male
Stylized 3D

Alex
Student
Male
Stylized 3D

For each character card show:

Large image

Name

Type

Style

Tags

Small usage count

BACKGROUND EXAMPLES:

Classroom
Science Lab
Delhi Street
Apartment
Office
Rooftop

PROP EXAMPLES:

Desk
Laptop
Whiteboard
Phone
Coffee Mug
Books

VOICE EXAMPLES:

Maya Voice
English
Female
Warm

Rahul Voice
English
Male
Young

Include:

"+ Add Asset"

The UI should make it obvious that these assets are reusable and can later be attached to scenes.

========================================
8. EPISODE PAGE

When opening an episode, display:

Breadcrumb:

Professor Maya
/
Episode 03
/
The Missing Signal

Header:

"The Missing Signal"

Status:
"In Progress"

Actions:

Preview
Export
Episode Settings

Main section:

"Scenes"

Display scenes vertically or in a clean grid.

Example:

Scene 01
"Maya enters the classroom"

Scene 02
"Students gather around"

Scene 03
"Maya notices the broken device"

Scene 04
"Close-up of the device"

Scene 05
"Maya explains the problem"

Scene 06
"Students investigate"

Scene 07
"The signal returns"

Each scene card should show:

Scene thumbnail

Scene number

Scene title

Duration

Number of characters

Number of assets

Status

Statuses:
Draft
Generating
Ready
Needs Review

Primary action:

"+ Add Scene"

========================================
9. SCENE WORKSPACE — MOST IMPORTANT SCREEN

This is the centerpiece of the entire product.

Make this screen significantly more polished and detailed than the others.

The goal is to visualize what it feels like for a creator to communicate with an AI agent that operates the animation environment.

Desktop layout:

LEFT:
Navigation / scenes

CENTER:
Large scene preview

RIGHT:
AI Agent panel

BOTTOM:
Scene assets + timeline / scene controls

LEFT PANEL

Show:

Episode 03
"The Missing Signal"

Scenes:

01 Classroom entrance
02 Students gather
03 Broken device
04 Device close-up
05 Maya explains
06 Investigation
07 Signal returns

Highlight currently selected Scene 03.

Each scene displays:

Tiny thumbnail

Scene number

Status indicator

CENTER — SCENE VIEWER

Large cinematic preview area.

Show a fictional rendered scene:

A stylized classroom with:

Maya

Two students

Classroom background

Broken electronic device on desk

Use a high-quality visual placeholder rather than actual Blender output.

Above viewer:

Scene 03
"The Broken Device"

Viewer controls:

Play
Pause
Rewind
Timeline position
Fullscreen

Below or around preview:

Camera:
Medium Shot

Duration:
08.4 sec

Resolution:
1920 × 1080

FPS:
24

RIGHT PANEL — AI AGENT

This is the most important UX element.

Header:

"Animation Director"

Status indicator:

● Online

Subtitle:

"Describe what should happen. I'll build the scene."

Conversation example:

USER:

"Make Maya walk toward the desk, look at the device, and pick it up."

AGENT:

"I'll update the scene using Maya, the Classroom background, and the Broken Device."

Then show an expandable action list:

✓ Identified Maya
✓ Identified Classroom background
✓ Identified Broken Device
✓ Positioned Maya
✓ Added walking animation
◉ Updating camera
○ Rendering preview

Use visually pleasing progress states.

Then:

"Preview ready"

Show small rendered thumbnail.

Agent message:

"Maya now walks to the desk, picks up the device, and looks at it. I kept the medium camera shot."

Buttons:

"Preview"
"Apply"

Below the conversation:

Chat input:

"Describe what should happen..."

Send button.

Also provide small prompt suggestions:

"Change camera"
"Move character"
"Add an object"
"Change lighting"
"Change dialogue"

The AI should feel like a creative collaborator rather than a chatbot.

========================================
10. SCENE ASSET PANEL

At the bottom of the Scene Workspace, show:

"Scene Assets"

Attached assets displayed as cards/chips.

Characters:

[Maya]
[Student 1]
[Student 2]

Background:

[Classroom]

Props:

[Broken Device]
[Desk]

Voice:

[Maya Voice]

Each asset should have:

Thumbnail

Name

Type

Remove button

Include:

"+ Add Asset"

When clicking it, show a library-style asset selector.

The selector should allow users to choose from predefined assets.

Example:

Choose Character

[Maya]
[Rahul]
[Alex]

Choose Background

[Classroom]
[Lab]
[Office]

Choose Prop

[Device]
[Laptop]
[Books]

This makes the relationship between the Library and Scene extremely clear.

========================================
11. TIMELINE / SCENE CONTROLS

At the bottom of the scene workspace create a lightweight timeline.

Do NOT make it look like Premiere Pro or After Effects.

Keep it simple.

Show:

00:00 ───── 02s ───── 04s ───── 06s ───── 08s

Tracks:

Maya
Student 1
Device
Camera
Audio

Use simple blocks to represent actions.

Example:

Maya:
Walk → Stop → Pick Up

Camera:
Medium → Medium → Close

Audio:
Dialogue

The purpose is visualization, not professional manual animation editing.

========================================
12. BLENDER / AGENT ACTIVITY

Create a small "Agent Activity" section accessible from the scene workspace.

This should visually communicate that the agent is operating Blender in the background.

Example:

Agent Activity

● Connected to Blender

Recent actions:

12:41
Scene opened

12:42
Loaded Classroom environment

12:42
Added Maya

12:43
Added Broken Device

12:43
Configured camera

12:44
Generated animation

12:44
Rendering preview

Status:

"Rendering scene preview..."

Add a subtle progress bar.

This is intentionally simulated UI.

Do NOT implement actual Blender connectivity.

========================================
13. SCENE GENERATION STATES

Create visual states for:

Idle

"Ready to create"

Generating

"Agent is building your scene..."

Show:

Scene planning

Asset loading

Animation

Camera

Rendering

Ready

"Scene ready"

Needs revision

"The agent needs your direction"

Failed

"Something went wrong"

Provide:

"Try Again"

These states should make the underlying agent workflow understandable to a first-time user.

========================================
14. NEW SCENE EXPERIENCE

When creating a new scene, show a simple guided interface.

Title:

"Create Scene"

Fields:

Scene name

"What happens in this scene?"

Use a large natural-language input:

"Maya walks into the classroom, notices the broken device on the desk, picks it up and asks the students what happened."

Then:

Characters
Select from library

Background
Select from library

Props
Select from library

Voice
Select from library

Button:

"Create Scene with AI"

The resulting experience should transition into the Scene Workspace.

========================================
15. AI AGENT INTERACTION DESIGN

The AI interaction should be the defining UX pattern.

The user should be able to issue natural instructions such as:

"Make Maya enter from the left."

"Change the camera to a close-up."

"Add the laptop from my library."

"Make the students look surprised."

"Move the desk closer to Maya."

"Use the laboratory background."

"Make the lighting more dramatic."

"Have Maya say: 'Something is wrong.'"

"Make this scene 5 seconds longer."

"Show the device from a close-up."

The interface should make it visually obvious that the user is directing the scene and the AI is performing the technical work.

========================================
16. PROJECT + ASSET RELATIONSHIP

Make this conceptual relationship clear through UI:

PROJECT
→ EPISODES
→ SCENES
→ SCENE ASSETS

GLOBAL LIBRARY
→ CHARACTERS
→ BACKGROUNDS
→ PROPS
→ VOICES
→ AUDIO

AI AGENT
→ understands scene
→ selects assets
→ creates/modifies scene
→ renders preview
→ receives feedback
→ revises scene

The product should visually communicate this hierarchy.

========================================
17. SAMPLE DATA

Use realistic sample data throughout the prototype.

Main project:

Professor Maya

Description:

"An educational animated YouTube series."

Characters:

Maya
Rahul
Alex

Backgrounds:

Classroom
Science Lab
Delhi Street
Maya's Apartment

Props:

Broken Device
Laptop
Books
Whiteboard
Phone

Episode:

Episode 03 — The Missing Signal

Scenes:

Maya enters the classroom

Students gather

Maya notices the broken device

Close-up of device

Maya explains the problem

Students investigate

The signal returns

========================================
18. INTERACTIONS

Since this is only a prototype, implement lightweight front-end interactions.

The following should work visually:

Login button → Dashboard

New Project → Project creation

Project card → Project page

Episode card → Episode page

Scene card → Scene Workspace

Library tabs → filter displayed assets

Add Asset → asset selector

Selecting asset → add to scene

AI chat → append simulated agent responses

"Generate" → simulated generation state

"Preview" → change scene state to ready

Scene navigation → switch selected scene

Dashboard navigation → change pages

Settings can be a simple placeholder page

Use mock state/local state only.

Do NOT create:

real auth

real payments

real database

real AI calls

real Blender integration

real MCP integration

real video rendering

real file storage

real collaboration backend

========================================
19. RESPONSIVENESS

Primary design target:

Desktop 1440 × 900.

The Scene Workspace should be optimized for desktop because creators will primarily use it as a production environment.

Still make dashboard/library pages reasonably responsive.

For mobile, simplify rather than attempting to preserve the entire scene editor.

========================================
20. DESIGN DETAILS

Use consistent:

8px spacing system

Rounded cards

Subtle borders

Compact icons

Clear typography hierarchy

High-quality image placeholders

Hover states

Active states

Loading states

Empty states

Buttons should be clear and purposeful.

Primary actions:

New Project

New Episode

Add Asset

Add Scene

Create Scene with AI

Generate

Preview

Export

Avoid filling every section with buttons.

========================================
21. OVERALL PRODUCT FEEL

The final result should make someone immediately understand:

"I have a library of characters and assets."

"I create an episode."

"I break it into scenes."

"I tell the AI what should happen."

"The AI builds the scene."

"I see the result."

"I give feedback."

"The AI modifies it."

"I eventually export the finished animation."

The most important part of the prototype is NOT the dashboard.

The most important part is the transition from:

Natural language instruction
→ AI interpretation
→ asset selection
→ scene creation
→ Blender activity
→ rendered preview
→ user feedback
→ revised scene.

Make that loop visually compelling and easy to understand.

The final prototype should feel like a serious startup product that could eventually become an AI-native animation studio.

Again: prioritize UX, visual design, and realistic simulated interactions. Do not spend effort on production backend architecture at this stage.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e43ff6c-6cc5-4fad-b8c5-d0705710d0ad).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
