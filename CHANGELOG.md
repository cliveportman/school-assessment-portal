# Changelog

## 0.4 - Lesson evidence
Various improvements aimed at tracking and fixing issues with evidence submission
- Logging image uploads
- Remove text saying we accept PDFs as images
- When a student opens an evidence modal, their data is refreshed to reflect any changes a teacher may have made while they were signed in
- When a teacher opens an evidence modal for a student, that student's data is refreshed to reflect any changes made by the student while the teacher is signed in
- Teachers can now upload images on a student's behalf

## 0.3.3 - Fix for dashboard not redirecting if no session
- Fixed redirection to login page when signed out and visiting the dashoard

## 0.3.2 - Removing password sign in option
- Removed password option on the sign in page
- Removed ability to change password from the dashboard

## 0.3.1 - Adding logging
Adding logging to help troubleshoot students unable to submit lesson evidence
- Logging service created, using New Relic.
- Logging signins and several events associated with submitting lesson evidence.

## 0.3 - Adding toasts for messaging
Troubleshooting students being unable to submit lesson evidence
- Toasts added.
- Evidence modal now displays error toast when file uploads aren't successful.
- Saving evidence now displays an error toast when unsuccessful and a success toast when succesfully saved.

## 0.2 - Improving the dashboard UI for students
- Student Dashboard now displays much better on mobile devices and has been optimised across the range of breakpoints

## 0.1.1 - UI improvements
- Further authentication improvements where everything happens on the same sign in page

## 0.1 - Refactoring authentication
Authentication work to avoid expiring links
- Improved authentication system with more emphasis on signing in with email codes.
- Invites are now just directing people to sign in with a code.
