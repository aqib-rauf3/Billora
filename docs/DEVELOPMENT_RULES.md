# 💻 Billora Development Rules

> Version: 1.0

---

# Purpose

This document defines the engineering standards for the Billora codebase.

Every implementation must be clean, scalable, maintainable, and production-ready.

---

# Core Philosophy

Build software that is:

- Simple
- Maintainable
- Reusable
- Performant
- Secure
- Accessible
- Scalable

Avoid quick fixes and temporary solutions.

---

# Technology Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

Authentication

- Better Auth / NextAuth (depending on project decision)

Package Manager

- npm

---

# Project Structure

Organize code by feature.

Avoid dumping everything into one folder.

Keep components modular.

Separate:

- UI
- Business Logic
- Database
- Utilities
- Hooks
- Types

---

# TypeScript Rules

Always use TypeScript.

Avoid using:

- any
- unknown (unless necessary)

Prefer:

Interfaces

Types

Enums

Utility Types

Keep types reusable.

---

# React Rules

Prefer:

Server Components

Use Client Components only when required.

Keep components small.

Avoid large files.

---

# Component Rules

One responsibility per component.

Do not create giant components.

Split complex UI into reusable pieces.

---

# State Management

Prefer:

React State

Context

Server State

Avoid unnecessary global state.

---

# Styling Rules

Use Tailwind CSS.

Do not use inline styles unless absolutely required.

Maintain consistency.

Avoid duplicate utility combinations.

---

# Animation Rules

Use Framer Motion.

Follow MOTION_SYSTEM.md.

Do not invent new animation styles.

Animations must never reduce performance.

---

# API Rules

Every API should:

Validate input.

Return consistent responses.

Handle errors gracefully.

Never expose sensitive information.

---

# Database Rules

Use Prisma.

Never duplicate models.

Keep schema organized.

Always create migrations.

---

# Folder Naming

Use lowercase folders.

Examples

components

hooks

utils

types

services

features

---

# File Naming

Components

PascalCase

Example

InvoiceCard.tsx

Hooks

camelCase

Example

useInvoices.ts

Utilities

camelCase

Example

formatCurrency.ts

Types

camelCase

---

# Import Rules

Prefer absolute imports.

Avoid deeply nested relative imports.

Group imports logically.

---

# Code Quality

Every function should have one responsibility.

Avoid repeated code.

Extract reusable logic.

Keep functions readable.

---

# Error Handling

Never ignore errors.

Provide meaningful messages.

Handle:

API Errors

Validation Errors

Network Errors

Unexpected Errors

---

# Forms

Always validate input.

Support:

Loading

Success

Error

Disabled state

---

# Performance

Optimize:

Images

Fonts

Components

Rendering

Bundle Size

Lazy loading where appropriate.

---

# Accessibility

Support:

Keyboard navigation

ARIA labels

Focus management

Screen readers

Color contrast

Accessibility is required.

---

# Security

Never expose:

Secrets

API Keys

Tokens

Passwords

Validate every input.

Sanitize user data.

---

# Git Workflow

Small commits.

Clear commit messages.

Example:

feat: add invoice builder

fix: resolve navbar scroll issue

refactor: optimize dashboard cards

Avoid large unrelated commits.

---

# Documentation

Update documentation whenever:

Architecture changes

New features are added

Components are modified

Rules change

---

# Testing

Before every merge:

Run build.

Check TypeScript.

Verify responsiveness.

Test major user flows.

Fix all errors before completion.

---

# Pull Request Checklist

Every implementation must:

- Build successfully
- Follow CLAUDE.md
- Follow UI_RULES.md
- Follow MOTION_SYSTEM.md
- Reuse existing components
- Be responsive
- Be accessible
- Avoid breaking existing functionality

---

# Definition of Done

A task is complete only when:

- Code is clean
- Build passes
- No TypeScript errors
- No ESLint issues
- Responsive
- Accessible
- Animations are smooth
- Documentation updated
- Ready for production

---

# Final Rule

Always think like a senior software engineer.

Prefer long-term maintainability over short-term speed.

Every line of code should improve the overall quality of Billora.