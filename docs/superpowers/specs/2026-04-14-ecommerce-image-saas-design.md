# E-commerce Image SaaS Design

Date: 2026-04-14
Status: Draft approved for planning
Audience: Product, design, engineering

## 1. Overview

This project is a standard SaaS product for AI-powered image generation and background removal, with the first release optimized for e-commerce sellers while remaining usable by broader creator and marketing audiences.

The product will provide two primary workflows:

1. Generate product visuals from text prompts
2. Upload a product image to remove or replace its background

The first release targets the global market with a product experience biased toward overseas users. The initial business model is free credits plus manual plan activation rather than self-serve online payments.

## 2. Goals

### Product goals

1. Help e-commerce sellers produce usable product images quickly
2. Combine image generation and background editing into one coherent workflow
3. Present as a real SaaS platform rather than a pair of isolated utilities
4. Build a provider-agnostic AI architecture so image capabilities can evolve without major rewrites

### MVP business goals

1. Validate demand for AI-assisted product image creation
2. Track usage and conversion from free users to manually activated paid plans
3. Learn which workflows are most valuable: text-to-image, background removal, or background replacement

### Non-goals for the first release

1. Self-serve checkout and subscription billing
2. Team collaboration and advanced workspace permissions
3. Public developer API
4. Bulk processing pipelines
5. Deep analytics and BI reporting

## 3. Target users

### Primary audience

E-commerce sellers who need product-ready visuals such as:

1. Clean white-background product shots
2. Scene-based marketing images
3. Promotional assets for seasonal campaigns
4. Fast iterations for marketplace and social commerce listings

### Secondary audience

1. Marketing teams creating commerce visuals
2. Content creators producing simple product-focused images

The product should stay broadly usable, but first-release UX decisions should prioritize seller workflows over open-ended creative experimentation.

## 4. Core user journeys

### Journey A: Text-to-product image

1. User signs in and lands on the dashboard
2. User opens the image generation workflow
3. User enters a product-oriented prompt and optional style settings
4. System creates an asynchronous AI task
5. User sees progress and receives a completed result
6. Result is stored in the library for preview, download, and reuse
7. Credits are deducted on success

### Journey B: Upload and remove background

1. User signs in and opens the background workflow
2. User uploads a product image
3. User chooses remove background or replace background
4. System creates an asynchronous AI task
5. User receives a finished transparent or recomposed image
6. Result is stored in the library
7. Credits are deducted on success

### Journey C: Upgrade path

1. User approaches or exceeds free limits
2. System shows current usage and plan constraints
3. User requests a higher plan through a contact or activation form
4. Admin manually upgrades the account or adds credits

## 5. Product architecture

The system will be built as three top-level surfaces:

1. Marketing website
2. Authenticated user workspace
3. Admin console

These surfaces sit on top of a shared backend built with Next.js, Supabase, PostgreSQL, object storage, and an internal AI task orchestration layer.

### Architectural principles

1. Product workflows should feel unified even if different AI providers are used underneath
2. AI operations must be asynchronous and tracked through durable task records
3. Credits, plans, and task outcomes must be auditable
4. Provider integrations must be replaceable behind a stable internal contract

## 6. Frontend information architecture

### Marketing website

1. Landing page
2. Use cases page
3. Pricing page
4. Authentication pages

#### Landing page

The landing page should lead with two clear promises:

1. Generate product visuals with AI
2. Remove or replace backgrounds in minutes

Primary calls to action should send users directly into the product's two main workflows.

#### Use cases page

This page should focus on commerce-oriented examples:

1. White-background marketplace images
2. Lifestyle scene product visuals
3. Seasonal promotions
4. Social commerce assets

#### Pricing page

Even without online payment in the first release, pricing should present the product as a mature SaaS offering:

1. Free plan with limited credits
2. Pro plan available through manual activation

### Authenticated workspace

Main navigation:

1. Dashboard
2. Generate
3. Background
4. Library
5. Credits
6. Settings

#### Dashboard

The dashboard is the action-oriented home screen. It should display:

1. Primary entry cards for generation and background workflows
2. Remaining credits
3. Recent tasks
4. Recent outputs from the library

#### Generate

This page supports text-to-image creation tuned for commerce use cases. Inputs should include:

1. Product prompt
2. Style or aesthetic options
3. Aspect ratio
4. Background style
5. Number of outputs

#### Background

This page supports:

1. Background removal
2. Pure-color background replacement
3. Scene-based background replacement

The UX should emphasize "create a usable product image" rather than a generic cutout utility.

#### Library

The library is the long-term retention layer of the product. Users should be able to:

1. Preview outputs
2. Filter by task type
3. Download assets
4. Re-run edits from prior settings
5. Reuse prompts and parameters

#### Credits

This page should show:

1. Current plan
2. Total free credits
3. Consumed credits
4. Remaining credits
5. Upgrade request path

#### Settings

This page should include:

1. Profile settings
2. Basic workspace preferences
3. Default generation preferences

### Admin console

The admin console should provide:

1. User management
2. Task management
3. Plan activation and credit adjustment
4. AI provider monitoring

## 7. Data model

The system should use a relational model centered on durable task and credit records.

### Core entities

#### users

Stores identity, status, role, and active plan assignment.

#### workspaces

Represents the owning container for assets and activity. Even if the first release is single-user oriented, this abstraction should exist to avoid future migration pain.

#### plans

Defines product entitlements such as:

1. Included credits
2. Allowed providers or model tiers
3. Output limits
4. Concurrency limits

#### credits_ledger

Stores immutable credit transactions rather than only a derived balance. This supports:

1. Auditing
2. Manual adjustments
3. Refunds or compensation
4. Usage analysis

