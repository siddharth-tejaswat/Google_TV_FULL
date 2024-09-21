const express = require("express");
const cors = require("cors");

const path = require("path");

const pool = require("./config/db");

const app = express();
const port = 5001;

const corsOptions = {
  origin: "http://localhost:5173", // Your Vite frontend address
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static("public"));

// Multer setup for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// Store the active FFmpeg processes
// let activeStreams = [];

// // POST endpoint to start RTSP streaming
// app.post("/stream", (req, res) => {
//   const rtspLinks = req.body.rtspLinks;

//   if (!Array.isArray(rtspLinks) || rtspLinks.length === 0) {
//     return res.status(400).send("An array of RTSP URLs is required.");
//   }

//   rtspLinks.forEach((rtspUrl, index) => {
//     const streamDir = path.join(__dirname, `public/stream${index}`);

//     if (!fs.existsSync(streamDir)) {
//       fs.mkdirSync(streamDir, { recursive: true });
//     }

//     // Start FFmpeg process for each stream
//     const ffmpeg = spawn("ffmpeg", [
//       "-i",
//       rtspUrl,
//       "-f",
//       "hls",
//       "-hls_time",
//       "2",
//       "-hls_list_size",
//       "3",
//       "-hls_flags",
//       "delete_segments",
//       "-hls_allow_cache",
//       "0",
//       "-hls_segment_type",
//       "mpegts",
//       "-hls_segment_filename",
//       `${streamDir}/stream_%03d.ts`,
//       `${streamDir}/playlist.m3u8`,
//     ]);

//     // Log any FFmpeg errors
//     ffmpeg.stderr.on("data", (data) => {
//       console.error(`FFmpeg stderr (stream${index}): ${data}`);
//     });

//     // Log FFmpeg process termination
//     ffmpeg.on("close", (code) => {
//       console.log(`FFmpeg process (stream${index}) exited with code ${code}`);
//     });

//     // Store the FFmpeg process so it can be terminated later if needed
//     activeStreams.push({ index, process: ffmpeg });

//     // Save stream information to the PostgreSQL database
//     pool.query(
//       "INSERT INTO streams (name, playlist_url) VALUES ($1, $2)",
//       [
//         `Stream ${index + 1}`,
//         `http://localhost:5000/stream${index}/playlist.m3u8`,
//       ],
//       (err, result) => {
//         if (err) {
//           console.error("Error saving stream to database:", err);
//         } else {
//           console.log(`Stream ${index + 1} saved to database`);
//         }
//       }
//     );
//   });

//   res.status(200).send("Streams started.");
// });

// // GET request to fetch available streams
// app.get("/streams", (req, res) => {
//   const publicDir = path.join(__dirname, "public");

//   fs.readdir(publicDir, (err, files) => {
//     if (err) {
//       return res.status(500).send("Failed to retrieve streams.");
//     }

//     const streamDirs = files.filter((file) => file.startsWith("stream"));
//     const availableStreams = streamDirs.map((dir, index) => ({
//       id: index,
//       name: `Stream ${index + 1}`,
//       playlist: `http://localhost:5000/${dir}/playlist.m3u8`,
//     }));

//     res.json(availableStreams);
//   });
// });

// // Endpoint to handle file upload
// app.post(
//   "/upload-screenshot",
//   upload.single("screenshot"),
//   async (req, res) => {
//     const { originalname, buffer } = req.file;

//     try {
//       await pool.query(
//         "INSERT INTO screenshots (filename, data) VALUES ($1, $2)",
//         [originalname, buffer]
//       );
//       res.send("Screenshot uploaded and saved to the database.");
//     } catch (err) {
//       console.error("Error saving screenshot to database:", err);
//       res.status(500).send("Failed to upload screenshot.");
//     }
//   }
// );

// // Endpoint to stop a stream
// app.post("/stop-stream", (req, res) => {
//   const { streamId } = req.body;

//   if (typeof streamId !== "number") {
//     return res.status(400).send("Invalid stream ID.");
//   }

//   // Find the stream process by ID
//   const stream = activeStreams.find((s) => s.index === streamId);

//   if (stream) {
//     // Kill the FFmpeg process
//     stream.process.kill();

//     // Remove the stream from the activeStreams array
//     activeStreams = activeStreams.filter((s) => s.index !== streamId);

//     res.send(`Stream ${streamId} stopped.`);
//   } else {
//     res.status(404).send("Stream not found.");
//   }
// });

// Route to retrieve records including image data
// app.get("/record", (req, res) => {
//   const limit = 10;
//   let offset = 0;
//   setInterval(async () => {
//     try {
//       const query = `
//         SELECT
//           "DATE_TIMESTAMP",
//           "BARCODE_READ",
//           "BARCODE_NUMBER",
//           "BARCODE_IMAGE",
//           "GTV_READ",
//           "GTV_IMAGE",
//           "IMAGE_FROM_CAMERA",
//           "PROCESSED_IMAGE",
//           "OVERALL_STATUS"
//         FROM public."Sarthak_MVP"
//         LIMIT $1 OFFSET $2
//       `;

//       const result = await pool.query(query, [limit, offset]);

//       offset += 10;
//       // Convert bytea fields to base64
//       const records = result.rows.map((record) => ({
//         ...record,
//         BARCODE_IMAGE: record.BARCODE_IMAGE
//           ? Buffer.from(record.BARCODE_IMAGE).toString("base64")
//           : null,
//         GTV_IMAGE: record.GTV_IMAGE
//           ? Buffer.from(record.GTV_IMAGE).toString("base64")
//           : null,
//         IMAGE_FROM_CAMERA: record.IMAGE_FROM_CAMERA
//           ? Buffer.from(record.IMAGE_FROM_CAMERA).toString("base64")
//           : null,
//         PROCESSED_IMAGE: record.PROCESSED_IMAGE
//           ? Buffer.from(record.PROCESSED_IMAGE).toString("base64")
//           : null,
//       }));

//       if (records.length > 0) {
//         res.status(200).json(records);
//       } else {
//         res.status(404).send("Record not found");
//       }
//     } catch (err) {
//       console.error("Error retrieving record:", err);
//       res.status(500).send("Error retrieving record");
//     }
//   }, 1000);
// });

app.get("/record", async (req, res) => {
  try {
    const query = `
      SELECT * FROM public."Sarthak_MVP"
      
    `;

    const result = await pool.query(query);

    // Convert bytea fields to base64

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).send("No more records found");
    }
  } catch (err) {
    console.error("Error retrieving records:", err);
    res.status(500).send("Error retrieving records");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
