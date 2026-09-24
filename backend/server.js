const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/flames_elite";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("🍃 MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

// ==========================================
// ANALYSIS SCHEMA
// ==========================================

const analysisSchema = new mongoose.Schema(
  {
    name1: {
      type: String,
      required: true,
      trim: true,
    },

    name2: {
      type: String,
      required: true,
      trim: true,
    },

    letter: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

// ==========================================
// FLAMES RESULTS
// ==========================================

const FLAMES_RESULTS = {
  F: {
    title: "Forever Friendship",
    description:
      "A friendship that grows stronger with every memory you create together.",
    score: 96,
    message:
      "Some friendships are not just moments — they become beautiful memories for a lifetime.",
  },

  L: {
    title: "Lifelong Friends",
    description:
      "Your bond has the potential to remain a beautiful part of your lives for years.",
    score: 94,
    message:
      "True friendship is about growing together while creating memories that last forever.",
  },

  A: {
    title: "Amazing Bond",
    description:
      "You share a special friendship filled with fun, trust and unforgettable moments.",
    score: 91,
    message:
      "Your friendship has a special energy that makes every moment more memorable.",
  },

  M: {
    title: "Memorable Bond",
    description:
      "Your friendship is all about creating memories that are worth keeping forever.",
    score: 89,
    message:
      "The best friendships are measured by the memories you create together.",
  },

  E: {
    title: "Endless Friendship",
    description:
      "A friendship that keeps moving forward through every chapter of life.",
    score: 97,
    message:
      "No matter where life takes you, this friendship has the potential to remain special.",
  },

  S: {
    title: "Strong Friendship",
    description:
      "Trust, support and understanding make this friendship wonderfully strong.",
    score: 93,
    message:
      "A strong friendship is built on trust, support, laughter and being there for each other.",
  },
};

// ==========================================
// FLAMES CALCULATION
// ==========================================

function calculateFlames(name1, name2) {
  const cleanName1 = name1
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const cleanName2 = name2
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const characters1 = cleanName1.split("");
  const characters2 = cleanName2.split("");

  const remaining1 = [...characters1];
  const remaining2 = [...characters2];

  // Remove matching characters
  for (let i = remaining1.length - 1; i >= 0; i--) {
    const char = remaining1[i];
    const index = remaining2.indexOf(char);

    if (index !== -1) {
      remaining1.splice(i, 1);
      remaining2.splice(index, 1);
    }
  }

  const count = remaining1.length + remaining2.length;

  // If all characters matched
  if (count === 0) {
    return "F";
  }

  let flames = ["F", "L", "A", "M", "E", "S"];
  let index = 0;

  while (flames.length > 1) {
    index = (index + count - 1) % flames.length;
    flames.splice(index, 1);
  }

  return flames[0];
}

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🔥 FLAMES Elite Backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
    serverTime: new Date().toISOString(),
  });
});

// ==========================================
// ANALYZE FRIENDSHIP
// ==========================================

app.post("/api/flames/analyze", async (req, res) => {
  try {
    const { name1, name2 } = req.body;

    // Validate type
    if (
      typeof name1 !== "string" ||
      typeof name2 !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Both names are required.",
      });
    }

    const cleanInput1 = name1.trim();
    const cleanInput2 = name2.trim();

    // Validate empty names
    if (!cleanInput1 || !cleanInput2) {
      return res.status(400).json({
        success: false,
        message: "Please enter both names.",
      });
    }

    // Validate minimum length
    if (
      cleanInput1.length < 2 ||
      cleanInput2.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Names must contain at least 2 characters.",
      });
    }

    // Validate same names
    if (
      cleanInput1.toLowerCase() ===
      cleanInput2.toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter two different names.",
      });
    }

    // Validate characters
    const validNameRegex = /^[a-zA-Z\s]+$/;

    if (
      !validNameRegex.test(cleanInput1) ||
      !validNameRegex.test(cleanInput2)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please use English letters and spaces only.",
      });
    }

    // Calculate FLAMES
    const letter = calculateFlames(
      cleanInput1,
      cleanInput2
    );

    const result = FLAMES_RESULTS[letter];

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Unable to calculate FLAMES result.",
      });
    }

    // Save analysis to MongoDB
    const savedAnalysis = await Analysis.create({
      name1: cleanInput1,
      name2: cleanInput2,
      letter,
      title: result.title,
      description: result.description,
      score: result.score,
      message: result.message,
    });

    console.log(
      `💾 Analysis saved: ${cleanInput1} + ${cleanInput2} → ${result.title}`
    );

    // Send response
    return res.status(200).json({
      success: true,

      name1: cleanInput1,
      name2: cleanInput2,

      result: {
        letter,
        title: result.title,
        description: result.description,
        score: result.score,
        message: result.message,
      },

      analysisId: savedAnalysis._id,
    });
  } catch (error) {
    console.error("❌ Analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to analyze friendship.",
    });
  }
});

// ==========================================
// GET FRIENDSHIP HISTORY
// ==========================================

app.get("/api/flames/history", async (req, res) => {
  try {
    const history = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("❌ History error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load history.",
    });
  }
});

// ==========================================
// DELETE ONE HISTORY
// ==========================================

app.delete(
  "/api/flames/history/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid history ID.",
        });
      }

      const deleted =
        await Analysis.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "History record not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "History deleted successfully.",
      });
    } catch (error) {
      console.error(
        "❌ Delete history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to delete history.",
      });
    }
  }
);

// ==========================================
// DELETE ALL HISTORY
// ==========================================

app.delete("/api/flames/history", async (req, res) => {
  try {
    const result = await Analysis.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "All friendship history deleted.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(
      "❌ Clear history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to clear history.",
    });
  }
});

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 FLAMES Elite Backend running on http://localhost:${PORT}`
  );
});