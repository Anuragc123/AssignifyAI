const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { connectBox } = require("../db");
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const { validateToken } = require("../services/auth");
const { default: mongoose } = require("mongoose");

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

async function downloadFileFromBox(boxClient, fileId, fileName, userId) {
  try {
    const downloadURL = await boxClient.files.getDownloadURL(fileId);

    const uniqueFileName = `${userId}-${fileName}`;
    const filePath = path.join(tempDir, uniqueFileName);

    const response = await axios({
      method: "get",
      url: downloadURL,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () =>
        resolve({
          path: filePath,
          name: fileName,
          tempFileName: uniqueFileName,
        })
      );
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error downloading file ${fileId}:`, error);
    throw error;
  }
}

function cleanupTempFiles() {
  const oneHourAgo = Date.now() - 5 * 60 * 1000;

  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error("Error reading temp directory:", err);

    files.forEach((file) => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error getting stats for ${file}:`, err);

        if (stats.mtimeMs < oneHourAgo) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting ${file}:`, err);
          });
        }
      });
    });
  });
}

setInterval(cleanupTempFiles, 5 * 60 * 1000);

async function handleCheckSubmission(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = validateToken(tokenId);
    const { id } = req.params;

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } //
    else {
      // console.log(id);
      const subResponse = await Submission.findOne({
        user: user.id,
        assignment: id,
      });
      // console.log(subResponse);

      if (subResponse == null) {
        return res.json({ success: true, isAssignmentSubmitted: false });
      } else {
        try {
          const boxClient = await connectBox();
          const files = [];

          for (const fileId of subResponse.fileIds) {
            const fileInfo = await boxClient.files.get(fileId, {
              fields: "name,id,shared_link",
            });

            if (!fileInfo.shared_link) {
              const sharedLink = await boxClient.files.update(fileId, {
                shared_link: { access: "open" },
              });
              fileInfo.shared_link = sharedLink.shared_link;
            }

            files.push({
              id: fileId,
              name: fileInfo.name,
              url: fileInfo.shared_link.url,
            });
          }

          console.log("files=", files);

          return res.json({
            success: true,
            isAssignmentSubmitted: true,
            files,
          });
        } catch (error) {
          console.error("Error fetching files from Box:", error);
          return res.json({ isAssignmentSubmitted: false });
        }
      }
    }
  }
}

async function handleGetFileContent(req, res) {
  const tokenId = req.cookies?.tokenId;
  const { fileId } = req.params;

  if (!tokenId) {
    return res.status(401).json({ success: false, error: "Not LoggedIn" });
  }

  const user = validateToken(tokenId);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not LoggedIn" });
  }

  try {
    const boxClient = await connectBox();

    // Get file info to get the name
    const fileInfo = await boxClient.files.get(fileId, {
      fields: "name,id",
    });
    const originalFileName = fileInfo.name;

    const expectedTempFileName = `${user.id}-${originalFileName}`;
    const expectedFilePath = path.join(tempDir, expectedTempFileName);
    if (fs.existsSync(expectedFilePath)) {
      console.log(
        `File ${expectedTempFileName} found in temp cache. Serving existing file.`
      );
      return res.json({
        success: true,
        file: {
          name: originalFileName,
          tempPath: `/temp/${expectedTempFileName}`, // Use the existing filename
        },
      });
    } else {
      const fileData = await downloadFileFromBox(
        boxClient,
        fileId,
        fileInfo.name,
        user.id
      );
      return res.json({
        success: true,
        file: {
          name: fileData.name,
          tempPath: `/temp/${fileData.tempFileName}`,
        },
      });
    }
  } catch (error) {
    console.error("Error downloading file from Box:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to download file",
      details: error.message,
    });
  }
}

async function handleUploadAssignment(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = validateToken(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } //
    else {
      try {
        const boxClient = await connectBox();

        const { id } = req.params;
        // console.log(req)

        if (!req.files || !req.files.files) {
          return res.status(400).json({
            success: false,
            error: "No files were uploaded",
          });
        }

        // console.log(req.files);

        const uploadedFiles = Array.isArray(req.files.files)
          ? req.files.files
          : [req.files.files];

        // console.log("uploadedFiles=", uploadedFiles);

        let submissionsFolderId;
        try {
          const folders = await boxClient.folders.getItems("0", {
            fields: "name,id",
            limit: 1000,
          });

          const submissionsFolder = folders.entries.find(
            (entry) => entry.type === "folder" && entry.name === "Submissions"
          );

          if (submissionsFolder) {
            submissionsFolderId = submissionsFolder.id;
          } else {
            const folderResponse = await boxClient.folders.create(
              "0",
              "Submissions"
            );
            submissionsFolderId = folderResponse.id;
          }
        } catch (error) {
          console.error("Error finding/creating Submissions folder:", error);
          return res.status(500).json({
            success: false,
            error: "Error finding/creating Submissions folder",
          });
        }

        let assignmentFolderId;
        try {
          const folders = await boxClient.folders.getItems(
            submissionsFolderId,
            {
              fields: "name,id",
              limit: 1000,
            }
          );

          const assignmentFolder = folders.entries.find(
            (entry) =>
              entry.type === "folder" && entry.name === `Assignment-${id}`
          );

          if (assignmentFolder) {
            assignmentFolderId = assignmentFolder.id;
          } else {
            const folderResponse = await boxClient.folders.create(
              submissionsFolderId,
              `Assignment-${id}`
            );
            assignmentFolderId = folderResponse.id;
          }
        } catch (error) {
          console.error(
            `Error finding/creating Assignment-${id} folder:`,
            error
          );
          
          return res.status(500).json({
            success: false,
            error: `Error finding/creating Assignment-${id} folder`,
          });
        }

        const uploadedFileIds = [];
        const fileIds = [];

        for (const file of uploadedFiles) {

          const fileStream = fs.createReadStream(file.tempFilePath);

          const uploadResponse = await boxClient.files.uploadFile(
            assignmentFolderId,
            file.name,
            fileStream
          );

          uploadedFileIds.push({
            id: uploadResponse.entries[0].id,
            name: file.name,
            size: file.size,
            type: file.mimetype,
          });

          fileIds.push(uploadResponse.entries[0].id);

          await fs.promises.unlink(file.tempFilePath);
        }

        const response = await Submission.create({
          user: user.id,
          fileIds: fileIds,
          submitTime: new Date().toLocaleTimeString(),
        });

        const assignmentId = new mongoose.Types.ObjectId(id);

        const submissionId = new mongoose.Types.ObjectId(response._id);

        const response2 = await Assignment.findByIdAndUpdate(
          assignmentId,
          { $push: { submissions: submissionId } },
          { new: true }
        );

        if (response._id && response2._id) {
          return res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            files: uploadedFileIds,
          });
        }

        return res.status(500).json({
          success: false,
          error: "Failed to upload files",
        });
      } catch (error) {
        console.error("Error uploading files to Box:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to upload files",
          details: error.message,
        });
      }
    }
  }
}

module.exports = {
  handleUploadAssignment,
  handleCheckSubmission,
  handleGetFileContent,
};
