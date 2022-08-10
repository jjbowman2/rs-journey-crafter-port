# ![](/public/img/Crafting_icon.png) Runescape Journey Crafter

This app is inspired by my personal journey managing a mountain sized todo list during my runescape journey. While just any todo list app would have sufficed, I thought this project would have been a fun way to learn a handful of technologies.

[View the site live](https://rs-journey-crafter.vercel.app)

## Tech Stack

The current instance of this project is built on the [T3 stack](https://init.tips) with tRPC, Next.js, and Prisma. Chakra-ui is used for the component base as well as a number of other dependencies.

## Goals

Although this is very much a work-in-progress, it is a passion project of mine that I envision being pretty feature rich. In its current build, there are a lot of disabled components and placeholders for future features. I will likely enhance the application in this order:

-   [ ] Adding prerequisite tasks
    -   [ ] Sorting and viewing tasks by optimal completion order (topographical sort)
-   [ ] Smart suggestion for Basic Task creation
    -   Ex) A user enter "Drag", then it could suggest 1) Complete Dragon Slayer 2) Obtain Dragon War Hammer 3) Obtain Dragon Hunter Lance, etc...
-   [ ] Journey Templates - A set of tasks commonly done by experienced players (Optimal Barrows Glove Guide)
-   [ ] Account Sync - This may be a stretch, but it would be nice to have integration with either a RS API or build a Runelite plugin to update the tasks as they are completed.
