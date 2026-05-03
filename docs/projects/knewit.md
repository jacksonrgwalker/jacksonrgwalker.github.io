---
tags: ["Gen AI", "Trivia", "History"]
layout: default
description: "A daily history trivia game generated from archival events."
title: "knewit"
order_index: 14
pinned: false
status: under construction
---

# knewit

[➡︎ Try out knewit! ⬅︎](http://knewit.jwalk.io/)

**knewit** turns "on this day" history into a daily trivia round.

It is built with HTMX, Django, and Bootstrap. Historical events come from Wikimedia's [On this day API](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day). An LLM writes the prompts and suggested answers from the source event text, then does loose answer checking so the game is playable without forcing exact string matches.