#### ai_tasks

Stores all asynchronous AI operations with fields for:

1. Task type
2. Input payload
3. Status
4. Provider
5. Cost metadata
6. Failure reason
7. Output references

Supported task types for the first release:

1. image_generation
2. background_removal
3. background_replacement

#### assets

Stores uploaded inputs and generated outputs, including format, dimensions, owner, source task, and storage location.

#### prompts

Stores normalized prompt and parameter data for reusability and future optimization.

## 8. AI provider architecture

The product requires a provider-agnostic architecture from the start.

### Layer 1: Product task layer

The product expresses intent in internal business terms:

1. Generate product image
2. Remove background
3. Replace background

This layer must not know about provider-specific payload shapes.

### Layer 2: Orchestration layer

This layer decides which provider should process the task based on:

1. Task type
2. Plan entitlements
3. Cost or quality rules
4. Reliability rules
5. Fallback behavior

Example orchestration behavior:

1. Text-to-image defaults to Provider A
2. Background removal defaults to Provider B
3. Failures can route to a secondary provider
4. Free plans may be limited to a default provider tier

### Layer 3: Provider adapter layer

Each provider should implement a common contract, for example:

1. Create task
2. Poll task status
3. Retrieve results
4. Normalize errors

This allows the system to swap or add providers without rewriting product workflows.

### Task execution model

All AI operations should be asynchronous. The expected flow is:

1. Frontend submits a request
2. API validates and creates an ai_task
3. Orchestrator selects a provider
4. Provider adapter executes the job
5. Results are persisted as assets
6. Task status is updated
7. Frontend polls or subscribes for completion

This model is required to support slow providers, retries, fallback routing, and future expansion.

## 9. Plans, permissions, and credits

### Roles

The first release requires two roles:

1. user
2. admin

### Plan model

The first release should support:

1. Free plan
2. Manually activated Pro-style plan

### Entitlement controls

Plans may limit:

1. Total monthly credits
2. Accessible providers or model classes
3. Outputs per task
4. Concurrent active tasks

### Credit policy

The default policy should be to deduct credits only when a task succeeds. Failed tasks should not consume credits. If a task partially succeeds, the platform may either deduct proportionally or treat the task as atomic; for the first release, the simpler atomic rule is preferred unless provider behavior makes that impractical.

### Admin actions

Admins must be able to:

1. Grant credits
2. Upgrade plans
3. Compensate failed user experiences
4. Disable abusive or problematic accounts

## 10. Error handling and resiliency

Errors should be mapped into product-level categories.

### Input errors

Examples:

1. Empty prompt
2. Unsupported image format
3. File too large
4. Invalid dimensions

These should be validated on both frontend and API boundaries with explicit, user-readable feedback.

### Entitlement errors

Examples:

1. No remaining credits
2. Current plan cannot use a requested capability
3. Account disabled

These must guide the user toward the next action, such as requesting a plan upgrade.

### Provider errors

Examples:

1. Timeout
2. Upstream rejection
3. Invalid provider payload
4. Unsafe or filtered generation result

Raw upstream details should be captured in internal logs but translated into normalized product-facing errors.

### System errors

Examples:

1. Database write failures
2. Storage failures
3. Callback or polling failures

The system should avoid leaving tasks permanently stuck in processing. A failed terminal state is preferable to ambiguous hanging status.

## 11. Testing strategy

The first release should include automated coverage at four levels.

### Unit tests

Cover:

1. Credit calculations
2. Permission checks
3. Task state transitions
4. Provider selection rules

### Integration tests

Cover:

1. Task creation through persistence
2. Upload and asset registration flow
3. Result writeback flow
4. Admin credit adjustments

### Provider contract tests

Each provider adapter must prove that it maps into the common internal interface correctly.

### End-to-end tests

At minimum, cover:

1. User registration and first login
2. Successful text-to-image flow
3. Successful background removal flow
4. Credit exhaustion handling
5. Admin plan activation flow

## 12. Security and compliance baseline

The first release should include:

1. Authenticated access to user assets and tasks
2. Row-level access control for user-owned data
3. Basic upload validation and storage hygiene
4. Auditability for credits and admin adjustments
5. Provider secret management through secure server-side environment configuration

This release does not aim to complete a formal enterprise compliance program, but core access control and operational safety must be present from day one.

## 13. Recommended implementation boundaries

To keep the next implementation plan focused, the first delivery slice should include:

1. Marketing landing page and auth
2. Dashboard with two primary workflow entry points
3. Text-to-image task flow
4. Background removal task flow
5. Unified task and asset persistence
6. Free credits and manual admin upgrades
7. Minimal admin console for users, tasks, and credits

The following should be deferred:

1. Self-serve payments
2. Team collaboration
3. Public API
4. Bulk operations
5. Advanced analytics

## 14. Open product decisions already resolved

The design assumes the following decisions are settled:

1. Product type: standard SaaS
2. Audience mix: mixed audience, first release biased to e-commerce sellers
3. Primary workflows: both text-to-image and upload-based background editing
4. AI architecture: multi-provider abstraction from the start
5. Market priority: global with overseas-first product posture
6. Monetization: free credits plus manual plan activation
7. Stack: Next.js, Supabase, PostgreSQL

## 15. Summary

This product should launch as a focused e-commerce image workspace rather than a generic AI image toy or a pair of separate tools. The winning structure is a task-centered SaaS that combines image generation and background editing under one product model, with durable task records, a reusable asset library, auditable credits, and a provider-agnostic AI orchestration layer.

That structure supports the first business goal of validating demand quickly, while also preserving the architectural flexibility needed for future plans, payments, collaboration, and provider expansion.
