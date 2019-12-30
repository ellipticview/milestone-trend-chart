Introduction
============
Milestone Trend Charts are a useful tool for a project manager. They are however quite tricky to create using the Excel charting capabilities. This tool provides an easy way to maintain the milestones in Excel and generate the chart in a browser.

What is a Milestone Trend Chart?
============
A Milestone Trend Chart shows how milestones have moved over time. This is especially useful to track project delays, or delays in project dependencies. There are several sites that have a more detailed explanation:

- The [Project Management Knowhow](https://www.project-management-knowhow.com/milestone_trend_analysis.html) site has a one-page explanation, and also an Excel tool.
- [New England Project Services](http://neprojectservices.com/milestones.htm) also shows a brief example.


Getting Started
===============
Download the spreadsheet [here](https://ellipticview.github.io/milestone-trend-chart/assets/trendchart.xlsm).

The data is in an Excel table. If you required more columns/rows, then expand the table. Do not add adjacent columns or rows.

Fill out the milestones and press the button. A URL is now stored in your clipboard.
Go to your browser and paste the URL (Ctrl-V) in the URL bar. Press Enter and the browser displays the chart.

If you want to share the diagram, you can share the URL. As the URL is quite long, you might want to create a shorter version using [TinyUrl](https://tinyurl.com/).

How does it work?
============
When you click the button in the spreadsheet, a spreadsheet macro assembles the milestone information and creates a URL which contains all the data in the spreadsheet. This URL is sent to the clipboard.
When you paste this URL in your browser, the browser receives the web page and the milestone data. The browser then draws the chart using your milestone data. Your data is not used or stored on the server.

Frequently Asked Questions
==========================

### Does the website store my project information?
None of your data is stored by this web site. No user account or login is required. Your spreadsheet requests a web page, and all processing of your milestones is performed in your browser.

### Can I use a different date format in the spreadsheet?
Format the dates in the spreadsheet as you like.

### Can I use a different date format in the chart?
Not yet.

### When saving my spreadsheet I get this message: "Be careful! Parts of your document may include personal information that can't be removed by the Document Inspector."
This is an Excel issue described [here](https://answers.microsoft.com/en-us/office/forum/office_2013_release-excel/be-careful-parts-of-your-document-may-include/fae98705-d078-4fc5-843a-908dda5be559).

### Why doesn't the macro invoke the browser (saving the manual Paste action)
Excel has a limitation in the length of the URL when invoking a web page. Because we are packing the whole schedule in the URL, the length exceeds this limit.
