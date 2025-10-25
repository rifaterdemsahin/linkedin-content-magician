#!/bin/bash
# LinkedIn Content Magician - Folder Structure Initialization
# Creates organized folder structure with README files for content management

# Define folder names and their respective README content
declare -A folders=(
  ["7_Testing"]="Testing the code base be able to reach the key results mention in the real folder. Validate it"
  ["1_Real"]="The Job That Starts with Objective and Key Results - Sets goals and objectives, aligning tasks with measurable results. Aim at it"
  ["2_Environment"]="The Roadmap and Use Cases - A roadmap with learning modules and real-world use cases to apply new skills. Create it"
  ["3_UI"]="What You Learn on the Road - Tracks concepts, theories, and skills acquired, promoting continuous growth. Imagine it"
  ["4_Formula"]="The Guides That Are Mentioned - Essential guides and formulas for understanding and solving project challenges. Learn from it"
  ["5_Symbols"]="Code That Is Implemented - Includes code snippets and examples to demonstrate each concept practically. Execute it"
  ["6_Semblance"]="Errors Found in the Process - Documents mistakes and solutions, making errors valuable learning opportunities. Fix it"
)

# Create folders and add README.md to each with context
for folder in "${!folders[@]}"; do
  mkdir -p "$folder"  # Create the folder
  echo "${folders[$folder]}" > "$folder/README.md"  # Create README.md with content
done

echo "Folder structure created with README.md files."

# prompts:
# - objective: cli install with image renderer
# - Format: Create a summary
# - Format: Use emojis
# - Format: one-line comment
# - Format: use markdown structure
# - Rewrite: Eliminate duplicate information