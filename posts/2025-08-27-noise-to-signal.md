---
id: 2025-08-27-noise-to-signal
title: "Noise → Signal in Logging"
slug: noise-to-signal
date: 2025-08-27
tags: [logging, typescript, testing]
description: "A practical path from log noise to actionable signal."
canonical: "https://example.com/blog/noise-to-signal/"
draft: false
---

Logging should help you *act*, not just collect noise. In this post we walk through
a minimal, typed approach to going from noisy logs to actionable signal.

## Why logs get noisy

- No clear levels or categories
- No consistent structure
- Missing context (request id, user id, feature flag)
- Excessive debug logs left in production

## A minimum viable structure

```ts
type Log = {
  level: "info" | "warn" | "error";
  msg: string;
  ctx?: Record<string, string | number | boolean>;
};

Keep fields consistent and normalize message formats. Then add sampling and centralized sinks (with privacy-first defaults).
