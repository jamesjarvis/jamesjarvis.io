"""
The following code was mostly written by ChatGPT 4 in January 2025, from a few back and
forth chats and a little bit of manual intervention.
Noting this to give a sense of how useful code generation is at the moment, and more for
posterity, once this damn robot steals my job in the future!
This script can be ran against the review.json export from goodreads, and currently
filters for book reviews made in 2024, sorts them in date ASC, and then prints out in an
opinionated markdown.

The prompt was:

given this data, write me a script that finds all reviews from 2024, and outputs each entry with the following template:
```
### {title}

{rating}/5 :star:

{review}
```

include only those with a rating value, and sort them by date ascending before printing
"""

import json
from datetime import datetime

# Load the JSON data
with open('review.json', 'r') as file:
    data = json.load(file)

# Sort the data by last_revision_at in ascending order
sorted_data = sorted(data, key=lambda x: x.get("last_revision_at", ""))

# Process and filter reviews from 2024 with a valid rating
for entry in sorted_data:
    last_revision = entry.get("last_revision_at", "")
    rating = entry.get("rating", 0)
    
    # Check if the review is from 2024 and has a rating
    if last_revision.startswith("2024") and rating > 0:
        title = entry.get("book", "Untitled")
        review = entry.get("review", "(not provided)")
        
        # Output the review in the specified format
        print(f"### {title}\n")
        print(f"{rating}/5 :star:\n")
        print(f"{review}\n")
