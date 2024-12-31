import calendar
import re
from datetime import datetime

# Define the bins from the content
bin_patterns = {
  "Non-recycleable waste and brown bin": ["Brown", "Grey"],
  "Plastic, glass & cans waste and brown bin": ["Brown", "Blue"],
  "Paper, cardboard & cardboard-lined cartons and brown bin": ["Brown", "Green"]
}

# Match months with their days from the text
month_names = list(calendar.month_name)[1:]  # Full month names excluding empty string
month_indices = {name: i for i, name in enumerate(month_names, start=1)}

# Extract bin data mapping
bins_text = re.findall(r"(Non-recycleable waste and brown bin|Plastic, glass & cans waste and brown bin|Paper, cardboard & cardboard-lined cartons and brown bin)", text_content)

# Initialize JSON object
collection_data = []

# Helper function to find all Tuesdays in a month
def find_tuesdays(year, month):
  cal = calendar.Calendar()
  return [day for day in cal.itermonthdays2(year, month) if day[0] != 0 and day[1] == calendar.TUESDAY]

# Process data for each month
current_year = 2025
for month_name in month_names:
  month_idx = month_indices[month_name]
  tuesdays = find_tuesdays(current_year, month_idx)
  for tuesday in tuesdays:
    day_str = f"{tuesday[0]:02}/{month_idx:02}/{current_year}"
    # Map bin color based on order of appearance in text (recycling pattern cycle assumption)
    bin_color = bins_text[len(collection_data) % len(bins_text)]
    collection_data.append({"day": day_str, "bins": bin_patterns[bin_color]})

# Output JSON structure
collection_data