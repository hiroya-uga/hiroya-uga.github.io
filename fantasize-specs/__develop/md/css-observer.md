# CSS Observer Module

## Personal Delusion Draft, ${LastUpdate}

<dl>
<dt>This version:</dt>
<dd><a href="https://hiroyau.ga/fantasize-specs/css-observer.html">https://hiroyau.ga/fantasize-specs/css-observer.html</a></dd>
<dt>Editors:</dt>
<dd><a href="https://github.com/hiroya-u">Hiroya-u</a></dd>
<dt>Issue Tracking:</dt>
<dd><a href="https://github.com/hiroya-u/hiroya-u.github.io/blob/master/fantasize-specs/css-observer.html">GitHub Issues</a></dd>
</dl>


## Abstract

This module introduces the ability to  observe the status of elements, with new css properties and pseudo classes. For example, entering and leaving of elements the screen view area by scroll, and changing the `display` property of elements. The define of these are approach to enable  interaction implementation without JavaScript.

[TOC]

## 1. Introduction

## 2.The `observe` property

<div class="propdef">
<table>
<tbody>
<tr>
<th>Name:</th>
<td><dfn>observe</dfn></td>
</tr>

<tr>
<th>value:</th>
<td>none | [view | view-in | view-out | [ view-in-top || view-in-right || view-in-bottom || view-in-left || view-out-top || view-out-right || view-out-bottom || view-out-left ] ] || display</td>
</tr>

<tr>
<th>Initial:</th>
<td>none</td>
</tr>
</tbody>
</table>
</div>

## 3. Types of Observe

### 3.1 View Observe

### 3.2 Display Observe

## 4. Selectos

### 4.1 Pseudo-classes
