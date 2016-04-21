/*
Google Web App Script
Assignment Duplicator - author Craig Debbo @ KCDSB.ON.CA

User selects a class and a file from their Google drive. The tool then creates a copy of this file for each student in the class and shares that copy with the student.

*/

function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('Duplicate Assignment')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * Returns the ID and name of every classroom in the user's account.
 * @return {Array.<Object>} The classroom list data.
 */
function getCourses() {
  Logger.log('GET COURSES running');
  var optionalArgs = {
    pageSize: 10
  };
  var response = Classroom.Courses.list(optionalArgs);
  var courses = response.courses;
  Logger.log('GET COURSES found courses');
  if (!courses ) {
    return [];
  }
  return courses.map(function(course) {
    return {
      id: course.id,
      name: course.name
    }
  });
}


/**
 * Sets the completed status of a given task.
 * @param {String} classroomId of the classroom with the target students.
 * @param {String} assignmentFileId of the assignment.
 * @param {String} targetFolderId of the destination for the files. #### NOT USED ####
 * @param {Boolean} readOnly is true if the target should be shared readOnly or readWrite if set to false.
 */
function createAssignment(classroomId, assignmentFileId, targetFolderId, readOnly) {

  var result = {folderURL: "", 
                students: [] };
  var classlist = Classroom.Courses.Students.list(classroomId)
  
  if (!classlist) {
    return {status: "Class not found.",
            result: result};
  }
  var students = classlist.students;
  if (!students) {
    return {status: "No students found.", 
            result: result };
  }

  var file = DriveApp.getFileById(assignmentFileId);

  var filename = file.getName();
  var folderName = filename + "_student_copies";
  var folder = DriveApp.createFolder(folderName);
  result.folderURL = folder.getUrl();

  for (i = 0; i < students.length; i++) {
    var localstudent = students[i].profile.name;
    var localname = localstudent.givenName + "_" + localstudent.familyName + "_" + filename;
    try {
      var tfile = file.makeCopy(localname, folder);
    } catch (err) {
      Logger.log("failed to copy file for student " + localname);
      continue;
    }
    var address = students[i].profile.emailAddress;
    //tfile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.EDIT);
    try {
      if (parseInt(readOnly)) {
        tfile.addViewer(address);
      } else {
        tfile.addEditor(address);
      }
      Logger.log("added permission for " + localname);
      result.students.push (address);
    } catch (err) {
      Logger.log("failed to assign permissions for student " + localname);
      continue;
    }
    
  }
  
  return {status: "Success", 
          result: result };
}
