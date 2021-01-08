#!/usr/local/bin/python3

"""
Simple utility script for cleaning up XML representing Windows Desktop application (page source).

It splits single line XML into multiple lines containing one XML tag each, and removes attributes specified
in ATTRIBUTES_TO_REMOVE.

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

For example (when formatted by your favorite XML viewer), before:

<?xml version="1.0" encoding="utf-16"?>
<Window AcceleratorKey="" AccessKey="" AutomationId="" ClassName="XLMAIN" FrameworkId="Win32" HasKeyboardFocus="False"
        HelpText="" IsContentElement="True" IsControlElement="True" IsEnabled="True" IsKeyboardFocusable="True"
        IsOffscreen="False" IsPassword="False" IsRequiredForForm="False" ItemStatus="" ItemType=""
        LocalizedControlType="window" Name="Book1 - Excel" Orientation="None" ProcessId="2244" RuntimeId="42.4261146"
        x="0" y="0" width="1936" height="1056" CanMaximize="True" CanMinimize="True" IsModal="False"
        WindowVisualState="Maximized" WindowInteractionState="ReadyForUserInteraction" IsTopmost="False"
        CanRotate="False" CanResize="False" CanMove="False" IsAvailable="True">
    <Window AcceleratorKey="" AccessKey="" AutomationId="" ClassName="NUIDialog" FrameworkId="Win32"
            HasKeyboardFocus="False" HelpText="" IsContentElement="True" IsControlElement="True" IsEnabled="True"
            IsKeyboardFocusable="True" IsOffscreen="False" IsPassword="False" IsRequiredForForm="False" ItemStatus=""
            ItemType="" LocalizedControlType="window" Name="env-227052-MicroStrategy for Office" Orientation="None"
            ProcessId="2244" RuntimeId="42.1705950" x="207" y="96" width="1522" height="857" CanMaximize="False"
            CanMinimize="False" IsModal="False" WindowVisualState="Normal"
            WindowInteractionState="ReadyForUserInteraction" IsTopmost="False" CanRotate="False" CanResize="True"
            CanMove="True" IsAvailable="True">
        <Window AcceleratorKey="" AccessKey="" AutomationId="" ClassName="NetUIHWNDElement" FrameworkId="Win32"
                HasKeyboardFocus="False" HelpText="" IsContentElement="True" IsControlElement="True" IsEnabled="True"
                IsKeyboardFocusable="False" IsOffscreen="False" IsPassword="False" IsRequiredForForm="False"
                ItemStatus="" ItemType="" LocalizedControlType="Window" Name="env-227052-MicroStrategy for Office"
                Orientation="None" ProcessId="2244" RuntimeId="42.2098840" x="208" y="127" width="1520" height="825">

and after:

<?xml version="1.0" encoding="utf-16"?>
<Window Name="Book1 - Excel" x="0" y="0" width="1440" height="1040">
    <Window Name="11.3 RC GA Validation (env-228690)-MicroStrategy for Office" x="-41" y="88" width="1522" height="857">
        <Window Name="11.3 RC GA Validation (env-228690)-MicroStrategy for Office" x="-40" y="119" width="1520" height="825">
"""

import fileinput
import re

ATTRIBUTES_TO_REMOVE = [
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
        for attribute_to_remove in ATTRIBUTES_TO_REMOVE:
            line = re.sub(attribute_to_remove, '', line)

        print(line)


def cleanup_xml():
    for xml_line in fileinput.input():
        single_tag_lines = xml_line.replace('><', '>\n<').split('\n')

        print_cleaned(single_tag_lines)


if __name__ == '__main__':
    cleanup_xml()
