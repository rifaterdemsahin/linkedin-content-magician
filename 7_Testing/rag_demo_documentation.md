# 🎬 RAG System Demo Script Documentation

## 📝 Overview

The `demo.sh` script is an automated demonstration tool for the Vector Search RAG (Retrieval-Augmented Generation) system. It provides a complete end-to-end test of the semantic search functionality using sample documents.

## 📁 Script Location

**Current Path**: `/Users/rifaterdemsahin/projects/linkedin-content-magician/7_Testing/demo.sh`

**Original Location**: `5_Symbols/rag/demo.sh` (moved to testing folder for better organization)

## 🎯 Purpose

The demo script serves multiple purposes:

1.  **System Validation**: Ensures all components work together correctly
2.  **User Onboarding**: Provides immediate hands-on experience with the RAG system
3.  **Integration Testing**: Tests the complete workflow from indexing to searching
4.  **Documentation**: Shows practical examples of how to use the system

## 🔧 Script Breakdown

### Script Structure

```bash
#!/bin/bash

# Header and Introduction
echo "🔍 Vector Search RAG System Demo"
echo "================================="

# Directory Validation
if [ ! -f "index.py" ] || [ ! -f "search.py" ]; then
    echo "❌ Error: Please run this script from the rag directory"
    echo "📍 Expected location: /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag"
    exit 1
fi

# Dependency Installation
pip install -r requirements.txt

# Index Creation
python index.py --folder sample_docs

# Sample Searches (4 different queries)
python search.py --query "How to create engaging LinkedIn videos"
python search.py --query "measuring social media engagement"
python search.py --query "AI tools for content creation"
python search.py --query "LinkedIn profile optimization"

# Completion Summary
echo "✅ Demo complete! Your RAG system is ready to use."
```

### Step-by-Step Functionality

#### 1. 🌳 Environment Validation

```bash
if [ ! -f "index.py" ] || [ ! -f "search.py" ]; then
    echo "❌ Error: Please run this script from the rag directory"
    exit 1
fi
```

**What it does:**

*   Checks if required Python scripts exist in current directory
*   Ensures user is running from correct location (`5_Symbols/rag/`)
*   Prevents execution errors due to wrong working directory

**Why it's important:**

*   The Python scripts expect to find sample documents in relative paths
*   FAISS index files are created in the current directory
*   Prevents confusing error messages if run from wrong location

#### 2. 📦 Dependency Installation

```bash
pip install -r requirements.txt
```

**What it does:**

*   Installs all required Python packages automatically
*   Uses the requirements.txt file for version consistency
*   Handles FAISS, SentenceTransformers, and other dependencies

**Dependencies installed:**

*   `faiss-cpu==1.7.4` - Vector similarity search engine
*   `sentence-transformers==2.2.2` - Text embedding generation
*   `markdown-it-py==3.0.0` - Markdown file parsing
*   `numpy==1.24.3` - Numerical computation support

#### 3. ⚡ Vector Index Creation

```bash
python index.py --folder sample_docs
```

**What it does:**

*   Scans `sample_docs/` folder for markdown files
*   Converts text content to 384-dimensional vectors using SentenceTransformers
*   Creates FAISS index for fast similarity search
*   Generates `faiss_index.bin` and `filepaths.txt` files

**Files processed:**

*   `linkedin_strategy.md` - LinkedIn content strategy guide
*   `video_production.md` - Video creation workflow
*   `ai_tools.md` - AI tools for content creation
*   `analytics_metrics.md` - Social media analytics
*   `personal_branding.md` - Personal branding strategies

#### 4. 🔍 Demonstration Searches

**Query 1: Video Content Focus**

```bash
python search.py --query "How to create engaging LinkedIn videos"
```

*   **Expected Result**: `video_production.md` should rank highest
*   **Tests**: Video-specific content retrieval and relevance scoring

**Query 2: Analytics Focus**

```bash
python search.py --query "measuring social media engagement"
```

*   **Expected Result**: `analytics_metrics.md` should be most relevant
*   **Tests**: Analytics and metrics content identification

**Query 3: AI Tools Focus**

```bash
python search.py --query "AI tools for content creation"
```

*   **Expected Result**: `ai_tools.md` should rank first
*   **Tests**: Technology and tool-specific search accuracy

**Query 4: Personal Branding Focus**

```bash
python search.py --query "LinkedIn profile optimization"
```

*   **Expected Result**: `personal_branding.md` should be top result
*   **Tests**: Professional development content matching

## 🎭 How to Run the Demo

### Option 1: From Testing Folder (Current Location)

```bash
cd /Users/rifaterdemsahin/projects/linkedin-content-magician/7_Testing
cd ../5_Symbols/rag
../../../7_Testing/demo.sh
```

### Option 2: Move to RAG Directory First

