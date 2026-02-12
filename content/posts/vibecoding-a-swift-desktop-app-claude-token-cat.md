---
title: Vibecoding a Swift Desktop App - Claude Token Cat
date: 2026-02-12
---

I built a desktop application named Claude Token Cat.

</br>

### It is my first vibe coding experience with Claude Code

Without understanding the language (Swift) or framework (SwiftUI), I relied heavily on AI prompting.

### Even when features worked correctly, it was hard to immediately trust AI-generated code.

After every few commits, I periodically asked whether there were any memory leaks, inefficient logic, dead code, or missed edge cases. There were no critical issues, but these prompts led to meaningful improvements. For example, it caught a retain cycle in `TokenUsageManager`'s Task blocks where `[weak self]` was missing, and fixed an edge case where `CancellationError` wasn't handled separately, causing a brief error flash in the UI. (`511849c`)

- I did use AI to improve AI-generated code, but I still wonder how to fully verify AI-generated code. Then again, even human-written code is never 100% perfect — maybe I'm chasing an unrealistic ideal. I'll just need to respond quickly when bugs are found later.
- After fix commits, I recorded the lessons in memory or `CLAUDE.md` to avoid repeating similar mistakes.

Occasionally, when I spotted obviously irrational logic, I asked the AI why it wrote it that way and requested improvements.

```swift
private static func formatSubscriptionType(_ type: String?) -> String? {
        guard let type = type else { return nil }
        // e.g. "claude_pro" -> "Pro", "claude_max" -> "Max"
        if let last = type.split(separator: "_").last {
            return last.prefix(1).uppercased() + last.dropFirst()
        }
        return type
    }
```

Thanks to the comment, I could easily see that this code is error-prone when the subscription type has an unexpected value or format.

```swift
private static func formatSubscriptionType(_ type: String?) -> String? {
        switch type {
        case "claude_pro": return "Pro"
        case "claude_max": return "Max"
        default: return nil
        }
    }
```

### App feature implementation was done quickly within 48 hours, but the pixel art took much longer.

Whether it was my lack of prompting skill, the AI-generated pixel art was lacking in quality. I just intuitively knew the pixel art cat animation looked unnatural, but I don't know exactly "why" it looked unnatural, unlikely the UI bug which I can explain explicitly well.

After several rounds of back-and-forth, I ended up creating all the pixel art from scratch myself in [Piskel](https://www.piskelapp.com/). (It took a long time to create natural movements because I didn't fully understand how cats move. The pixel art still isn't perfectly natural even now...) The only thing AI handled was converting `.piskel` files to Swift code via a Python function.

#### Trivial aside - The possibilities of bash scripts and Python were endless.

- Problem: I wanted to take consistent screenshots of the 5 cat icon animations in the menu bar, but doing it manually with a mouse had its limits.
- Solution: Automated region-based screenshots (png) and screen recordings (gif) with a bash script (`screenshot.sh`).
- Problem: I wanted to preview how the Swift sprites — just arrays of 0s and 1s — would look as pixel images before building.
- Solution: Used Python (`preview_sprites.py`) to parse sprite data from the Swift source and render them as consistent PNGs. App icon generation (`generate_icon.py`) was also handled with Python.

Easily installable via Homebrew 😺
`brew install --cask lylaminju/tap/claude-token-cat`
