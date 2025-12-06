---
author: Ritesh Goru
pubDatetime: 2020-04-05T10:00:00Z
title: Procrastination and Scheduling
slug: procrastination-and-scheduling
featured: true
draft: false
tags:
  - non-technical
  - productivity
  - reinforcement-learning
description: A unique view on procrastination through the lens of Markov Decision Processes and reinforcement learning.
---

## Procrastination

![procrastination](/assets/procrastination.jpg)

[Procrastination](https://en.wikipedia.org/wiki/Procrastination) - There's no one who haven't heard about it. Almost all of us procrastinate.

There's been a lot of psychological research going on, and researchers correlate this behaviour with various other disorders like ADHD, stress, anxiety etc. It might be a symptom indicating a mental disorder.

Nevertheless, some perfectly healthy people still do it. In this post I will provide a different view of procrastination.

## Table of contents

## Why People Procrastinate

[This](https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator?language=en) Ted Talk by [Tim Urban](https://waitbutwhy.com/) explains it better in simpler terms. So, It's a must watch.

![wait but why?](/assets/why_procrastinate.png)

I wouldn't go into the details of the talk but here are some key take aways from the talk:

1. It introduces **_Instant Gratification Monkey_** which disrupts the rational decision making.
2. The **_Panic monster_** which comes and scares away the monkey when we are an $\epsilon$ away from the deadline.

## The MDP Model

For those of you who are acquainted with Reinforcement Learning must have heard about [MDP's](https://en.wikipedia.org/wiki/Markov_decision_process).

So, Basically what I say is The actions we take in life and the outcomes that we experience can be modelled as a MDP (Here, it isn't exactly Markovian but let's approximate it for simplicity)

![MDP description](/assets/MDP.png)

An MDP can be described with the tuple $(s, a, r)$. Where:
- $s$ is the current state
- $a$ is the action taken
- $r$ is the reward gained (can be positive or negative)

Let's assume the transitions are deterministic since, we are mostly under control of what we do.

Now, the paths we take must be such that the reward is maximised:

$$R = \sum^{t=n}_{t=0} \gamma^{t} \cdot r_{t}$$

Where:
- $\gamma$ is the discount factor

Our objective is to maximise the Total Reward ($R$), over the path we take, ie over $(s_{1}, s_{2}, ..s_{n})$, $(a_{1}, a_{2}, ..a_{n})$.

In our life the $\gamma$ has a lot of importance.

$\gamma$ is:
- 0 for chronic procrastinators. So they just enjoy the current moment lazing off and reward is the pleasure they take from lazing off
- Higher for workaholics or non-procrastinators

So I think the main Idea is to understand, what is it that we could do to increase our $\gamma$?

