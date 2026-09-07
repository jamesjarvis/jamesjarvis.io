---
{{ $name := replaceRE `^[0-9]{4}-[0-9]{2}-` "" .Name -}}
title: "{{ replace $name "-" " " | title }}"
date: {{ .Date }}
draft: true
slug: "{{ $name }}"
summary: ""
tags: []
aliases: []
---
