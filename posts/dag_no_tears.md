---
layout: page
title: DAG with No Tears
description: paper summary
---

**NOTE:**  This post assumes you are acquainted with graphical models

[link to the paper](https://arxiv.org/abs/1803.01422)

### Motivation
One of the challenging problems in graphical models is estimating the structure of Bayesian Networks (DAG's) given data. This is called [structure learning](https://ermongroup.github.io/cs228-notes/learning/structure/). The main idea is to construct a DAG (Directed Acyclic Graph) given the data. Until now this problem has been viewed as a combinatorial optimisation (due to the acyclicity constraint) and thus most of the solutions involved some kind of search over DAG space.  

### Novelty
The Authors propose a method which essentially converts this combinatorial problem into a continuous one.  
The important contribution is characterising the acyclicity constraint as a smooth function. Which converts the problem into a constrained optimisation problem.

### Problem Formulation
**Given:** n d-dimensional data points $$\{x_{i}\}^{i=n}_{i=1}$$, or a matrix $$X_{n \times d}$$.  
The DAG can be represented by a 2D matrix with adjacency graph W. So, our   
**Aim:** To fill up a matrix $$W_{d \times d}$$ such that it would result in a DAG  
**Objective:** 
\$$min_{W \in R^{d \times d}} F(W)$$

$$subject \; to \; h(W) = 0$$

Here,
* $$h$$ is the function which captures acyclicity constraint
* $$F$$ is the score function

### Acyclity Constraint
This is probably the most important part of the paper. They provide a nice expression for the function $$h$$
\$$h(W) = tr(e^{W \circ W}) - d$$

And $$h(W) = 0 $$ if and only if $$W$$ is a DAG  
Where,  
* $$\circ$$ denotes hadamard product (Element wise multiplication)
* $$tr$$ is trace

### Score Function and Optimisation
[WIP]

### To-Do
- [ ] Score function and optimisation
- [ ] Algorithm
- [ ] Thresholding
- [ ] grammar check