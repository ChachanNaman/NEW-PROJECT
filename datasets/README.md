# Dataset Directory

Place your downloaded datasets here. Supported formats:
- JSON files (.json)
- CSV files (.csv)
- MovieLens dataset files
- Goodreads dataset files
- Spotify dataset files

## Directory Structure
```
datasets/
├── movies/          # Movie datasets
├── songs/           # Music/audio datasets
├── books/           # Book datasets
├── series/          # Series datasets
├── unstructured/    # PDFs, videos, images, audio files
└── raw/             # Raw downloaded files
```

## How to Use

1. Place your dataset files in the appropriate subdirectory
2. Run the import script: `node backend/scripts/importDataset.js <dataset-path>`
3. Data will be imported into MongoDB

## Unstructured Data

For PDF/video/image/music files:
- Store in `datasets/unstructured/` directory
- Metadata will be stored in MongoDB
- Actual files can be stored in HDFS for distributed processing
