## Assignment Duplicator

A Google App to help teachers create copies of student assignments.

Teachers often want to share an assignment or test with their students. Sharing a file with multiple students allows all the students to edit one file. Unfortunately what teachers often need is a unique copy of the file for each student.

This app does that.

To use the app the teacher selects the file they wish to duplicate and they select a Google class. This app creates a unique copy of the file for each student and places that file in a new folder in the teacher's Google drive. 
The students now have their own copy of the file and the teacher has full access to all the files.

![Alt text](AssignmentDuplicatorImage.png?raw=true "Title")

Steps to deploy this tool.

1. Create a new Google user with permissions to use the API. This is a service account and it won't be used by any teacher or student. This account will 'own' the application.
2. Add these files to a new Google App Script within this new users Google Drive
3. Deploy to the Web this application. Select that this application execute as the user accessing the web app. Restrict access to users within your domain.
4. Mail out or publish the URL. Users will be able to use the application immediately.
