import express from "express";
import { getAllCodeBlocks, createCodeBlock, updateCodeBlock, deleteCodeBlock, getCodeBlockById } from "../controllers/codeblocks_controller";

const router = express.Router();

router.get("/", getAllCodeBlocks);
router.get("/:id", getCodeBlockById);
router.post("/", createCodeBlock);
router.put("/:id", updateCodeBlock);
router.delete("/:id", deleteCodeBlock);

export default router;



// // routes/codeblocks_route.ts
// import express from 'express';
// import CodeBlock  from '../models/CodeBlock';

// const router = express.Router();

// // Get all code blocks
// router.get('/', async (req, res) => {
//   try {
//     const codeBlocks = await CodeBlock.find();
//     res.json(codeBlocks);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching code blocks' });
//   }
// });

// // Get specific code block
// router.get('/:id', async (req, res) => {
//   try {
//     const codeBlock = await CodeBlock.findOne({ _id: req.params.id });
//     if (!codeBlock) {
//       return res.status(404).json({ error: 'Code block not found' });
//     }
//     res.json(codeBlock);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching code block' });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const { title, initialCode, solution } = req.body;
//     const newCodeBlock = new CodeBlock({ title, initialCode, solution });
//     await newCodeBlock.save();
//     res.status(201).json(newCodeBlock);
//   }
//   catch (error) {
//     res.status(500).json({ error: 'Error creating code block' });
//   }
// });

// router.post("/", async (req, res) => {
//   try {
//     const { title, initialCode, solution } = req.body;
//     const newCodeBlock = new CodeBlock({ title, initialCode, solution });
//     await newCodeBlock.save();
//     res.status(201).json(newCodeBlock);
//     } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//     }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     const updatedCodeBlock = await CodeBlock.findByIdAndUpdate(req.params.id, req.body)
//     if (!updatedCodeBlock) return res.status(404).json({ message: "Code block not found" });
//     res.json(updatedCodeBlock);
//     } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//     }
// });

// router.delete("/:id", async (req, res) => {
//     try {
//         const deletedCodeBlock = await CodeBlock.findByIdAndDelete(req.params.id);
//         if (!deletedCodeBlock) return res.status(404).json({ message: "Code block not found" });
//         res.json({ message: "Code block deleted successfully" });
//         } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//         }
// });




// export default router;




