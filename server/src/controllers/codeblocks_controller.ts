import { Request, Response } from "express";
import CodeBlock from "../models/codeblock_model";



export const getAllCodeBlocks = async (req: Request, res: Response) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch {
    res.status(500).json({ error: 'Error fetching code blocks' });
  }
};

export const getCodeBlockById = async (req: Request, res: Response) => {
  try {
    const codeBlock = await CodeBlock.findOne({ _id: req.params.id });
    if (!codeBlock) {
      return res.status(404).json({ error: 'Code block not found' });
    }
    res.json(codeBlock);
  } catch {
    res.status(500).json({ error: 'Error fetching code block' });
  }
};



export const createCodeBlock = async (req: Request, res: Response) => {
  try {
    const { title, initialCode, solution } = req.body;
    const newCodeBlock = new CodeBlock({ title, initialCode, solution });
    await newCodeBlock.save();
    res.status(201).json(newCodeBlock);
  }
  catch {
    res.status(500).json({ error: 'Error creating code block' });
  }
};



export const updateCodeBlock = async (req: Request, res: Response) => {
  try {
    const updatedCodeBlock = await CodeBlock.findByIdAndUpdate(req.params.id, req.body)
    if (!updatedCodeBlock) return res.status(404).json({ message: "Code block not found" });
    res.json(updatedCodeBlock);
    } catch {
    res.status(500).json({ error: 'Server error' });
    }
};



export const deleteCodeBlock = async (req: Request, res: Response) => {
  try {
    const deletedCodeBlock = await CodeBlock.findByIdAndDelete(req.params.id);
    if (!deletedCodeBlock) return res.status(404).json({ message: "Code block not found" });
    res.json({ message: "Code block deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
