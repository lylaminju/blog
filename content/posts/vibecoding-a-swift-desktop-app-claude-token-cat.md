---
title: Vibecoding a Swift Desktop App - Claude Token Cat
date: 2026-02-12
category: Tech
---

I built a desktop application named [Claude Token Cat](https://github.com/lylaminju/claude-token-cat)</br>- A macOS menu bar app that visualizes your Claude usage with an animated pixel art cat

<img src="/assets/blog/claude-token-cat-menu.gif" alt="Claude Token Cat menu preview" style="width:min(420px,100%);height:auto;display:block;margin:1.25rem auto;" loading="lazy" decoding="async" />

### This was my first vibecoding experience with Claude Code

Without understanding the language (Swift) or framework (SwiftUI), I relied heavily on AI prompting.

### Even when features worked correctly, it was hard to immediately trust AI-generated code

- Every few commits, I asked whether there were any memory leaks, inefficient logic, dead code, or missed edge cases. I also codified this as a self-review checklist in the project's `CLAUDE.md` so the AI would perform these checks automatically before presenting code changes.
  - There were no critical issues, but these prompts led to meaningful improvements. For example, it caught a retain cycle in `TokenUsageManager`'s Task blocks where `[weak self]` was missing, and fixed an edge case where `CancellationError` wasn't handled separately, causing a brief error flash in the UI. ([`511849c`](https://github.com/lylaminju/claude-token-cat/commit/511849c412224541bd44b7ed863fd8a6a94424a1))

- I did use AI to improve AI-generated code, but I still wonder how to fully verify AI-generated code. Then again, even human-written code is never 100% perfect. Maybe I'm chasing an unrealistic ideal. I'll just need to respond quickly when bugs are found later.
  - After fix commits, I recorded the lessons in memory or `CLAUDE.md` to avoid repeating similar mistakes.

- Occasionally, when I spotted questionable logic, I asked the AI why it wrote it that way and requested improvements. (Also updated memory and `CLAUDE.md` to prevent similar future mistakes)

```diff
 private static func formatSubscriptionType(_ type: String?) -> String? {
-        guard let type = type else { return nil }
-        // e.g. "claude_pro" -> "Pro", "claude_max" -> "Max"
-        if let last = type.split(separator: "_").last {
-            return last.prefix(1).uppercased() + last.dropFirst()
-        }
-        return type
+        switch type {
+        case "claude_pro": return "Pro"
+        case "claude_max": return "Max"
+        default: return nil
+        }
     }
```

<div class="code-note">Changed from loose string parsing to explicit mapping, so unexpected formats now fail safely.</div>

### The app features came together within 3 days, but the pixel art took much longer

Whether due to my lack of prompting skill, the AI-generated pixel art just wasn't good enough. I could intuitively tell the cat animations looked unnatural, but I couldn't pinpoint exactly _why_, unlike a UI bug, which I can describe explicitly.

After several rounds of back-and-forth, I ended up creating all the pixel art from scratch myself in [Piskel](https://www.piskelapp.com/). (It took a long time to create natural movements because I didn't fully understand how cats move. The pixel art still isn't perfectly natural even now...) <br/> The only thing AI handled was converting `.piskel` files to Swift code via a Python function.

<img src="/assets/blog/cat-idle.gif" alt="idle" style="height: 40px"> <img src="/assets/blog/cat-jumping.gif" alt="jumping" style="height: 40px"> <img src="/assets/blog/cat-walking.gif" alt="walking" style="height: 40px"> <img src="/assets/blog/cat-tired.gif" alt="tired" style="height: 40px"> <img src="/assets/blog/cat-sleeping.gif" alt="sleeping" style="height: 40px">

Easily installable via Homebrew 😺

```bash
brew install --cask lylaminju/tap/claude-token-cat
```
