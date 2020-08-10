# ![Icon](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/favicon.png)Perpetual Calendar Calender

------

## 1. Summary

-[万年历 Calender](#万年历-calender)
  -[一.Abstract](#一Abstract)
  -[二. Introduction] (#二 Introduction)
  -[三. Development Process] (#三 Development Process)
  -[Four Main Modules] (#四 Main Modules)
  -[V. Directory Structure] (#五 directory structure)
  -[六、Interface document](#六interface document)
    -[1. Calendar class](#1-calendar class)
    -[2. Dom class](#2-dom class)
  -[七、Debugging calendar] (#七Debugging calendar)
  -[Eight, Mobile Adaptation] (#八Mobile Adaptation)
  -[Nine, follow-up development] (#九后发展)
  -[X. Summary] (#十 SUMMARY)
  
------

## 2. Introduction

This perpetual calendar realizes the query of lunar calendar, Gregorian calendar, zodiac, 24 solar terms, domestic and international holidays, daily taboos (08-20 years), and holidays (14-16 years).
The perpetual calendar interface uses the Baidu calendar UI interface, the core JS code is manually written, and there is no dependent function library. The code adopts modular development, gulp construction, and HBuilder development. ***Another version of the desktop application is packaged with node-webkit for easy use. ***

![Preview](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/main.gif)

## Third, the development process

-[] Choose a calendar UI (after filtering, the UI of Baidu Calendar is relatively simple and beautiful).
-[] Write JavaScript core code to realize the query of date information parameters such as the lunar calendar and the Gregorian calendar.
-[] Integrate JavaScript code and UI interface together. During the period, DOM generation module (implementing template function), Event module, CSS module (switching theme and UI), core module of calendar algorithm, and imitation jQuery module (tool class) are involved.
-[] Use the gulp front-end construction tool to package and release the project.
-[] Write development documentation.

## Fourth, the main module
 -[x] Core algorithm module (calender.js)
 -[x] Imitating the jQuery module, providing tool functions (common.js)
 -[x] Dom module, generate HTML page structure (dom.js)
 -[x] Event module, various events in the calendar (event.js)
 -[x] Entry module (main.js)

## Five, directory structure

![Directory structure](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/construct.png)

## 6. Interface Documents

The calendar mainly has two global variables window.Calendar and window.DOM. The Calender class mainly implements calendar-related functions, and the DOM class implements the main jQuery functions.

### 1. Calendar class
![Directory structure](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/calendar_api.png)

### 2. Dom class
![Directory structure](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/dom_api.png)
## Seven, debugging calendar
![Directory Structure](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/console_show.png)
## Eight, mobile adaptation
```css
/* Small screen (tablet, greater than or equal to 768px) */
@media (max-width: 600px) {
.op-calendar-new-right{
display:none;
}
.c-container{
width:409px;
border-right: 2px solid #57abff;
}
}
```
![Directory Structure](https://raw.githubusercontent.com/mircode/calender/master/doc/html/img/app.gif)

## Nine, follow-up development
-[] Load between modules by require.
-[] CSS is compiled by CSS compilation tools such as Less.
-[] Only the simple media query style code was written, and the mobile terminal adaptation function needs to be improved and developed.
-[] The HTML structure is more demanding and does not support template replacement and theme replacement.

## 10. Summary
Due to time constraints, I can't write more detailed documents. I also hope that everyone will read the source code. Through this project, I found out my technical shortcomings again, and I need to continue learning...



------



Author Wei Guoxing
Email 1607646162@qq.com
April 13, 2016

