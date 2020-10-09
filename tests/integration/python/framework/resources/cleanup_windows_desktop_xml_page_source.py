#!/usr/local/bin/python3

"""
Simple utility script for cleaning up XML representing Windows Desktop application (page source).

It splits single line XML into multiple lines containing one XML tag each, and removes tags specified in TAGS_TO_REMOVE.

Usage:

1. When executing a test, log page source using:

self.log_page_source (in any page implementation - *Page.py file)

or

And I log page source (in any test definition - .feature file).

2. Prepare XML file containing only page source (one line), without any additional content,
e.g. call it: page_source.xml.

3. Call this script:

./cleanup_windows_desktop_xml_page_source.py < page_source.xml > page_source_cleaned.xml

Assumptions:

a) first line contains full path to Python interpreter (#!/usr/local/bin/python3),
b) it's executable (chmod a+x cleanup_windows_desktop_xml_page_source.py).

4. Open page_source_cleaned.xml in your favorite XML viewer and format it.
"""

import fileinput
import re

TAGS_TO_REMOVE = [
    ' AcceleratorKey=".*?"'
    ' AccessKey=\"\"',
    ' AutomationId=\"\"',
    ' CanMaximize=".*?"',
    ' CanMinimize=".*?"',
    ' CanMove=".*?"',
    ' CanResize=".*?"',
    ' CanRotate=".*?"',
    ' ClassName=".*?"',
    ' FrameworkId=".*?"',
    ' HasKeyboardFocus=".*?"'
    ' HasKeyboardFocus=".*?"',
    ' HasKeyboardFocus=".*?"',
    ' HelpText=""',
    ' IsAvailable=".*?"',
    ' IsContentElement=".*?"',
    ' IsControlElement=".*?"',
    ' IsEnabled=".*?"',
    ' IsKeyboardFocusable=".*?"',
    ' IsModal=".*?"',
    ' IsOffscreen=".*?"',
    ' IsPassword=".*?"',
    ' IsRequiredForForm=".*?"',
    ' IsSelected=".*?"',
    ' IsTopmost=".*?"',
    ' ItemStatus=\"\"',
    ' ItemType=\"\"',
    ' LocalizedControlType=".*?"',
    ' Orientation="None"',
    ' ProcessId=".*?"',
    ' RuntimeId=".*?"',
    ' WindowInteractionState=".*?"',
    ' WindowVisualState=".*?"'
]


def print_cleaned(single_tag_lines):
    for line in single_tag_lines:
        for tag_to_remove in TAGS_TO_REMOVE:
            line = re.sub(tag_to_remove, '', line)

        print(line)


def cleanup_xml():
    for xml_line in fileinput.input():
        single_tag_lines = xml_line.replace('><', '>\n<').split('\n')

        print_cleaned(single_tag_lines)


cleanup_xml()
