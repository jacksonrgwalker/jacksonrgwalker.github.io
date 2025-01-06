---
tags: ["Gen AI", "Trivia", "IndieHacking"]
layout: default
description: "A daily trivia game to test your knowledge"
title: "✅knewit"
order_index: 14
pinned: true
---

# ✅knewit

[➡︎ Try out knewit! ⬅︎](http://knewit.jwalk.io/)

**knewit** is a daily trivia game based on events that happened on this day in history. Test your knowledge and learn something new every day!

It's built with HTMX, django, and bootstrap. The daily historical events are fetched from Wikimedia's [On this day API](https://api.wikimedia.org/wiki/Feed_API/Reference/On_this_day). LLM's are used to generate the questions and answers from the event descriptions, as well as check the user submitted answers on-the-fly (for fuzzy matching).
