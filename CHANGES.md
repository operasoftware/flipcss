## 2020.10.22, Version 0.2.9

*   Add callback to fs.write() function in cli entrypoint

## 2014.08.01, Version 0.2.8

*   Fix #9, add option for not swapping the words "left" and "right" in URLs.
*   Add option for not swapping the words "left" and "right" in selectors.

## 2014.07.25, Version 0.2.7

*   Fix #8, add support for swapping :before and :after.

## 2014.03.18, Version 0.2.5

*   Fix #7, add command line-option for clean-only.

## 2013.01.14, Version 0.2.4

*   Fix bug in 0.2.3, where meta comments with extra text were not removed by clean().

## 2013.01.14, Version 0.2.3

*   Add support for extra text in a meta comment, e.g. "/* !rtl-only some extra text */"

## 2012.06.28, Version 0.2.2

*   Add command line support.

## 2012.06.20, Version 0.2.1

*   Fix bug where value swapping fails for rules with extra keywords (like "!important").
*   Refactor tests: Get rid of most fixtures.

## 2012.06.20, Version 0.2.0

*   Add support for rtl to ltr. Adding of CSS direction rule is moved from
    flip() to clean(). If both functions are used together, this should be
    backwards compatible. If you only use flip(), be aware that
    "direction:ltr;" will no longer be added to the output of this function.

## 2012.06.18, Version 0.1.4

*   Fix bug: Direction specific rules where swapped, but they are now left
    unchanged.
*   Refactor tests.

## 2012.06.15, Version 0.1.3

*   Change swapping of the words "left" and "right" to be more conservative:
    Instead of swapping all instances, the ones that are part of other words
    (e.g. "copyright") are now left alone. When separated by other characters
    than letters and digits, they will be swapped.
*   Make lib remove newlines before meta comments (e.g. "/*!direction-ignore*/"),
    which may have been added by e.g. CSS compilers.

## 2012.06.14, Version 0.1.2

*   Fix bug where negative horizonal values in background positions where not
    recognized, causing vertical values to be flipped instead. Also, skip
    negative values.

## 2012.06.07, Version 0.1.1

*   Fix bug where e.g. values in linear gradients were mistaken for background
    position values.