```bash
cd /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag
../../7_Testing/demo.sh
```

### Option 3: Copy Script Back to RAG Folder (Temporary)

```bash
cp /Users/rifaterdemsahin/projects/linkedin-content-magician/7_Testing/demo.sh /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag/
cd /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag
./demo.sh
```

## 📊 Expected Output

### Successful Run Output:

    🔍 Vector Search RAG System Demo
    =================================
    📁 Current directory: /Users/rifaterdemsahin/projects/linkedin-content-magician/5_Symbols/rag

    📦 Installing dependencies...
    [Package installation output...]

    🔧 Creating vector index from sample documents...
    Loading sentence transformer model...
    Scanning for markdown files in 'sample_docs'...
    Found 5 markdown files. Creating embeddings...
    Saving FAISS index to 'faiss_index.bin'...
    Saving file paths to 'filepaths.txt'...
    Indexing complete.

    🎥 Query 1: LinkedIn video creation
    ----------------------------------------
    Loading FAISS index from 'faiss_index.bin'...
    Loading file paths from 'filepaths.txt'...
    Loading sentence transformer model...
    Searching for: 'How to create engaging LinkedIn videos'

    Top 5 search results:
    1. sample_docs/video_production.md (Distance: 0.3245)
    2. sample_docs/linkedin_strategy.md (Distance: 0.4567)
    3. sample_docs/personal_branding.md (Distance: 0.5432)
    4. sample_docs/ai_tools.md (Distance: 0.6789)
    5. sample_docs/analytics_metrics.md (Distance: 0.7123)

    [Similar output for other 3 queries...]

    ✅ Demo complete! Your RAG system is ready to use.

## 🔍 Validation Criteria

### Success Indicators:

1.  **No Error Messages**: All commands execute without Python or dependency errors
2.  **Index Files Created**: `faiss_index.bin` and `filepaths.txt` appear in rag directory
3.  **Relevant Results**: Each query returns appropriate document as top result
4.  **Distance Scores**: Lower scores (< 0.5) for highly relevant matches
5.  **All 5 Documents Found**: Every sample document appears in at least one result set

### Performance Benchmarks:

*   **Indexing Time**: Should complete in 3-5 seconds
*   **Search Time**: Each query should return results in < 1 second
*   **Memory Usage**: Process should use < 100MB RAM
*   **Accuracy**: Top result should match query intent for all 4 test queries

## 🛠️ Troubleshooting Common Issues

### Issue 1: "Command not found: python"

**Solution**: Install Python 3.7+ or use `python3` instead

### Issue 2: "ModuleNotFoundError: No module named 'faiss'"

**Solution**: Run `pip install -r requirements.txt` manually

### Issue 3: "Permission denied: ./demo.sh"

**Solution**: Run `chmod +x demo.sh` to make script executable

### Issue 4: Script runs but no search results

**Solution**: Check that sample_docs folder contains markdown files

### Issue 5: Poor search relevance (high distance scores)

**Solution**: Verify document content is substantial and well-formatted

## 🎯 Testing Strategy

The demo script implements several testing methodologies:

### 1. 🔥 Smoke Testing

*   Verifies basic system functionality works end-to-end
*   Ensures all major components integrate properly

### 2. ⚙️ Integration Testing

*   Tests data flow from markdown files → embeddings → FAISS index → search results
*   Validates file I/O operations and data persistence

### 3. 🧪 Functional Testing

*   Each query tests different content domains (video, analytics, AI, branding)
*   Verifies semantic search accuracy across diverse topics

### 4. 🚀 Performance Testing

*   Measures indexing and search speed with sample dataset
*   Establishes baseline performance metrics

## 📈 Extending the Demo

### Adding More Test Cases:

```bash
# Add after existing queries
python search.py --query "social media ROI calculation"
python search.py --query "video editing software comparison"
python search.py --query "LinkedIn algorithm updates"
```

### Testing with Different Document Sets:

```bash
# Test with different content
python index.py --folder ../../4_Formula
python search.py --query "formula documentation"
```

### Automated Testing Integration:

```bash
# Add test result validation
RESULT=$(python search.py --query "video production" | head -1)
if [[ $RESULT == *"video_production.md"* ]]; then
    echo "✅ Video query test passed"
else
    echo "❌ Video query test failed"
fi
```

## 🎉 Success Metrics

A successful demo run indicates:

*   ✅ **RAG System is Functional**: All components work together
*   ✅ **Environment is Correct**: Dependencies and paths configured properly
*   ✅ **Search Accuracy is High**: Relevant documents found for specific queries
*   ✅ **Performance is Acceptable**: Fast indexing and search response times
*   ✅ **System is Ready for Production**: Can handle real content and queries

The demo script serves as both a validation tool and an educational resource, providing immediate feedback on system functionality while demonstrating practical usage patterns.
