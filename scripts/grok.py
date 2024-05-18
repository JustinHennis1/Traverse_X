import pandas as pd

# Load the dataset
data = pd.read_csv('city_data.csv')

# Convert 'Rating' to numeric, handling errors
data['Rating'] = pd.to_numeric(data['Rating'], errors='coerce')

# Convert 'Total Ratings' to numeric, handling errors
data['Total Ratings'] = pd.to_numeric(data['Total Ratings'], errors='coerce')

# Filter data where 'Rating' is at least 3.8
filtered_data = data[data['Rating'] >= 3.8]

# Define the categories of interest
categories = ['Food', 'Tourist Attraction', 'Museum', 'Park', 'Shopping', 'Entertainment', 'Accommodation', 'Government']

# Collect the top 6 places per category for each city, based on 'Total Ratings', while avoiding duplicates
top_places_per_city = {}

# Group by city and then filter within each group
for city, group in filtered_data.groupby('City'):
    top_places_per_city[city] = {}
    used_indices = set()  # Set to keep track of used 'N' indices to avoid duplicates
    for category in categories:
        # Check if category exists in the dataframe to avoid KeyErrors
        if category in group.columns:
            # Filter places in each category where the place is relevant (marked by 1)
            category_group = group[group[category] == 1]
            # Sort and get the top entries not already used
            top_category_places = category_group.sort_values(by='Total Ratings', ascending=False)
            top_category_places = top_category_places[~top_category_places['N'].isin(used_indices)].head(6)
            top_places_per_city[city][category] = top_category_places
            # Add the indices of the selected places to the set to avoid reusing them
            used_indices.update(top_category_places['N'])

# Optionally, combine all data into one CSV file
all_data = pd.concat([pd.concat(info.values(), ignore_index=True) for info in top_places_per_city.values() if info], ignore_index=True)
if not all_data.empty:
    all_data.to_csv('all_cities_top_places.csv', index=False)
    print("All cities' top places saved to a combined CSV.")
