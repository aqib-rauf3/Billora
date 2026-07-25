# 🧩 Billora Component Guide

> Version: 1.0

---

# Purpose

This document defines the standards for every reusable UI component in Billora.

Every component must:

- Be reusable
- Be responsive
- Be accessible
- Be scalable
- Be production-ready

Never create duplicate components.

Always reuse existing components whenever possible.

---

# Component Philosophy

Every component should be:

- Simple
- Elegant
- Modular
- Predictable
- Easy to maintain

Consistency is mandatory.

---

# Naming Convention

Use clear names.

Examples:

Navbar

HeroSection

FeatureCard

PricingCard

DashboardCard

InvoiceTable

CustomerTable

SettingsForm

StatCard

Footer

ContactForm

Avoid generic names like:

Component1

Box

Section

Container2

---

# Folder Structure

Each reusable component should have:

- Component
- Types
- Variants
- Props
- Documentation (if needed)

Keep related files together.

---

# Navbar

Responsibilities:

- Navigation
- Theme consistency
- Responsive menu
- CTA buttons

Requirements:

Sticky

Glass effect on scroll

Smooth transitions

Responsive

Accessible

---

# Hero Section

Responsibilities:

- First impression
- Product value
- Primary CTA

Requirements:

Large headline

Supporting text

CTA buttons

Dashboard preview

Motion effects

Responsive layout

---

# Buttons

Types:

Primary

Secondary

Outline

Ghost

Danger

Loading

Icon

Rules:

Consistent sizing

Consistent radius

Accessible focus

Hover feedback

Loading state

Disabled state

---

# Cards

Cards should be reusable.

Examples:

Feature Card

Pricing Card

Dashboard Card

Invoice Card

Analytics Card

Rules:

Consistent spacing

Soft borders

Subtle shadows

Hover interaction

---

# Forms

Every form should support:

Validation

Loading

Error

Success

Disabled state

Reusable input components are required.

---

# Inputs

Create reusable inputs.

Examples:

Text

Email

Password

Number

Phone

Search

Textarea

Select

Checkbox

Radio

Switch

Date

Time

---

# Modals

Every modal should include:

Header

Content

Footer

Close action

Escape key support

Backdrop click support (when appropriate)

---

# Tables

Reusable table system.

Support:

Sorting

Filtering

Pagination

Selection

Responsive behavior

Empty state

Loading state

---

# Dashboard Widgets

Widgets should be reusable.

Examples:

Revenue

Invoices

Customers

Expenses

Charts

Recent Activity

Quick Actions

---

# Pricing Components

Pricing should use reusable cards.

Support:

Monthly

Yearly

Featured plan

Comparison

CTA

---

# Feature Components

Each feature should use the same card structure.

Include:

Icon

Title

Description

CTA (optional)

Hover animation

---

# Testimonials

Reusable testimonial card.

Support:

Avatar

Name

Role

Company

Rating

Quote

---

# FAQ

Reusable accordion.

Requirements:

Smooth animation

Keyboard support

Accessible

---

# Footer

Footer should contain:

Brand

Navigation

Resources

Social Links

Legal Links

Newsletter (optional)

Responsive layout

---

# Empty States

Reusable component.

Include:

Illustration

Message

CTA

---

# Error States

Reusable component.

Include:

Icon

Title

Description

Retry action

---

# Loading Components

Reusable:

Skeleton

Spinner

Progress bar

Loading button

---

# Notification Components

Support:

Success

Warning

Error

Info

Auto close

Manual close

---

# Charts

Reusable wrappers for:

Bar

Line

Area

Pie

Donut

Maintain consistent colors.

---

# Icons

Use a single icon library.

Maintain consistent size.

Never mix icon styles.

---

# Component Quality Checklist

Before creating a component:

- Is it reusable?
- Is it responsive?
- Is it accessible?
- Is it typed?
- Is it documented?
- Can another page reuse it?

If the answer is no, redesign it.

---

# Final Rule

Every new component must improve the overall design system.

Avoid one-off implementations.

Think in systems, not pages.