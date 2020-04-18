---
layout: page
title: Role of Tracking in Stationary envts
description: paper summary
---

**NOTE:**  This post assumes you are acquainted with basics of Reinforcement Learning

### Introduction
All the learning Algorithms have the same objective - to reach the optima (usually in finite amount of time). However there can be multiple optima and multiple ways in which it can be done. We can directly have an algorithm converge to an optima or track the best possible solution. Depending upon the type of setting in which we are in the performance of both might vary. The usual trend is to use the former for stationary envts and the latter for non-stationary ones, But this paper by \textbf{Richard S. Sutton} emphasises the importance of tracking in general by showing 3 stationary cases (\textit{temporally coherent}) in which tracking outperforms a converging algorithm

### Setup
They start of assuming that the data comes from a system with evolving states and hence, the usual IID assumption doesn't hold. \textbf{Temporal Coherence} here refers to being similar in nearby time states. The first example which was demonstrated is Black and White world. It basically is a system with circular states $$(S0,S1...S19)$$ and a value 0 or 1 assigned (not exactly random (eg. $$S0-S10 \rightarrow 0$$ and $$S11-S19 \rightarrow 1$$)) to each state. The agent either observes the value or moves left or right (eg. $$p(observe) = 0.5$$, $$p(left) = 0.25$$, $$p(right) = 0.25$$). So, it's a random walk with random observation. 

### Objective
The objective is to predict the observed value ($$z_{t}$$) using a single scalar parameter and all the state values $$x_{t} = 1$$. The usual logistic regression loss over this yields an optima for prediction $$y_t = 0.5$$ (Due to the walk and observation distn and circular states over a enough observations). They show that when tracking is done ie the update $$w_{t+1} = w_{t} + \alpha\delta_{t}x_{t}; \delta_{t}=z_{t}-y_{t}$$ while execution (Not to be confused with usual training update rule), for a certain values of $$\alpha$$ they get lower loss compared to the optima given by usual training method. They claim that the choice of $$\alpha$$ depends on the degree of coherence in the envt (They show by changing the p(observe)), which sounds plausible. 

### Selfplay Example
The second example is 5$$\times$$5 Go which is a bit more complex than the previous case. A linear function is used to approximate the value function over states. Both the converging agent and the tracking agent are trained using $$TD(0)$$. They trained them offline, online using selfplay resp. Also the training favors the converging agent a bit interm's of experience, But still the tracking agent's wins are more than converging agent's. They also demonstrate an example in which even with increasing informativeness in input features the tracking agent learns a better strategy compared to the other one.

### Meta Learning and tracking
The final example tries to answer if a proper $$\alpha$$ could be learnt in first case. They use a meta-learning algorithm **IDBD** (Incremental delta-bar-delta) which parametrizes step-size $$\alpha$$ with a new parameter $$\beta$$, $$\alpha_{t}^{i} = e^{\beta_{t}^{i}}$$. And $$\beta$$ is updated using a meta-learning rate $$\mu$$. So, the update equation for the $$\beta$$ is $$\beta_{t+1}^{i}= \beta_{t}^{i} - \mu \frac{\partial L_{t}}{\partial \beta_{t}^{i}}$$. The derivative is evaluated using chain rule. Over all update rule still remains of the same form as before except we have a new term $$\beta$$ and it's update rule is modified as $$\beta_{t+1} = \beta_{t} + \mu \delta x_{t}h_{t}$$ where, $$h_{t} = \frac{\partial w_{t}}{\partial \beta_{t}}$$ and it is updated accordingly. They show that over a series of extensive experiments the $$\alpha$$ converges to a value around $$4.5-5$$ which is nearer to the one at which lowest loss is obtained in the first case. They have also constructed a case of non-coherent black and white problem and solved it with and without IBDB. In this case the effect of meta-learning is negligible they conclude by saying this observation might be useful for meta-learning research (may be a route to resolve methodological problem)

### My Views
1. While this paper presents an overall nice view on tracking and it's use in temporally coherent worlds, I however think using a simple black and white example to make the third point isn't enough.

2. Also, the given examples, both black and white and GO use only linear functions will this behaviour be same in the case of non-linear mappings? I think the substantial performance gain of using tracking over an converging solution decreases or the scenario might be even reversed incase of non-linear function spaces.

3. This paper made me think into a different direction of what meta-learning might indicate ie from function optimisation and differential equations point of view. In optimisation course we were taught the general update rule for optimising a function f (in non-stochastic setting) is given by $$x(k+1) = x(k)+a(k)h(x(k))$$ where $$a(k)$$ is the update step size and $$x(k)$$ is iterate. For a proper update step This is equivalent to finding the solution for the differential equation which is given by $$\dot{x}(t) = h(x(t))$$ with a certain intial value. Now the question arises what happens in meta learning? The update step would be the same but the sequence $$a(k)$$ itself has an update rule and hence follows a new differential equation. Can we make something out of that differential equation?

### To-Do
- [ ] Format properly
- [ ] Include Images